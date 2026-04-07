import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import VerificationRequest from '../models/VerificationRequest.js';
import PasswordReset from '../models/PasswordReset.js';
import VerificationCode from '../models/VerificationCode.js';
import { auth, AuthRequest } from '../middleware/auth.js';

import nodemailer from 'nodemailer';

const router = Router();

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
    if (!user) {
      return res.status(401).json({ error: 'Email not found' });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Incorrect password' });
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

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If email exists, reset link will be sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await PasswordReset.create({ user: user._id, token, expiresAt });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Talkit Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #bc1888;">Talkit Password Reset</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to set a new one:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #bc1888; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.</p>
          <p>Best regards,<br>The Talkit Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Reset email sent to:', email);
    } catch (mailError) {
      console.error('Error sending email:', mailError);
      // We still return success to the user for security/privacy reasons
    }

    res.json({ message: 'If email exists, reset link will be sent' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const resetRequest = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(resetRequest.user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.password = newPassword;
    await user.save();
    await PasswordReset.deleteMany({ user: user._id });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/send-verification-code', auth, async (req: AuthRequest, res) => {
  try {
    const { code } = req.body;
    const expiresAt = new Date(Date.now() + 600000); // 10 minutes

    await VerificationCode.deleteMany({ user: req.user!._id });
    await VerificationCode.create({ user: req.user!._id, code, expiresAt });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user!.email,
      subject: 'Talkit - Verify Your Password Change',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #bc1888;">Verify Your Password Change</h2>
          <p>Hello ${req.user!.name},</p>
          <p>You requested to change your password. Use the verification code below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #bc1888;">${code}</div>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email and secure your account.</p>
          <p>Best regards,<br>The Talkit Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Verification code sent' });
    } catch (mailError) {
      console.error('Error sending email:', mailError);
      res.status(500).json({ error: 'Failed to send verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/password', auth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/personal', auth, async (req: AuthRequest, res) => {
  try {
    const { phone, birthday } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { phone, birthday },
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
