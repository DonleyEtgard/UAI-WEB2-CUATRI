import { login } from "../../services/auth.service";

interface LoginResponse {
  idToken: string;
  user: {
    id: string;
    email: string;
    role?: string;
  };
}

export const useLogin = () => {
  const handleLogin = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const data = await login(email, password);

      // 🔐 guardar sesión
      localStorage.setItem("auth_token", data.idToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error: unknown) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return { handleLogin };
};