import { Router } from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import { auth, authorityOnly, AuthRequest } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/', auth, rateLimit(10, 60000), async (req: AuthRequest, res) => {
  try {
    const { caption, media, location, category, hashtags } = req.body;
    
    const post = new Post({
      user: req.user!._id,
      caption,
      media,
      location,
      category,
      hashtags: hashtags?.map((tag: string) => tag.toLowerCase())
    });
    
    await post.save();
    await post.populate('user', 'name email role isVerified');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { caption, hashtags } = req.body;
    post.caption = caption;
    post.hashtags = hashtags;
    await post.save();
    await post.populate('user', 'name email role isVerified avatar');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const posts = await Post.find()
      .populate('user', 'name email role isVerified avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Post.countDocuments();
    
    res.json({ posts, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/trending', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email role isVerified avatar')
      .sort({ visibilityScore: -1, createdAt: -1 })
      .limit(20);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/:id/like', auth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const index = post.likes.indexOf(req.user!._id);
    if (index > -1) {
      post.likes.splice(index, 1);
      post.visibilityScore -= 1;
    } else {
      post.likes.push(req.user!._id);
      post.visibilityScore += 1;
      
      if (post.user.toString() !== req.user!._id.toString()) {
        await Notification.create({
          user: post.user,
          type: 'like',
          post: post._id,
          from: req.user!._id,
          message: `${req.user!.name} liked your post`
        });
      }
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/:id/comment', auth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const comment = new Comment({
      post: post._id,
      user: req.user!._id,
      text: req.body.text,
      isAuthorityResponse: req.user!.role === 'authority'
    });
    
    await comment.save();
    await comment.populate('user', 'name email role isVerified avatar');
    
    post.visibilityScore += 2;
    await post.save();
    
    if (post.user.toString() !== req.user!._id.toString()) {
      await Notification.create({
        user: post.user,
        type: req.user!.role === 'authority' ? 'authority_response' : 'comment',
        post: post._id,
        from: req.user!._id,
        message: `${req.user!.name} commented on your post`
      });
    }
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'name email role isVerified avatar')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/:id/status', auth, authorityOnly, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'name email role isVerified');
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    await Notification.create({
      user: post.user._id,
      type: 'status_update',
      post: post._id,
      from: req.user!._id,
      message: `Your post status updated to ${req.body.status}`
    });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/hashtag/:tag', auth, async (req, res) => {
  try {
    const posts = await Post.find({ hashtags: req.params.tag.toLowerCase() })
      .populate('user', 'name email role isVerified avatar')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name email role isVerified avatar')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
