import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  User as FirebaseUser,
} from "firebase/auth";

import {
  loginUser,
  logoutUser,
  observeAuth,
} from "../../services/firebaseAuth";

import {
  getUserProfile,
} from "../../firebase/firestore";

import type {
  AppUser,
  UserRole,
} from "../../types/firestore";

export type AuthContextType = {
  user: AppUser | null;

  isAuthenticated: boolean;

  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  hasRole: (
    roles: UserRole[]
  ) => boolean;

  isAdmin: boolean;

  isSuperAdmin: boolean;

  isEmployee: boolean;
};

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({
  children,
}: Props) => {

  const [user, setUser] =
    useState<AppUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    console.log(
      "🔥 AuthProvider initialized"
    );

    let unsubscribe:
      | (() => void)
      | undefined;

    const initializeAuth = async () => {

      try {

        unsubscribe = observeAuth(
          async (
            firebaseUser:
              | FirebaseUser
              | null
          ) => {

            console.log(
              "🔥 AUTH CALLBACK:",
              firebaseUser
            );

            try {

              // 🚫 no user
              if (!firebaseUser) {

                setUser(null);

                setLoading(false);

                return;
              }

              // 🔥 intentar traer perfil
              const profile =
                await getUserProfile(
                  firebaseUser.uid
                );

              // ✅ perfil encontrado
              if (profile) {

                setUser(profile);

              } else {

                // ✅ fallback seguro
                const fallbackUser:
                  AppUser = {
                  uid:
                    firebaseUser.uid,

                  email:
                    firebaseUser.email ??
                    "",

                  displayName:
                    firebaseUser.displayName ??
                    "",

                  role:
                    "employee",

                  organizationId:
                    "",

                  isActive: true,

                  plan: "free",

                  createdAt:
                    new Date().toISOString(),

                  updatedAt:
                    new Date().toISOString(),
                };

                setUser(
                  fallbackUser
                );
              }

            } catch (error) {

              console.error(
                "❌ Error loading profile:",
                error
              );

              // 🚫 evita crash
              setUser(null);

            } finally {

              setLoading(false);
            }
          }
        );

      } catch (error) {

        console.error(
          "❌ Auth initialization error:",
          error
        );

        setUser(null);

        setLoading(false);
      }
    };

    initializeAuth();

    return () => {

      if (unsubscribe) {

        unsubscribe();
      }
    };

  }, []);

  // 🔐 LOGIN
  const login = async (
    email: string,
    password: string
  ) => {

    try {

      setLoading(true);

      await loginUser(
        email,
        password
      );

    } catch (error) {

      console.error(
        "❌ Login error:",
        error
      );

      throw error;

    } finally {

      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {

    try {

      setLoading(true);

      await logoutUser();

      setUser(null);

    } catch (error) {

      console.error(
        "❌ Logout error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // 🎭 ROLES
  const hasRole = (
    roles: UserRole[]
  ) => {

    if (!user) {
      return false;
    }

    return roles.includes(
      user.role
    );
  };

  const isAdmin =
    user?.role === "admin" ||
    user?.role === "superadmin";

  const isSuperAdmin =
    user?.role === "superadmin";

  const isEmployee =
    user?.role === "employee";

  return (
    <AuthContext.Provider
      value={{
        user,

        isAuthenticated:
          !!user,

        loading,

        login,

        logout,

        hasRole,

        isAdmin,

        isSuperAdmin,

        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};