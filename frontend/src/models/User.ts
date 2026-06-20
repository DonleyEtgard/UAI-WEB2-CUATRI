export type UserRole =
  | "superadmin"
  | "admin"
  | "employee";

export interface User {
  id: string;
  firebaseUid?: string;

  name: string;
  lastName: string;
  email: string;

  role: UserRole;
  isActive: boolean;

  image?: string;

  address?: Address;

  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}