import mongoose, { Document, Schema } from 'mongoose';

export interface IVerificationRequest extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  category: string;
  organization: string;
  position: string;
  idProof: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const verificationRequestSchema = new Schema<IVerificationRequest>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  category: { type: String, required: true },
  organization: { type: String, required: true },
  position: { type: String, required: true },
  idProof: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<IVerificationRequest>('VerificationRequest', verificationRequestSchema);
