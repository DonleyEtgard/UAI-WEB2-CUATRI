/// <reference types="node" />
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase config - should match your .env variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createSuperAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage: npm run create-superadmin <email> <password>");
    process.exit(1);
  }

  try {
    console.log("Creating superadmin user...");

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    console.log(`Firebase user created with UID: ${uid}`);

    // Create superadmin profile in Firestore
    const superAdminProfile = {
      uid: uid,
      email: email,
      displayName: "Super Administrator",
      role: "superadmin" as const,
      organizationId: "", // Superadmins don't belong to specific organizations
      isActive: true,
      plan: "free" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", uid), superAdminProfile);

    console.log("✅ Superadmin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Role: superadmin`);
    console.log("You can now log in with these credentials.");

  } catch (error: any) {
    console.error("❌ Error creating superadmin:", error.message);
    process.exit(1);
  }
}

createSuperAdmin();