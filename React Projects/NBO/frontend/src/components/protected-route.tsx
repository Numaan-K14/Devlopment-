import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const defaultRoute =
      user.role === "admin"
        ? "/client-configuration"
        : user.role === "participant"
          ? "/reports"
          : "/assessments";
    return <Navigate to={defaultRoute} replace />;
  }

  return <Outlet />;
};
