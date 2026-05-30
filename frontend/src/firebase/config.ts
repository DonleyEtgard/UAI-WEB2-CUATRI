import { initializeApp, getApps } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredEnvVars = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

const hasFirebaseEnv = requiredEnvVars.every(
  (value) => typeof value === "string" && value.length > 5
);

const app = hasFirebaseEnv
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]
  : null;

if (!app) {
  throw new Error("Firebase no inicializado. Revisar variables VITE_FIREBASE_*");
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
