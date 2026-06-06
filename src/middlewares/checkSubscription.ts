import { Response, NextFunction } from "express";
import User from "../models/User";

export const checkSubscription = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.dbUser?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const now = new Date();

    // =====================================================
    // SUPERADMIN SIEMPRE TIENE ACCESO
    // =====================================================

    if (user.role === "superadmin") {
      return next();
    }

    // =====================================================
    // SOLO LOS ADMINS NECESITAN SUSCRIPCIÓN
    // =====================================================

    if (user.role !== "admin") {
      return next();
    }

    // =====================================================
    // CUENTA SUSPENDIDA
    // =====================================================

    if (user.subscriptionStatus === "suspended") {
      return res.status(403).json({
        message: "Account suspended",
      });
    }

    // =====================================================
    // PERÍODO DE PRUEBA GRATIS
    // =====================================================

    if (
      user.plan === "free" &&
      user.trialEnd &&
      user.trialEnd > now
    ) {
      return next();
    }

    if (
      user.plan === "free" &&
      user.trialEnd &&
      user.trialEnd <= now
    ) {
      user.subscriptionStatus = "expired";

      await user.save();

      return res.status(403).json({
        message:
          "Your free trial has ended. Please subscribe.",
      });
    }

    if (!user.subscriptionEnd) {
      return res.status(403).json({
        message: "No active subscription",
      });
    }

    if (user.subscriptionEnd <= now) {
      user.subscriptionStatus = "expired";

      await user.save();

      return res.status(403).json({
        message:
          "Your subscription has expired. Please renew your plan.",
      });
    }

    if (user.subscriptionStatus === "pending") {
      return res.status(403).json({
        message: "Pending subscription payment",
      });
    }

    if (user.subscriptionStatus !== "active") {
      return res.status(403).json({
        message: "Subscription inactive",
      });
    }

    return next();

  } catch (error) {
    console.error(
      "Subscription middleware error:",
      error
    );

    return res.status(500).json({
      message: "Subscription validation error",
    });
  }
};