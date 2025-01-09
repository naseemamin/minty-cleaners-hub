import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

export const useAdminCheck = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async () => {
      if (!session?.user?.id) {
        if (isMounted) setIsChecking(false);
        return;
      }

      try {
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role_id(name)')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!isMounted) return;

        if (userRoles?.role_id?.name === 'admin') {
          toast.success('Welcome, admin!');
          navigate("/admin/applications");
        } else {
          toast.error("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error checking admin role:', error);
        toast.error("An unexpected error occurred");
        await supabase.auth.signOut();
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkAdminRole();

    return () => {
      isMounted = false;
    };
  }, [session, navigate]);

  return { isChecking };
};