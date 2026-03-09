import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// One-time admin setup endpoint
router.post('/setup-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@talkit.com' });
    
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin account already exists',
        email: 'admin@talkit.com',
        note: 'Use password: admin123'
      });
    }

    // Create admin user
    const admin = new User({
      username: 'admin',
      name: 'Admin',
      email: 'admin@talkit.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      bio: 'System Administrator'
    });

    await admin.save();

    res.json({ 
      message: 'Admin account created successfully',
      email: 'admin@talkit.com',
      password: 'admin123',
      warning: 'Please change the password after first login!'
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
