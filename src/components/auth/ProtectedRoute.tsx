import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Temporarily bypass auth check for admin routes
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    if (!authLoading && !session) {
      toast.error("Please login to access this page");
      navigate("/auth/login");
    }
  }, [session, authLoading, navigate, location]);

  if (authLoading && !location.pathname.startsWith('/admin')) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;