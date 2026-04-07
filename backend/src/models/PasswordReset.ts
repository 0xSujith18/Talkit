import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordReset extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IPasswordReset>('PasswordReset', passwordResetSchema);
