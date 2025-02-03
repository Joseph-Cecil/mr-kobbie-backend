import { Request, Response } from "express";
import { StaffData } from "../models/staffData";

export const uploadStaffData = async (req: Request, res: Response) => {
  try {
    const staffDataArray = req.body; // JSON array from frontend

    if (!Array.isArray(staffDataArray) || staffDataArray.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data." });
    }

    const operations = staffDataArray.map(async (data) => {
      const { staffId, ...rest } = data;

      if (!staffId) return null; // Skip if no staffId is found

      return StaffData.findOneAndUpdate(
        { staffId }, // Search by staffId
        { $set: rest }, // Update the data
        { upsert: true, new: true } // Create if not exists
      );
    });

    await Promise.all(operations);

    res.status(200).json({ message: "Staff data uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading staff data:", error);
    res.status(500).json({ message: "Error processing staff data.", error });
  }
};
