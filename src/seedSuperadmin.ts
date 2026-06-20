import admin from "./firebase";
import User from "./models/User";

export const createSuperadminIfNotExists = async () => {
  try {
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("SUPERADMIN_EMAIL o SUPERADMIN_PASSWORD no definidos en .env");
    }

    const mongoUser = await User.findOne({ email });

    let firebaseUser;

    try {
      firebaseUser = await admin.auth().getUserByEmail(email);
      console.log("🟡 Usuario ya existe en Firebase");
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        throw error;
      }

      firebaseUser = await admin.auth().createUser({
        email,
        password,
      });

      console.log("🟢 Usuario creado en Firebase");
    }

    if (!mongoUser) {
      await User.create({
        email,
        firebaseUid: firebaseUser.uid,
        role: "superadmin",
        isActive: true,
        name: "Super Admin",
        lastName: "System",
        plan: "free",
      });

      console.log("🟢 Superadmin creado en MongoDB");
    } else {
      console.log("🟡 Superadmin ya existe en MongoDB");
    }

    console.log("🚀 Superadmin sync completo");
  } catch (error) {
    console.error("❌ Error creando superadmin:", error);
  }
};