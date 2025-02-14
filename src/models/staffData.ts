import mongoose, { Schema, Document } from "mongoose";

interface IStaffData extends Document {
  staffId: number;
  name: string;
  contributions: Record<string, number>; // Stores months dynamically
  totalContribution?: number;
  topUpDeposit?: number;
  partialWithdrawal?: number;
  balanceForTheYear?: number;
}

const StaffDataSchema = new Schema<IStaffData>(
  {
    staffId: { type: Number, required: true, unique: true }, // STAFF NUMBER
    name: { type: String, required: true },
    contributions: { type: Map, of: Number },
    totalContribution: { type: Number, default: 0 },
    topUpDeposit: { type: Number, default: 0 },
    partialWithdrawal: { type: Number, default: 0 },
    balanceForTheYear: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const StaffData = mongoose.model<IStaffData>("StaffData", StaffDataSchema);
