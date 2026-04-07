import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  user: mongoose.Types.ObjectId;
  category: 'infrastructure' | 'sanitation' | 'traffic' | 'water' | 'electricity' | 'other';
  title: string;
  description: string;
  media: string[];
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  mla?: string;
  civicBody?: string;
  privacy: 'public' | 'authorities_only' | 'anonymous';
  status: 'pending' | 'in_progress' | 'resolved';
  actionProof?: string[];
  publishedToFeed: boolean;
  feedPostId?: mongoose.Types.ObjectId;
}

const reportSchema = new Schema<IReport>({
  reportId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['infrastructure', 'sanitation', 'traffic', 'water', 'electricity', 'other'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  media: { type: [String], required: true },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  mla: String,
  civicBody: String,
  privacy: { 
    type: String, 
    enum: ['public', 'authorities_only', 'anonymous'],
    default: 'public'
  },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },
  actionProof: [String],
  publishedToFeed: { type: Boolean, default: false },
  feedPostId: { type: Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

reportSchema.index({ reportId: 1 });
reportSchema.index({ category: 1, status: 1 });
reportSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IReport>('Report', reportSchema);
