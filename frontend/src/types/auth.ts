import type { User as FirebaseUser } from "firebase/auth";

/**
 * User roles in the application
 */
export type UserRole = "superadmin" | "admin" | "employee";

/**
 * Subscription plans
 */
export type SubscriptionPlan = "free" | "basic" | "active" | "suspended";

/**
 * User address information
 */
export interface UserAddress {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

/**
 * Database User model (from MongoDB)
 */
export interface DBUser {
  _id: string;
  firebaseUid: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  address: UserAddress;
  image?: string;
  isVerified: boolean;
  isActive: boolean;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  subscriptionPaid: boolean;
  lastPaymentQR?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Combined user object used in the application
 */
export interface AppUser extends DBUser {
  firebaseToken?: string;
}

/**
 * Authentication context state
 */
export interface AuthContextType {
  // User state
  user: AppUser | null;

  firebaseUser: FirebaseUser | null;

  isLoading: boolean;

  isAuthenticated: boolean;

  // Methods
  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    email: string,
    password: string,
    name: string,
    lastName: string,
    street?: string,
    city?: string,
    zipCode?: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshToken: () => Promise<void>;

  // Error handling
  error: string | null;

  clearError: () => void;

  // Roles & Permissions
  hasRole: (
    roles: string[]
  ) => boolean;

  isAdmin: boolean;

  isSuperAdmin: boolean;

  isEmployee: boolean;
}