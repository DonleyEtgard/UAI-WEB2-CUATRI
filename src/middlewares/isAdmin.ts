import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const firebaseUser = req.firebaseUser;

    if (!firebaseUser) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // 🔥 buscar en Mongo usando firebaseUid
    const user = await User.findOne({
      firebaseUid: firebaseUser.uid
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied (admin only)"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: "Error validating admin"
    });
  }
};