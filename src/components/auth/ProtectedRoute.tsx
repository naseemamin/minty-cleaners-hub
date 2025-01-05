import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Keep the prop but don't use it for now
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !session) {
      toast.error("Please login to access this page");
      navigate("/auth/login");
    }
  }, [session, authLoading, navigate]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;