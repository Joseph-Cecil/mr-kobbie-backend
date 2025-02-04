import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  staffId: number;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  staffData?: mongoose.Types.ObjectId; // Reference to StaffData

}
const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    staffId: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], required: true },
    staffData: { type: Schema.Types.ObjectId, ref: "StaffData" }, // Correct reference
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
