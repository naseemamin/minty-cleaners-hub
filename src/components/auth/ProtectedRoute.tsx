import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

// Development mode flag
const isDevelopment = import.meta.env.DEV;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // In development mode, we'll show a warning instead of redirecting
    if (!authLoading && !session) {
      if (isDevelopment) {
        console.warn("Development mode: Bypassing authentication check");
        toast.warning("Development mode: Authentication bypassed");
      } else {
        toast.error("Please login to access this page");
        navigate("/auth/login");
      }
    }
  }, [session, authLoading, navigate, location]);

  if (authLoading && !isDevelopment) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;