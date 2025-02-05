import express from "express";
import { getInterest, getStaffData, getUserProfile } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Route to get user profile
router.get("/profile", authenticate, getUserProfile);
router.get("/staff-data", authenticate, getStaffData);
router.get("/get-interest", authenticate, getInterest);


export default router;
