import mongoose, { Document, Schema } from 'mongoose';

export interface IModerationReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: 'post' | 'comment' | 'user';
  targetId: mongoose.Types.ObjectId;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  reviewedBy?: mongoose.Types.ObjectId;
  action?: string;
}

const moderationReportSchema = new Schema<IModerationReport>({
  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['post', 'comment', 'user'], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  reason: { 
    type: String, 
    enum: ['spam', 'harassment', 'inappropriate', 'misinformation', 'other'],
    required: true 
  },
  description: String,
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'action_taken', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  action: String
}, { timestamps: true });

export default mongoose.model<IModerationReport>('ModerationReport', moderationReportSchema);
