import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
import { deleteUser, getAllUsers } from "../controllers/adminController";
import { uploadStaffData } from "../controllers/staffDataController";

const router = express.Router();

// Get all users (Admin only)
router.get("/users", authenticateUser, authorizeAdmin, getAllUsers );
router.post("/upload", authenticateUser, authorizeAdmin, uploadStaffData);
router.delete("/user/:id", authenticateUser, authorizeAdmin, deleteUser);


export default router;
