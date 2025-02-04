import mongoose, { Schema, Document } from "mongoose";

interface IInterest extends Document {
  value: number;
  setBy: string; // Staff ID of the admin who set the interest
  createdAt: Date;
}

const InterestSchema: Schema = new Schema(
  {
    value: { type: Number, required: true },
    setBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Interest = mongoose.model<IInterest>("Interest", InterestSchema);
