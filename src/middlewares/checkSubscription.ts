import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const checkSubscription = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.dbUser._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();

    if (user.plan === "suspended") {
      return res.status(403).json({ message: "Account suspended" });
    }

    if (user.subscriptionEnd && user.subscriptionEnd < now) {
      user.plan = "suspended";
      await user.save();

      return res.status(403).json({
        message: "Subscription expired. Please pay $3000 HTG"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: "Subscription check error" });
  }
};