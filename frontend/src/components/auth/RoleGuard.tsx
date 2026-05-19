import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

export const RoleGuard = ({
  children,
  roles = [],
}: any) => {
  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
         </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    roles.length &&
    !roles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};