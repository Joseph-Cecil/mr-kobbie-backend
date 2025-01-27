import { Document } from "mongoose";
import { IUser } from "../models/User";

// Define the fields to expose in the profile response
export const sanitizeUserData = (user: IUser) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    staffId: user.staffId,
    role: user.role,
    // createdAt: user.createdAt,
    // updatedAt: user.updatedAt,
  };
};
