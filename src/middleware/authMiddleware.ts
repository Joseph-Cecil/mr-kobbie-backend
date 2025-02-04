import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { id: string; role: string };
    req.user = decoded; // Attach the decoded token to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
  
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      req.user = decoded; // Attach the user object to req.user
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token." });
    }
  };

  export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };
  
