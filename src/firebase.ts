import admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
  let credential;

  const firebaseKeyPath = path.join(process.cwd(), "src", "firebase-key.json");

  if (fs.existsSync(firebaseKeyPath)) {
    // Desarrollo (localhost)
    const serviceAccount = require(firebaseKeyPath);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Producción (Railway)
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    });
  }

  admin.initializeApp({ credential });
}

export default admin;