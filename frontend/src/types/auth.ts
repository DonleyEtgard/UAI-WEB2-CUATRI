import type { User as FirebaseUser } from "firebase/auth";

export type UserRole = "superadmin" | "admin" | "employee" ;

export type SubscriptionPlan = "free" | "basic" | "active" | "suspended";

export interface UserAddress {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface DBUser {
  _id: string;
  firebaseUid: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  ownerAdmin?: string;
  createdBy?: string;
  plan: SubscriptionPlan;
  address: UserAddress;
  image?: string;
  isVerified: boolean;
  isActive: boolean;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  subscriptionPaid: boolean;
  lastPaymentQR?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser extends DBUser {
  firebaseToken?: string;
}

/**
 * AUTH CONTEXT
 */
export interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  /**
   * Firebase login (SUPERADMIN INCLUDED)
   * This is the ONLY login used in system
   */
  login: (email: string, password: string) => Promise<void>;

  /**
   * Register user via Firebase + Mongo
   */
  register: (
    email: string,
    password: string,
    name: string,
    lastName: string,
    address?: UserAddress
  ) => Promise<void>;

  logout: () => Promise<void>;

  forgotPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;

  error: string | null;
  clearError: () => void;

  hasRole: (roles: UserRole[]) => boolean;

  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEmployee: boolean;
}
