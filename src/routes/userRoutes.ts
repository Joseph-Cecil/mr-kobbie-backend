import express from "express";
import { getUserProfile } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Route to get user profile
router.get("/profile", authenticate, getUserProfile);

export default router;
