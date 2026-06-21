import { Request, Response } from "express";
import User from "../models/User";
import admin from "../firebase";

const actionCodeSettings = {
  url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email`,
  handleCodeInApp: false,
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const { firebaseUid, email, name, lastName } = req.body;

    const newUser = new User({
      firebaseUid,
      email,
      name,
      lastName,
      role: "admin",
      isVerified: false,
      isActive: true
    });

    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in registration" });
  }
};

export const createEmployeeController = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastName } = req.body;

    // 1. Create Firebase Account
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${lastName}`,
    });

    // 2. Generate and Send Verification Email (Logic via link generation)
    const verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
    // Note: You should send this link via your email service (SendGrid/Mailtrap/etc)

    // 3. Save to MongoDB
    const employee = new User({
      firebaseUid: firebaseUser.uid,
      email,
      name,
      lastName,
      role: "employee",
      isVerified: false,
    });

    await employee.save();
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating employee" });
  }
};
