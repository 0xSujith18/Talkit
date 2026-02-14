import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
  role: 'citizen' | 'authority' | 'admin';
  isVerified: boolean;
  avatar?: string;
  location?: string;
  deletionScheduledAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
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

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
