export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profile?: UserProfile;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
}

export type UserRole =
  | "superadmin"
  | "admin"
  | "manager"
  | "employee";