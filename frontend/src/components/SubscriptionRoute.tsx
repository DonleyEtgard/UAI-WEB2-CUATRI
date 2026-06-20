import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export const SubscriptionRoute = ({ children }: any) => {
  const user = useAppSelector((state) => state.auth.user);

  // 🔐 validar suscripción activa correctamente
  const isActive = Boolean(
  user?.subscriptionEnd &&
  !isNaN(new Date(user.subscriptionEnd as string).getTime()) &&
  new Date(user.subscriptionEnd as string).getTime() > Date.now()
);

  if (!isActive) {
    return <Navigate to="/" />;
  }

  return children;
};