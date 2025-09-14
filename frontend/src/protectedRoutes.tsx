import { Navigate } from "react-router-dom";
import { useAuth } from "./context/auth/AuthContext";
import Loading from "./components/ui/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // optional, only allow specific roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return <Navigate to="/unauthorized" replace />; // optional unauthorized page
  }

  return <>{children}</>;
};

export default ProtectedRoute;
