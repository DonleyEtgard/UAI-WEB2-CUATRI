import { login } from "../../api/auth.api";

export const useLogin = () => {
  const handleLogin = async (email: string, password: string) => {
    const data = await login(email, password);

    // 🔐 guardar sesión
    localStorage.setItem("token", data.idToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  };

  return { handleLogin };
};