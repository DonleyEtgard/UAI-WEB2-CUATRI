import { useState } from "react";
import { useLogin } from "./hooks";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const { handleLogin } = useLogin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await handleLogin(email, password);

      // ✅ navegación React (correcto)
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          className="w-full border p-2 mb-2"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={onSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;