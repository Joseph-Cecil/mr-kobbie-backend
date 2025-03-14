import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
import { deleteUser, getAllUsers, setInterest } from "../controllers/adminController";
import { getAllStaffData, uploadStaffData } from "../controllers/staffDataController";
import { getStaffData } from "../controllers/userController";

const router = express.Router();

// Get all users (Admin only)
router.get("/users", authenticateUser, authorizeAdmin, getAllUsers );
router.post("/upload-excel", authenticateUser, authorizeAdmin, uploadStaffData);
router.get("/get-staff-data", authenticateUser, authorizeAdmin, getAllStaffData)
router.post("/set-interest", authenticateUser, authorizeAdmin, setInterest);
router.delete("/user/:id", authenticateUser, authorizeAdmin, deleteUser);


export default router;
