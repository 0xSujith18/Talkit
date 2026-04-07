import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@talkit.com' });
    
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email: admin@talkit.com');
      console.log('Password: admin123');
      process.exit(0);
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

    console.log('✅ Admin account created successfully!');
    console.log('-----------------------------------');
    console.log('Email: admin@talkit.com');
    console.log('Password: admin123');
    console.log('-----------------------------------');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
