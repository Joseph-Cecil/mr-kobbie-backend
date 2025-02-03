import mongoose, { Schema, Document } from "mongoose";

interface IStaffData extends Document {
  staffId: string;
  name: string;
  department: string;
  role: string;
  email?: string;
  phone?: string;
  [key: string]: any; // To allow dynamic fields from the Excel data
}

const StaffDataSchema = new Schema<IStaffData>(
  {
    staffId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

export const StaffData = mongoose.model<IStaffData>("StaffData", StaffDataSchema);
