import { Request } from "express";

export type UserRole = "employee" | "admin" | "superadmin" | "manager";

export interface DBUser {
  _id: string;
  role: UserRole;
  email: string;
  name: string;
  lastName: string;
  firebaseUid?: string;
  isActive?: boolean;
  [key: string]: any;
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
