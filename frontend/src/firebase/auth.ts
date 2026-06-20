﻿﻿﻿﻿﻿// ============================================================================
// FIREBASE AUTH FUNCTIONS - Professional Authentication
// ============================================================================

import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User as FirebaseUser,
  getIdToken,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./config";

/**
 * Validate Firebase Auth is initialized
 */
const requireAuth = () => {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not initialized. Set VITE_FIREBASE_* env variables."
    );
  }
  return auth;
};

const actionCodeSettings = {
  url: 'https://midominio.com/verify-email',
  handleCodeInApp: true,
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Register a new user with Firebase Auth
 * @param email - User email
 * @param password - User password
 * @returns Firebase User credential
 */
export const registerUser = async (email: string, password: string) => {
  try {
    const credential = await createUserWithEmailAndPassword(
      requireAuth(),
      email,
      password
    );
    await sendEmailVerification(credential.user, actionCodeSettings);
    return credential;
  } catch (error) {
    throw error;
  }
};

/**
 * Send email verification to current user
 * @param user - Firebase User
 */
export const sendEmailVerificationEmail = async (user: FirebaseUser | null) => {
  if (!user) return;
  try {
    await sendEmailVerification(user, actionCodeSettings);
  } catch (error) {
    throw error;
  }
};

/**
 * Send password reset email
 * @param email - User email
 */
export const forgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(requireAuth(), email);
  } catch (error) {
    throw error;
  }
};

/**
 * Login user with Firebase Auth
 * @param email - User email
 * @param password - User password
 * @returns Firebase User credential
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const credential = await signInWithEmailAndPassword(
      requireAuth(),
      email,
      password
    );
    return credential;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout current user
 * @returns Promise
 */
export const logoutUser = async () => {
  try {
    await signOut(requireAuth());
  } catch (error) {
    throw error;
  }
};

/**
 * Get ID Token from Firebase User
 * Forces refresh to ensure token is current
 * @param user - Firebase User
 * @returns ID Token string
 */
export const getFirebaseIdToken = async (
  user: FirebaseUser
): Promise<string> => {
  try {
    const token = await getIdToken(user, true); // true = force refresh
    return token;
  } catch (error) {
    throw new Error("Failed to get Firebase ID Token");
  }
};

/**
 * Observe auth state changes
 * @param callback - Function called with user or null
 * @returns Unsubscribe function
 */
export const observeAuth = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(requireAuth(), callback);
};

/**
 * Get current user
 * @returns Current Firebase User or null
 */
export const getCurrentUser = () => {
  return requireAuth().currentUser;
};
