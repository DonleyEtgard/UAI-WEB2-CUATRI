import { getWithCache, requestOrQueue } from "./offlineApi";

export type UserRole =
  | "superadmin"
  | "admin"
  | "employee";

export type PlanType =
  | "free"
  | "basic"
  | "medium"
  | "premium";

export type SubscriptionStatus =
  | "active"
  | "expired"
  | "pending"
  | "suspended";

export type PaymentMethod =
  | "cash"
  | "transfer"
  | "moncash"
  | "mercado pago";

export type Address = {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type RegisterData = {
  firebaseUid: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
};

export type UpdateUserData = {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;     // FALTA
  address?: Address;
  isActive?: boolean;
  role?: UserRole;
  plan?: PlanType;    // FALTA
};

type CreateEmployeeData = {
  firebaseUid: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  role: UserRole;
  plan?: PlanType;
  isActive?: boolean;
};

export interface User {
  _id: string;

  firebaseUid?: string;

  name: string;
  lastName: string;
  email: string;

  phone?: string;

  role: UserRole;

  plan?: PlanType;

  subscriptionStatus?: SubscriptionStatus;

  subscriptionPaid?: boolean;

  lastPaymentMethod?: PaymentMethod;

  lastPaymentAmount?: number;

  lastPaymentDate?: string;

  subscriptionStart?: string;

  subscriptionEnd?: string;

  trialUsed?: boolean;

  trialEnd?: string;

  address?: Address;

  isVerified?: boolean;

  isActive: boolean;

  // FALTABAN ESTOS
  createdBy?: string;

  ownerAdmin?: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface Payment {
  _id: string;

  user:
    | string
    | {
        _id: string;
        name: string;
        lastName: string;
        email: string;
      };

  plan: "basic" | "medium" | "premium";

  amount: number;

  method: PaymentMethod;

  status: "pending" | "paid" | "rejected";

  qrData?: string;

  createdAt?: string;
  updatedAt?: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApprovePaymentResponse {
  success: boolean;
  message: string;
}

export interface PendingPaymentUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
}
// ==========================
// AUTH
// ==========================

export const registerUser = async (
  data: RegisterData
) => {
  return await requestOrQueue(
    "POST",
    "/users/register",
    data
  );
};

// ==========================
// USERS
// ==========================

export const getMe = async () => {
  return await getWithCache<ApiResponse<UserResponse>>(
    "/users/me"
  );
};

export const getUsers = async (
  page = 1,
  limit = 10
) => {
  return await getWithCache<
    ApiResponse<UsersResponse>
  >(
    `/users?page=${page}&limit=${limit}`
  );
};

export const getUserById = async (
  id: string
) => {
 return await getWithCache<
    ApiResponse<UserResponse>
  >(
    `/users/${id}`
  );
};

export const updateUser = async (
  id: string,
  data: UpdateUserData
) => {
  return await requestOrQueue(
    "PATCH",
    `/users/${id}`,
    data
  );
};

export const createEmployee = async (
  data: CreateEmployeeData
) => {
  return await requestOrQueue(
    "POST",
    "/users/employees",
    data
  );
};

export const deleteUser = async (
  id: string
) => {
  return await requestOrQueue(
    "DELETE",
    `/users/${id}`
  );
};

export const toggleUserActiveState = async (
  id: string
) => {
  return await requestOrQueue<ApiResponse<UserResponse>>(
    "PATCH",
    `/users/${id}/toggle-state`
  );
};


// ==========================
// SUBSCRIPTIONS
// ==========================

export const paySubscription = async (
  plan: "basic" | "medium" | "premium",
  paymentMethod: PaymentMethod
) => {
  return await requestOrQueue(
    "POST",
    "/users/pay-subscription",
    {
      plan,
      paymentMethod,
    }
  );
};

export const createSubscriptionPayment =
  async (
    plan:
      | "basic"
      | "medium"
      | "premium"
  ) => {
    return await requestOrQueue(
      "POST",
      "/users/create-payment",
      {
        plan,
      }
    );
  };

// ==========================
// PAYMENTS (SUPERADMIN)
// ==========================

export const getPendingPayments =
  async () => {
   return await getWithCache<
      Payment[]
    >(
      "/users/pending-payments"
    );
  };

export const approvePayment =
  async (paymentId: string) => {
     return await requestOrQueue<
      ApprovePaymentResponse
    >(
      "PATCH",
      `/users/approve-payment/${paymentId}`
    );
  };
  