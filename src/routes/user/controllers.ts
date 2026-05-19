import axios from "axios";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import admin from "../../firebase";
import User from "../../models/User";

const signToken = (user: { _id: any; role: string }) => {
  return jwt.sign(
    {
      userId: String(user._id),
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

// ==========================
// 👤 REGISTER
// ==========================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastName, role, address } = req.body;

    if (!email || !password || !name || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "superadmin") {
      return res.status(403).json({ message: "Not allowed to create superadmin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRecord = await admin.auth().createUser({ email, password });

    const now = new Date();
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3);

    const mongoRole = role && typeof role === "string" ? role : "user";

    const user = new User({
      name,
      lastName,
      email,
      firebaseUid: userRecord.uid,
      role: mongoRole,
      plan: "free",
      isVerified: false,
      isActive: true,
      subscriptionStart: now,
      subscriptionEnd,
      address: {
        street: address?.street || "",
        number: address?.number || "",
        city: address?.city || "",
        state: address?.state || "",
        country: address?.country || "Argentina",
        postalCode: address?.postalCode || "",
      },
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(500).json({
      message: "Error while registering user",
      error: error.message,
    });
  }
};

// ==========================
// 👑 GET USERS (superadmin only)
// ==========================
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// ==========================
// 👤 GET ME
// ==========================
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching me",
      error: error.message,
    });
  }
};

// ==========================
// 👤 GET USER BY ID (ownership o superadmin via middleware)
// ==========================
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// ==========================
// 🔐 LOGIN (Firebase email+password → JWT propio)
// ==========================
export const loginWithEmailPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const apiKey = process.env.FIREBASE_API_KEY ?? process.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "FIREBASE_API_KEY or VITE_FIREBASE_API_KEY missing" });

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    const dbUser = await User.findOne({ email });

    if (!dbUser) return res.status(404).json({ message: "User not found" });
    if (!dbUser.isActive) return res.status(403).json({ message: "User is disabled" });

    const token = signToken(dbUser);

    return res.json({
      token,
      user: {
        id: String(dbUser._id),
        _id: String(dbUser._id),
        email: dbUser.email,
        role: dbUser.role,
        isActive: dbUser.isActive,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      message: "Login failed",
      error: error.response?.data || error.message,
    });
  }
};

// ==========================
// 💳 PAYMENT SUBSCRIPTION (JWT)
// ==========================
export const paySubscription = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { paymentMethod } = req.body;

    const basePrice = 3000;
    let total = basePrice;
    if (paymentMethod === "moncash") total += basePrice * 0.05;

    const now = new Date();

    user.plan = "basic";
    user.subscriptionStart = now;
    user.subscriptionEnd = new Date(now.setMonth(now.getMonth() + 1));

    await user.save();

    res.json({
      message: "Subscription updated",
      paymentMethod,
      totalPaid: total,
      qrCode: paymentMethod === "moncash" ? `QR-${user._id}-${Date.now()}` : null,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating subscription", error: error.message });
  }
};

// ==========================
// 💳 CREATE PAYMENT (QR)
// ==========================
export const createSubscriptionPayment = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const basePrice = 3000;
    const fee = basePrice * 0.05;
    const total = basePrice + fee;

    const qr = `moncash://pay?amount=${total}&user=${user._id}`;

    res.json({ basePrice, fee, total, qr });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

// ==========================
// 🔄 TOGGLE USER (ownership enforced by middleware)
// ==========================
export const toggleUserStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

export default {
  registerUser,
  loginWithEmailPassword,
};

