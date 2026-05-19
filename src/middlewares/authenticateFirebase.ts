import { Request, Response, NextFunction } from "express";
import admin from "../firebase";
import User from "../models/User";

export const authenticateFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 🔥 buscar usuario en Mongo
    const dbUser = await User.findOne({
      firebaseUid: decodedToken.uid,
    });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found in DB" });
    }

    // 🔥 guardar en request
    (req as any).firebaseUser = decodedToken;
    (req as any).dbUser = dbUser;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};