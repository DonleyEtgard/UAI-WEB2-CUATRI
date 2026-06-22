
import { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth";

// ============================================================================
// ROLE-BASED MIDDLEWARES
// ============================================================================

/**
 * Middleware to require superadmin role
 */
export const authorizeSuperadminOnly = (
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

    if (req.dbUser.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only superadmins can access this resource",
        error: "FORBIDDEN_SUPERADMIN",
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

/**
 * Middleware to require admin or superadmin role
 */
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

/**
 * Middleware to require employee or higher role
 */
export const authorizeEmployee = (
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

    if (!["employee", "admin", "superadmin"].includes(req.dbUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        error: "FORBIDDEN",
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

/**
 * Middleware factory to check multiple roles
 */
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.dbUser) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
          error: "NO_AUTH",
        });
      }

      if (!allowedRoles.includes(req.dbUser.role)) {
        return res.status(403).json({
          success: false,
          message: `This resource requires one of: ${allowedRoles.join(", ")}`,
          error: "FORBIDDEN",
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
};
