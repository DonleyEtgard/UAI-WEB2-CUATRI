import { Request } from "express";

export type UserRole = "employee" | "admin" | "superadmin";

export interface UserAccess {
  dashboard?: boolean;
  products?: boolean;
  sales?: boolean;
  stock?: boolean;
  users?: boolean;
  reports?: boolean;
  subscriptions?: boolean;
}

export interface DBUser {
  _id: string;
  role: string;
  email: string;
  name: string;
  lastName: string;
  firebaseUid: string;
  ownerAdmin?: string;
  isActive: boolean;
  isVerified: boolean;

  access?: UserAccess;
}

export interface FirebaseDecoded {
  uid: string;
  email?: string;
  email_verified?: boolean;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  firebaseUser?: FirebaseDecoded | null;
  dbUser?: DBUser | null;
}

export default {};
