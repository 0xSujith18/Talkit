import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  caption: string;
  media?: string[];
  location?: {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  category: 'complaint' | 'appreciation';
  hashtags?: string[];
  likes: mongoose.Types.ObjectId[];
  status: 'pending' | 'in_progress' | 'resolved';
  visibilityScore: number;
}

const postSchema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, required: true },
  media: [String],
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  category: { type: String, enum: ['complaint', 'appreciation'], required: true },
  hashtags: [String],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
  visibilityScore: { type: Number, default: 0 }
}, { timestamps: true });

postSchema.index({ hashtags: 1 });
postSchema.index({ visibilityScore: -1 });

export default mongoose.model<IPost>('Post', postSchema);
