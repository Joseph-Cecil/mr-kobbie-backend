import { Request, Response } from "express";
import User from "../models/User";

// Controller to fetch all users (Admin Only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
    console.log(users)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};