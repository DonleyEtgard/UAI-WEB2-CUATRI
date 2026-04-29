import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  email: string;
  role: "superadmin" | "admin" | "seller";
  plan?: "free" | "basic" | "active" | "suspended";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;

  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasSubscription: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// 🔥 PROVIDER
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 cargar sesión al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // 🔐 login
  const login = (token: string, user: User) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // 🚪 logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 🎯 helpers (equivalentes a middlewares)
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";
  const hasSubscription = user?.plan !== "free";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        isAdmin,
        isSuperAdmin,
        hasSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 hook limpio
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};