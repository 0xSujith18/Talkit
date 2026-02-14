import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  isAuthorityResponse: boolean;
}

const commentSchema = new Schema<IComment>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isAuthorityResponse: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', commentSchema);
