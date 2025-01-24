import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { staffId, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ staffId, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { staffId, password } = req.body;

  try {
    const user = await User.findOne({ staffId });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
  
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized." });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect." });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error changing password.", error });
    }
  };


  // Reset Password (Admin Only)
export const resetPassword = async (req: Request, res: Response) => {
  const { userId, newPassword } = req.body;

  try {
    // Check if the requester is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password and update the user record
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: `Password reset successfully for user ${user.staffId}.`,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password.", error });
  }
};
  
