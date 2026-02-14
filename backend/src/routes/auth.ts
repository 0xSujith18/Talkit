import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import VerificationRequest from '../models/VerificationRequest.js';
import { auth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password, phone, role } = req.body;
    
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ error: 'Email or username already registered' });
    
    const user = new User({ username, name, email, password, phone, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username,
        name: user.name, 
        email: user.email, 
        role: user.role,
        bio: user.bio,
        isVerified: user.isVerified
      } 
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username,
        name: user.name, 
        email: user.email, 
        role: user.role,
        bio: user.bio,
        isVerified: user.isVerified
      } 
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/me', auth, async (req: AuthRequest, res) => {
  const user = {
    id: req.user!._id,
    username: req.user!.username,
    name: req.user!.name,
    email: req.user!.email,
    bio: req.user!.bio,
    role: req.user!.role,
    isVerified: req.user!.isVerified,
    avatar: req.user!.avatar,
    phone: req.user!.phone
  };
  res.json({ user });
});

router.patch('/profile', auth, async (req: AuthRequest, res) => {
  try {
    const { username, name, bio, phone, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { username, name, bio, phone, location },
      { new: true }
    ).select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/request-verification', auth, async (req: AuthRequest, res) => {
  try {
    const { fullName, category, organization, position, idProof, reason } = req.body;
    const request = new VerificationRequest({
      user: req.user!._id,
      fullName,
      category,
      organization,
      position,
      idProof,
      reason
    });
    await request.save();
    res.json({ message: 'Verification request submitted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/verification-requests', auth, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const requests = await VerificationRequest.find({ status: 'pending' })
      .populate('user', 'name username email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/verify-user/:userId', auth, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    await User.findByIdAndUpdate(req.params.userId, { isVerified: true });
    await VerificationRequest.findOneAndUpdate(
      { user: req.params.userId },
      { status: 'approved' }
    );
    res.json({ message: 'User verified' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/verification-request/:id', auth, async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    await VerificationRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/account', auth, async (req: AuthRequest, res) => {
  try {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 7);
    
    await User.findByIdAndUpdate(req.user!._id, { 
      deletionScheduledAt: deletionDate 
    });
    
    res.json({ message: 'Account scheduled for deletion in 7 days' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
