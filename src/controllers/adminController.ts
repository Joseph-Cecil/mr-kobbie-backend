import { Request, Response } from "express";
import User from "../models/User";
import {Interest} from "../models/interest";

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


export const setInterest = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { interest } = req.body;

    if (interest === undefined || interest === null) {
      return res.status(400).json({ message: "Interest value is required." });
    }

    const newInterest = new Interest({
      value: interest,
      setBy: req.user.staffId, 
    });

    await newInterest.save();

    return res.status(201).json({ message: "Interest set successfully.", data: newInterest });
  } catch (error) {
    console.error("Error setting interest:", error);
    return res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};
