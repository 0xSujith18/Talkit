import mongoose, { Document, Schema } from 'mongoose';

export interface IVerificationCode extends Document {
  user: mongoose.Types.ObjectId;
  code: string;
  expiresAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IVerificationCode>('VerificationCode', verificationCodeSchema);
