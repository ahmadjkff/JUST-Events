import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // optional, only allow specific roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return <Navigate to="/unauthorized" replace />; // optional unauthorized page
  }

  return <>{children}</>;
};

export default ProtectedRoute;
