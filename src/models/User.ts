import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  staffId: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  staffId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
