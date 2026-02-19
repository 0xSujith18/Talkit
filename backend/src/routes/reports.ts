import { Router } from 'express';
import Report from '../models/Report.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import { auth, authorityOnly, AuthRequest } from '../middleware/auth.js';

const router = Router();

const generateReportId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TLK-${timestamp}-${random}`;
};

router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const { category, title, description, media, location, mla, civicBody, privacy } = req.body;
    
    if (!media || media.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }
    
    const report = new Report({
      reportId: generateReportId(),
      user: req.user!._id,
      category,
      title,
      description,
      media,
      location,
      mla,
      civicBody,
      privacy
    });
    
    await report.save();
    await report.populate('user', 'name username email role isVerified');
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/:id/publish', auth, async (req: AuthRequest, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (report.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    if (report.publishedToFeed) {
      return res.status(400).json({ error: 'Already published to feed' });
    }
    
    const post = new Post({
      user: report.privacy === 'anonymous' ? req.user!._id : report.user,
      caption: `${report.title}\n\n${report.description}\n\nReport ID: ${report.reportId}`,
      media: report.media,
      location: report.location,
      category: 'complaint',
      hashtags: [report.category, 'report']
    });
    
    await post.save();
    
    report.publishedToFeed = true;
    report.feedPostId = post._id;
    await report.save();
    
    res.json({ report, post });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;
    
    const filter: any = {};
    
    if (req.user!.role === 'citizen') {
      filter.user = req.user!._id;
    } else if (category) {
      filter.category = category;
    }
    
    if (status) filter.status = status;
    
    const reports = await Report.find(filter)
      .populate('user', 'name username email role isVerified')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Report.countDocuments(filter);
    
    res.json({ reports, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'name username email role isVerified');
    
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    if (report.privacy === 'authorities_only' && 
        req.user!.role === 'citizen' && 
        report.user._id.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/:id/status', auth, authorityOnly, async (req: AuthRequest, res) => {
  try {
    const { status, actionProof } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, ...(actionProof && { $push: { actionProof } }) },
      { new: true }
    ).populate('user', 'name username email');
    
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    await Notification.create({
      user: report.user._id,
      type: 'status_update',
      from: req.user!._id,
      message: `Report ${report.reportId} status updated to ${status}`
    });
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/analytics/summary', auth, authorityOnly, async (req: AuthRequest, res) => {
  try {
    const total = await Report.countDocuments();
    const pending = await Report.countDocuments({ status: 'pending' });
    const inProgress = await Report.countDocuments({ status: 'in_progress' });
    const resolved = await Report.countDocuments({ status: 'resolved' });
    
    const byCategory = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({ total, pending, inProgress, resolved, byCategory });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
