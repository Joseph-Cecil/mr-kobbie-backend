import express from "express";
import { getStaffData, getUserProfile } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Route to get user profile
router.get("/profile", authenticate, getUserProfile);
router.get("/data", authenticate, getStaffData);

export default router;
