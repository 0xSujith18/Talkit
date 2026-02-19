import { Router } from 'express';
import ModerationReport from '../models/ModerationReport.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { auth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/report', auth, async (req: AuthRequest, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;
    
    const report = new ModerationReport({
      reporter: req.user!._id,
      targetType,
      targetId,
      reason,
      description
    });
    
    await report.save();
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/reports', auth, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const reports = await ModerationReport.find({ status: 'pending' })
      .populate('reporter', 'name username')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/reports/:id', auth, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { status, action } = req.body;
    const report = await ModerationReport.findByIdAndUpdate(
      req.params.id,
      { status, action, reviewedBy: req.user!._id },
      { new: true }
    );
    
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    if (status === 'action_taken') {
      if (report.targetType === 'post') {
        await Post.findByIdAndDelete(report.targetId);
      } else if (report.targetType === 'comment') {
        await Comment.findByIdAndDelete(report.targetId);
      }
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
