import { Request, Response } from "express";
import User from "../models/User"; // Assuming you have a user model
import { sanitizeUserData } from "../utils/sanitizeUserData"; // Utility to sanitize the response
import { StaffData } from "../models/staffData";

/**
 * Fetch user profile data for the profile page
 * @route GET /api/users/profile
 * @access Private (Authenticated Users Only)
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure the user is authenticated (req.user is populated by middleware)
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized access." });
      return;
    }

    // Fetch the user from the database
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from the result

    // Check if the user exists
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Sanitize the user data to expose only necessary fields
    const sanitizedUserData = sanitizeUserData(user);

    // Send the sanitized data as the response
    res.status(200).json(sanitizedUserData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};



export const getStaffData = async (req: Request, res: Response) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.staffId) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Find staff data based on the staffId
    const staffData = await StaffData.findOne({ staffId: req.user.staffId });

    if (!staffData) {
      return res.status(404).json({ message: "Staff data not found." });
    }

    return res.status(200).json(staffData);
  } catch (error) {
    console.error("Error fetching staff data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


