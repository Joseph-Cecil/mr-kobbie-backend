import { Request, Response } from "express";
import { StaffData } from "../models/staffData";

export const uploadStaffData = async (req: Request, res: Response) => {
  try {
    const staffDataArray = req.body; // JSON array from frontend

    if (!Array.isArray(staffDataArray) || staffDataArray.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data." });
    }

    const operations = staffDataArray.map(async (data) => {
      const staffId = data["STAFF NUMBER"];
      const name = data["STAFF NAME"];

      if (!staffId || !name) return null; // Skip if required fields are missing

      // Extract monthly contributions dynamically
      const contributions: Record<string, number> = {};
      const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
      ];

      months.forEach((month) => {
        if (data[month]) {
          contributions[month] = Number(data[month]) || 0;
        }
      });

      // Extract additional financial data
      const totalContribution = Number(data[" TOTAL CONTRIBUTION "]) || 0;
      const topUpDeposit = Number(data[" DEPOSIT - TOP UP "]) || 0;
      const partialWithdrawal = Number(data[" PARTIAL WITHDRAWAL "]) || 0;
      const totalContributionPaid = Number(data[" TOTAL CONTRIBUTION PAID "]) || 0;
      const balanceForTheYear = Number(data[" BALANCE FOR THE YEAR "]) || 0;

      return StaffData.findOneAndUpdate(
        { staffId }, // Search by staffId
        {
          name,
          contributions,
          totalContribution,
          topUpDeposit,
          partialWithdrawal,
          totalContributionPaid,
          balanceForTheYear,
        },
        { upsert: true, new: true }
      );
    });

    await Promise.all(operations);

    res.status(200).json({ message: "Staff data uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading staff data:", error);
    res.status(500).json({ message: "Error processing staff data.", error });
  }
};
