const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = conn;
  return cachedDb;
}

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  bio: String,
  role: { type: String, enum: ['citizen', 'authority', 'admin'], default: 'citizen' },
  isVerified: { type: Boolean, default: false },
  avatar: String,
  location: String,
  deletionScheduledAt: Date
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Post Schema
const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: String,
  media: [String],
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  category: { type: String, enum: ['complaint', 'appreciation'], default: 'complaint' },
  hashtags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
  visibilityScore: { type: Number, default: 0 }
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// Comment Schema
const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isAuthorityResponse: { type: Boolean, default: false }
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    await connectDB();
    const { username, name, email, password, phone, role } = req.body;
    
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ error: 'Email or username already registered' });
    
    const user = new User({ username, name, email, password, phone, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role, bio: user.bio, isVerified: user.isVerified } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.json({ 
      token, 
      user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role, bio: user.bio, isVerified: user.isVerified } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  await connectDB();
  const user = {
    id: req.user._id,
    username: req.user.username,
    name: req.user.name,
    email: req.user.email,
    bio: req.user.bio,
    role: req.user.role,
    isVerified: req.user.isVerified,
    avatar: req.user.avatar,
    phone: req.user.phone
  };
  res.json({ user });
});

app.get('/api/posts/feed', auth, async (req, res) => {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate('user', 'name email role isVerified avatar username')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    await connectDB();
    const { caption, media, location, category, hashtags } = req.body;
    
    const post = new Post({
      user: req.user._id,
      caption,
      media,
      location,
      category,
      hashtags: hashtags?.map(tag => tag.toLowerCase())
    });
    
    await post.save();
    await post.populate('user', 'name email role isVerified avatar username');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/like', auth, async (req, res) => {
  try {
    await connectDB();
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const index = post.likes.indexOf(req.user._id);
    if (index > -1) {
      post.likes.splice(index, 1);
      post.visibilityScore -= 1;
    } else {
      post.likes.push(req.user._id);
      post.visibilityScore += 1;
    }
    
    await post.save();
    await post.populate('user', 'name email role isVerified avatar username');
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/:id/comments', auth, async (req, res) => {
  try {
    await connectDB();
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'name email role isVerified avatar username')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts/:id/comment', auth, async (req, res) => {
  try {
    await connectDB();
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const comment = new Comment({
      post: post._id,
      user: req.user._id,
      text: req.body.text,
      isAuthorityResponse: req.user.role === 'authority'
    });
    
    await comment.save();
    await comment.populate('user', 'name email role isVerified avatar username');
    
    post.visibilityScore += 2;
    await post.save();
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/user/:userId', auth, async (req, res) => {
  try {
    await connectDB();
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name email role isVerified avatar username')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/posts/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { caption, hashtags } = req.body;
    post.caption = caption;
    post.hashtags = hashtags;
    await post.save();
    await post.populate('user', 'name email role isVerified avatar username');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/trending', auth, async (req, res) => {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate('user', 'name email role isVerified avatar username')
      .sort({ visibilityScore: -1, createdAt: -1 })
      .limit(20);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/auth/profile', auth, async (req, res) => {
  try {
    await connectDB();
    const { username, name, bio, phone, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, name, bio, phone, location },
      { new: true }
    ).select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/auth/account', auth, async (req, res) => {
  try {
    await connectDB();
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 7);
    
    await User.findByIdAndUpdate(req.user._id, { 
      deletionScheduledAt: deletionDate 
    });
    
    res.json({ message: 'Account scheduled for deletion in 7 days' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
