import { Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  staffId: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}