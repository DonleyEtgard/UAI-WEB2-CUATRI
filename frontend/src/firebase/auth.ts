import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";

import { auth } from "../firebase";

const requireAuth = () => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Set VITE_FIREBASE_* env variables.");
  }
  return auth;
};

// 🔐 REGISTER
export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(requireAuth(), email, password);
};

// 🔐 LOGIN
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(requireAuth(), email, password);
};

// 🚪 LOGOUT
export const logoutUser = () => {
  return signOut(requireAuth());
};

// 👀 OBSERVADOR DE SESIÓN GLOBAL
export const observeAuth = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(requireAuth(), callback);
};
