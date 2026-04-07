import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'like' | 'comment' | 'authority_response' | 'status_update';
  post?: mongoose.Types.ObjectId;
  from?: mongoose.Types.ObjectId;
  message?: string;
  read: boolean;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'authority_response', 'status_update'], required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', notificationSchema);
