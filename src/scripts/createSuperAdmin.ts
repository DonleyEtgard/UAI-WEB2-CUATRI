import mongoose from "mongoose";
import admin from "../firebase";
import User from "../models/User";

const MONGO_URI = process.env.MONGO_URI!;

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const email = process.env.SUPERADMIN_EMAIL!;
    const password = process.env.SUPERADMIN_PASSWORD!;

    const existing = await User.findOne({ role: "superadmin" });

    if (existing) {
      console.log("⚠️ Superadmin already exists");
      process.exit();
    }

    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    const user = await User.create({
      name: "Super",
      lastName: "Admin",
      email,
      firebaseUid: userRecord.uid,
      role: "superadmin"
    });

    console.log("✅ Superadmin creado");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createSuperAdmin()