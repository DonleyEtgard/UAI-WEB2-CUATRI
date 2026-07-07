import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export const ProtectedRoute = ({ children }: any) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" />;

  return children;
};