import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import type { User } from "@/types";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: User["role"][];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return user && allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};
