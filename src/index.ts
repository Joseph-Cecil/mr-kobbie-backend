import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection failed:", err));

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.send({ message: "Health is OK" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
