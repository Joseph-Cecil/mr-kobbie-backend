import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StaffData } from "../models/staffData";

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, staffId, password, role } = req.body;

  // Validate input data
  if (!firstName || !lastName || !staffId || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Ensure staffId is a number and remove extra spaces
  const cleanStaffId = Number(String(staffId).trim());

  // Validate role
  const allowedRoles = ["admin", "staff"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}` });
  }

  try {
    // Check if staffId is already registered
    const existingUser = await User.findOne({ staffId: cleanStaffId });
    if (existingUser) {
      return res.status(409).json({ message: "Staff ID is already registered." });
    }

    // Check if staffId exists in uploaded staff data
    const staffData = await StaffData.findOne({ staffId: cleanStaffId });

    if (!staffData) {
      console.log(`No staff data found for Staff ID: ${cleanStaffId}`);
    } else {
      console.log(`Found staff data: ${staffData._id}`);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      firstName,
      lastName,
      staffId: cleanStaffId,
      password: hashedPassword,
      role,
      staffData: staffData ? staffData._id : null, // Link staff data if found
    });

    await user.save();

    console.log(`User registered: ${user}`);

    return res.status(201).json({ message: "Staff registered successfully.", user });
  } catch (error) {
    console.error("Error registering staff:", error);
    return res.status(500).json({ message: "Error registering user.", error: (error as any).message });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { staffId, password } = req.body;

  try {
    const user = await User.findOne({ staffId });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, staffId: user.staffId, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  // Validate input fields
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both old and new passwords are required." });
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Check if the new password is the same as the old one
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    // Update the password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while changing the password.", error: (error as any).message });
  }
};

  // Reset Password (Admin Only)
  export const resetPassword = async (req: Request, res: Response) => {
    const { staffId, newPassword } = req.body;

    try {
        const user = await User.findOne({ staffId }); 

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password reset successfully!" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password.", error });
    }
};