import mongoose, { Schema, Document } from "mongoose";

interface IStaffData extends Document {
  staffId: number;
  name: string;
  contributions: Record<string, number>; // Stores months dynamically
  totalContribution?: number;
  topUpDeposit?: number;
  partialWithdrawal?: number;
  totalContributionPaid?: number;
  balanceForTheYear?: number;
}

const StaffDataSchema = new Schema<IStaffData>(
  {
    staffId: { type: Number, required: true, unique: true }, // STAFF NUMBER
    name: { type: String, required: true }, // STAFF NAME
    contributions: { type: Map, of: Number }, // Monthly contributions
    totalContribution: { type: Number, default: 0 },
    topUpDeposit: { type: Number, default: 0 },
    partialWithdrawal: { type: Number, default: 0 },
    totalContributionPaid: { type: Number, default: 0 },
    balanceForTheYear: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const StaffData = mongoose.model<IStaffData>("StaffData", StaffDataSchema);
