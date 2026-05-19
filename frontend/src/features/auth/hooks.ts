import { login } from "../../services/auth.service";

export const useLogin = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password);

      // 🔐 guardar sesión
      localStorage.setItem("token", data.idToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // 🔥 importante para manejar errores en el componente
    }
  };

  return { handleLogin };
};