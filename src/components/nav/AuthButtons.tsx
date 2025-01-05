import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthButtons = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  if (session) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-600"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-gray-600"
      onClick={() => navigate("/auth/login")}
    >
      <User className="h-4 w-4 mr-2" />
      Login
    </Button>
  );
};