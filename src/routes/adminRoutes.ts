import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware";
import { getAllUsers } from "../controllers/adminController";

const router = express.Router();

// Get all users (Admin only)
router.get("/users", authenticateUser, authorizeAdmin, getAllUsers );

export default router;
