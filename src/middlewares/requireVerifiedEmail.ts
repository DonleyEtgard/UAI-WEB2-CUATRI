import { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth";

/**
 * Middleware to enforce email verification for Admin and Employee roles.
 * Superadmins are exempt.
 */
export const requireVerifiedEmail = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.dbUser;
  const firebaseUser = req.firebaseUser;

  if (!user || !firebaseUser) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Superadmin is exempt
  if (user.role === "superadmin") {
    return next();
  }

  // Block admin and employee if email is not verified in Firebase
  if (!firebaseUser.email_verified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email",
      error: "EMAIL_NOT_VERIFIED",
    });
  }

  next();
};