import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { session, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !session) {
      toast.error("Please login to access this page");
      navigate("/auth/login");
      return;
    }

    if (!roleLoading && requiredRole && role !== requiredRole) {
      toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [session, authLoading, role, roleLoading, requiredRole, navigate]);

  if (authLoading || roleLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;