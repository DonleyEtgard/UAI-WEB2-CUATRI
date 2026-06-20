import { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth";

// =======================================================
// 🔐 ADMIN O SUPERADMIN
// =======================================================
export const authorizeAdminOrSuperadmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.dbUser;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        error: "NO_USER",
      });
    }

    if (!["admin", "superadmin"].includes(user.role)) {
      return res.status(403).json({
        message: "Only admin or superadmin allowed",
        error: "FORBIDDEN_ADMIN",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization error",
    });
  }
};

// =======================================================
// 👑 SOLO SUPERADMIN
// =======================================================
export const authorizeSuperadminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.dbUser;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        error: "NO_USER",
      });
    }

    if (user.role !== "superadmin") {
      return res.status(403).json({
        message: "Only superadmin allowed",
        error: "FORBIDDEN_SUPERADMIN",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization error",
    });
  }
};

// =======================================================
// 👤 EMPLOYEE O SUPERIOR (OPCIONAL)
// =======================================================
export const authorizeEmployeeOrAbove = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.dbUser;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!["employee", "admin", "superadmin"].includes(user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization error",
    });
  }
};