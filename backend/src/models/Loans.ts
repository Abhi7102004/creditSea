import mongoose, { Document, Schema } from 'mongoose';

export enum ApplicationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  APPROVED = 'approved'
}

export interface ILoanApplication extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  term: number; 
  purpose: string;
  status: ApplicationStatus;
  verifiedBy?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  verificationDate?: Date;
  approvalDate?: Date;
  rejectionReason?: string;
}

const LoanApplicationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  term: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.PENDING
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  approvalDate: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

const LoanApplication = mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);

export default LoanApplication;