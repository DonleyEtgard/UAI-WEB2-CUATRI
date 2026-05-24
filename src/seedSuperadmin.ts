import admin from "./firebase";
import User from "./models/User";

export const createSuperadminIfNotExists = async () => {
  try {
    const email = process.env.SUPERADMIN_EMAIL as string;
    const password = process.env.SUPERADMIN_PASSWORD as string;

    // verificar en MongoDB
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("🟡 Superadmin ya existe en MongoDB");
      return;
    }

    let firebaseUser;

    // verificar en Firebase Auth
    try {
      firebaseUser = await admin.auth().getUserByEmail(email);

      console.log("🟡 Usuario ya existe en Firebase");
    } catch {
      // si no existe en Firebase lo crea
      firebaseUser = await admin.auth().createUser({
        email,
        password,
      });

      console.log("🟢 Usuario creado en Firebase");
    }

    // crear en MongoDB
    await User.create({
      email,
      firebaseUid: firebaseUser.uid,
      role: "superadmin",
      isActive: true,
      name: "Super Admin",
      lastName: "System",
      plan: "free",
    });

    console.log("🟢 Superadmin creado correctamente");
  } catch (error) {
    console.error("❌ Error creando superadmin:", error);
  }
};