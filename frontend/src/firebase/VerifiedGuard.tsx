import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const VerifiedGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  // Superadmin bypasses verification
  if (user?.role === "superadmin") {
    return <>{children}</>;
  }

  // Redirect to verification page if not verified
  // Note: Check both Firebase status and DB status if necessary
  if (!user?.isVerified) {
    return <Navigate to="/verify-email" />;
  }

  return <>{children}</>;
};