import { Request, Response } from "express";
import { StaffData } from "../models/staffData";

export const uploadStaffData = async (req: Request, res: Response) => {
  try {
    const workbookData: Record<string, unknown[]> = req.body; // Expecting an object with sheet names

    if (!workbookData || typeof workbookData !== "object") {
      return res.status(400).json({ message: "Invalid or empty data." });
    }

    const allOperations: Promise<any>[] = [];

    // Loop through each sheet in the workbook
    for (const sheetName in workbookData) {
      if (!Array.isArray(workbookData[sheetName])) continue; // Skip invalid sheets

      const staffDataArray = workbookData[sheetName] as Record<string, unknown>[];

      for (const data of staffDataArray) {
        const staffId = data["STAFF NUMBER"] as string;
        const name = data["STAFF NAME"] as string;

        if (!staffId || !name) continue; // Skip if missing required fields

        // Extract monthly contributions dynamically
        const contributions: Record<string, number> = {};
        const months = [
          "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
          "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];

        months.forEach((month) => {
          if (data[month] !== undefined) {
            contributions[month] = Number(data[month]) || 0;
          }
        });

        // Extract additional financial data
        const totalContribution = Number(data["TOTAL CONTRIBUTION"]) || 0;
        const topUpDeposit = Number(data["DEPOSIT - TOP UP"]) || 0;
        const partialWithdrawal = Number(data["PARTIAL WITHDRAWAL"]) || 0;
        const balanceForTheYear = Number(data["BALANCE FOR THE YEAR"]) || 0;

        // Create or update staff data
        const operation = StaffData.findOneAndUpdate(
          { staffId }, // Search by staffId
          {
            name,
            contributions,
            totalContribution,
            topUpDeposit,
            partialWithdrawal,
            balanceForTheYear,
          },
          { upsert: true, new: true }
        );

        allOperations.push(operation);
      }
    }

    await Promise.all(allOperations); // Wait for all updates to complete

    res.status(200).json({ message: "Staff data uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading staff data:", error);
    res.status(500).json({ message: "Error processing staff data.", error });
  }
};
