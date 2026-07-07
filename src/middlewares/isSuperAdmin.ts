import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const isSuperAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const firebaseUser = req.firebaseUser;

    const user = await User.findOne({
      firebaseUid: firebaseUser.uid
    });

    if (!user || user.role !== "superadmin") {
      return res.status(403).json({
        message: "Only superadmin can perform this action"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: "Error validating superadmin"
    });
  }
};