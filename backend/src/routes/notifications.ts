import { Router } from 'express';
import Notification from '../models/Notification.js';
import { auth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const notifications = await Notification.find({ user: req.user!._id })
      .populate('from', 'name avatar')
      .populate('post', 'caption')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/:id/read', auth, async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { read: true },
      { new: true }
    );
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
