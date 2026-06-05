import { Response, NextFunction } from "express";
import admin from "../firebase";
import User from "../models/User";
import type { AuthRequest, FirebaseDecoded, DBUser } from "../types/auth";

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Middleware to authenticate Firebase ID Token
 * Verifies token and retrieves user from MongoDB
 */
export const authenticateFirebase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // =====================================================================
    // 1. EXTRACT AND VALIDATE TOKEN
    // =====================================================================

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
        error: "MISSING_TOKEN",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header format",
        error: "INVALID_FORMAT",
      });
    }

    // =====================================================================
    // 2. VERIFY FIREBASE TOKEN
    // =====================================================================

    let decodedToken: FirebaseDecoded;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error: any) {
      const errorCode = error.code || "INVALID_TOKEN";

      // Specific Firebase error messages
      let message = "Invalid or expired token";

      if (errorCode === "auth/argument-error") {
        message = "Invalid token format";
      } else if (errorCode === "auth/id-token-expired") {
        message = "Token has expired";
      } else if (errorCode === "auth/invalid-id-token") {
        message = "Invalid token";
      }

      return res.status(401).json({
        success: false,
        message,
        error: errorCode,
      });
    }

    // =====================================================================
    // 2.1 CHECK EMAIL VERIFICATION (OPTIONAL/CONFIGURABLE)
    // =====================================================================
    if (!decodedToken.email_verified) {
      // Podrías permitir ciertos endpoints (como /users/me) pero bloquear el resto
      // Aquí lo dejamos pasar para que el frontend maneje la redirección, 
      // o puedes ser estricto y retornar 403 aquí.
      console.warn(`User ${decodedToken.email} is not verified.`);
    }

    // =====================================================================
    // 3. FIND USER IN MONGODB
    // =====================================================================

    let dbUser: DBUser | null = null;
    try {
      const found = await User.findOne({ firebaseUid: decodedToken.uid }).select(
        "-__v"
      );

      if (found) {
        // Sincronización automática de verificación de email
        if (decodedToken.email_verified && !found.isVerified) {
          found.isVerified = true;
          await found.save();
          console.log(`Sync: User ${found.email} updated to verified in DB.`);
        }

        // cast mongoose doc to DBUser shape
        dbUser = {
          _id: String(found._id),
          role: found.role,
          email: found.email,
          name: found.name,
          lastName: found.lastName,
          firebaseUid: found.firebaseUid,
          isActive: found.isActive,
          isVerified: found.isVerified || false,
        } as DBUser;
      }
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching user from database",
        error: "DB_ERROR",
      });
    }

    // =====================================================================
    // 4. ATTACH TO REQUEST
    // =====================================================================

    req.firebaseUser = decodedToken;
    req.dbUser = dbUser;

    next();
  } catch (error: any) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: "AUTH_ERROR",
    });
  }
};

/**
 * Middleware to ensure user is authenticated and exists in database
 */
export const requireAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // This middleware expects `authenticateFirebase` to have run first in the
    // route chain. It only checks that the DB user exists.
    if (!req.dbUser) {
      return res.status(404).json({
        success: false,
        message: "User profile not found in database",
        error: "USER_NOT_FOUND",
      });
    }

    return next();
  } catch (error) {
    console.error("Required authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: "AUTH_ERROR",
    });
  }
};

export default authenticateFirebase;