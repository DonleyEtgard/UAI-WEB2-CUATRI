import { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth";

export const authorizeAdminOrSuperadmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.dbUser) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        error: "NO_AUTH",
      });
    }

    if (!["admin", "superadmin"].includes(req.dbUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource",
        error: "FORBIDDEN_ADMIN",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization error",
      error: "AUTH_ERROR",
    });
  }
};

export default authorizeAdminOrSuperadmin;
