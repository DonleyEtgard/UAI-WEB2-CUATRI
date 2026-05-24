import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User as FirebaseUser } from "firebase/auth";

import {
  loginUser,
  registerUser,
  logoutUser,
  observeAuth,
  getFirebaseIdToken,
} from "../firebase/auth";

import apiClient from "../config/api";

import type {
  AuthContextType,
  AppUser,
  DBUser,
} from "../types/auth";

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

// ============================================================================
// PROVIDER TYPES
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const AuthProvider: React.FC<
  AuthProviderProps
> = ({ children }) => {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [user, setUser] =
    useState<AppUser | null>(null);

  const [firebaseUser, setFirebaseUser] =
    useState<FirebaseUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // Flag to prevent observeAuth from conflicting with registration
  const [isRegistering, setIsRegistering] =
    useState(false);
  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  // ==========================================================================
  // INITIAL AUTH CHECK
  // ==========================================================================

  useEffect(() => {
    console.log(
      "🔥 AuthProvider initialized"
    );

    let requestId = 0;

    const unsubscribe = observeAuth(
      async (
        fbUser: FirebaseUser | null
      ) => {
        requestId += 1;

        const currentRequest =
          requestId;

        console.log(
          "🔥 Firebase Auth Changed:",
          fbUser
        );

        setFirebaseUser(fbUser);

        // ====================================================================
        // USER LOGOUT
        // ====================================================================

        if (!fbUser) {
          console.log(
            "❌ No Firebase user"
          );

          setUser(null);

          setIsAuthenticated(false);

          localStorage.removeItem(
            "firebaseToken"
          );

          localStorage.removeItem(
            "user"
          );

          setIsLoading(false);

          return;
        }

        // ====================================================================
        // USER LOGIN
        // ====================================================================

        // If we are in the middle of registration, let the register function
        // handle the state to avoid race conditions with MongoDB creation
        if (isRegistering || isLoggingIn) {
          console.log("🔥 observeAuth: Action in progress, skipping background check");
          setFirebaseUser(fbUser);
          return;
        }

        try {
          console.log(
            "🔥 Getting Firebase token..."
          );

          const idToken =
            await getFirebaseIdToken(
              fbUser
            );

          console.log(
            "🔥 Token OK"
          );

          // SAVE TOKEN
          localStorage.setItem(
            "firebaseToken",
            idToken
          );

          // ==================================================================
          // GET USER FROM MONGODB
          // ==================================================================

          console.log(
            "🔥 Fetching /users/me..."
          );

          const response =
            await apiClient.get<{
              success: boolean;
              data: {
                user: DBUser | null;
              };
            }>("/users/me");

          console.log(
            "🔥 /users/me response:",
            response.data
          );

          // Avoid race conditions
          if (
            currentRequest !== requestId
          ) {
            return;
          }

          const mongoUser =
            response.data?.data?.user;

          // USER NOT FOUND IN MONGO
          if (!mongoUser) {
            console.log(
              "❌ Mongo user not found"
            );

            setUser(null);

            setIsAuthenticated(false);

            setIsLoading(false);

            return;
          }

          // ==================================================================
          // VALID USER
          // ==================================================================

          const appUser: AppUser = {
            ...mongoUser,
            firebaseToken: idToken,
          };

          console.log(
            "✅ AUTH SUCCESS:",
            appUser
          );

          setUser(appUser);

          setIsAuthenticated(true);

          localStorage.setItem(
            "user",
            JSON.stringify(appUser)
          );

          setIsLoading(false);
        } catch (err) {
          console.error(
            "❌ AUTH ERROR:",
            err
          );

          // Ignore old requests
          if (
            currentRequest !== requestId
          ) {
            return;
          }

          localStorage.removeItem(
            "firebaseToken"
          );

          localStorage.removeItem(
            "user"
          );

          setUser(null);

          setIsAuthenticated(false);

          setIsLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // ==========================================================================
  // LOGIN
  // ==========================================================================

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      setIsLoggingIn(true);

      console.log(
        "🔥 LOGIN START"
      );

      const credential = await loginUser(
        email,
        password
      );

      const idToken = await getFirebaseIdToken(credential.user);
      localStorage.setItem("firebaseToken", idToken);

      // Fetch Mongo user immediately to resolve the login flow
      const response = await apiClient.get<{
        success: boolean;
        data: { user: DBUser | null };
      }>("/users/me");

      const mongoUser = response.data?.data?.user;

      if (!mongoUser) throw new Error("User profile not found in system");

      const appUser: AppUser = {
        ...mongoUser,
        firebaseToken: idToken,
      };

      setUser(appUser);
      setFirebaseUser(credential.user);
      setIsAuthenticated(true);
      
      localStorage.setItem("user", JSON.stringify(appUser));
      
    } catch (err: any) {
      console.error(
        "❌ LOGIN ERROR:",
        err
      );

      const errorMessage =
        err?.message ||
        "Login failed";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoggingIn(false);
      setIsLoading(false);
    }
  };

  // ==========================================================================
  // REGISTER
  // ==========================================================================

  const register = async (
    email: string,
    password: string,
    name: string,
    lastName: string,
    street?: string,
    city?: string,
    zipCode?: string
  ) => {
    try {
      setError(null);

      setIsLoading(true);

      // ================================================================
      // FIREBASE REGISTER
      // ================================================================

      const credential =
        await registerUser(
          email,
          password
        );

      const idToken =
        await getFirebaseIdToken(
          credential.user
        );

      localStorage.setItem(
        "firebaseToken",
        idToken
      );

      // ================================================================
      // CREATE USER IN MONGO
      // ================================================================

      const response =
        await apiClient.post<{
          success: boolean;
          data: {
            user: DBUser;
          };
        }>("/users/register", {
          email,
          name,
          lastName,
          firebaseUid:
            credential.user.uid,
          address: {
            street,
            city,
            postalCode: zipCode,
          },
        });

      const mongoUser =
        response.data?.data?.user;

      if (!mongoUser) {
        throw new Error(
          "MongoDB user creation failed"
        );
      }

      // ================================================================
      // CREATE APP USER
      // ================================================================

      const appUser: AppUser = {
        ...mongoUser,
        firebaseToken: idToken,
      };

      setUser(appUser);

      setFirebaseUser(
        credential.user
      );

      setIsAuthenticated(true);

      localStorage.setItem(
        "user",
        JSON.stringify(appUser)
      );
    } catch (err: any) {
      console.error(
        "❌ REGISTER ERROR:",
        err
      );

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsRegistering(false);
      setIsLoading(false);
    }
  };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================

  const logout = async () => {
    try {
      setError(null);

      setIsLoading(true);

      await logoutUser();

      setUser(null);

      setFirebaseUser(null);

      setIsAuthenticated(false);

      localStorage.removeItem(
        "firebaseToken"
      );

      localStorage.removeItem(
        "user"
      );
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        "Logout failed";

      setError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================================
  // REFRESH TOKEN
  // ==========================================================================

  const refreshToken =
    async () => {
      try {
        if (!firebaseUser) return;

        const idToken =
          await getFirebaseIdToken(
            firebaseUser
          );

        localStorage.setItem(
          "firebaseToken",
          idToken
        );

        if (user) {
          const updatedUser: AppUser =
            {
              ...user,
              firebaseToken:
                idToken,
            };

          setUser(updatedUser);

          localStorage.setItem(
            "user",
            JSON.stringify(
              updatedUser
            )
          );
        }
      } catch (err) {
        console.error(
          "❌ REFRESH TOKEN ERROR:",
          err
        );

        setError(
          "Failed to refresh token"
        );
      }
    };

  // ==========================================================================
  // CLEAR ERROR
  // ==========================================================================

  const clearError = () => {
    setError(null);
  };

  // ==========================================================================
  // ROLES
  // ==========================================================================

  const hasRole = (
    roles: string[]
  ) => {
    if (!user?.role) return false;

    return roles.some(
      (role) =>
        role.toLowerCase() ===
        user.role.toLowerCase()
    );
  };

  const isAdmin =
    user?.role?.toLowerCase() ===
      "admin" ||
    user?.role?.toLowerCase() ===
      "superadmin";

  const isSuperAdmin =
    user?.role?.toLowerCase() ===
    "superadmin";

  const isEmployee =
    user?.role?.toLowerCase() ===
    "employee";

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const value: AuthContextType = {
    user,

    firebaseUser,

    isLoading,

    isAuthenticated,

    login,

    register,

    logout,

    refreshToken,

    error,

    clearError,

    hasRole,

    isAdmin,

    isSuperAdmin,

    isEmployee,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "useAuth must be used within AuthProvider"
      );
    }

    return context;
  };

// ============================================================================
// ROLE HOOKS
// ============================================================================

export const useHasRole = (
  requiredRole: string
) => {
  const { user } = useAuth();

  if (!user?.role) return false;

  return (
    user.role.toLowerCase() ===
    requiredRole.toLowerCase()
  );
};

export const useHasAnyRole = (
  requiredRoles: string[]
) => {
  const { user } = useAuth();

  if (!user?.role) return false;

  return requiredRoles.some(
    (role) =>
      role.toLowerCase() ===
      user.role.toLowerCase()
  );
};

export const useHasAllRoles = (
  requiredRoles: string[]
) => {
  const { user } = useAuth();

  if (!user?.role) return false;

  return requiredRoles.every(
    (role) =>
      role.toLowerCase() ===
      user.role.toLowerCase()
  );
};