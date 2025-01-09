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
    let mounted = true;

    const checkAdminRole = async () => {
      if (!session?.user?.id) {
        if (mounted) setIsChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            role_id (
              name
            )
          `)
          .eq('user_id', session.user.id)
          .limit(1)
          .maybeSingle();

        if (!mounted) return;

        if (error) throw error;

        const isAdmin = data?.role_id?.name === 'admin';

        if (isAdmin) {
          toast.success('Welcome, admin!');
          navigate("/admin/applications");
        } else {
          toast.error("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error checking admin role:', error);
        toast.error("An unexpected error occurred");
        await supabase.auth.signOut();
      } finally {
        if (mounted) setIsChecking(false);
      }
    };

    checkAdminRole();

    return () => {
      mounted = false;
    };
  }, [session, navigate]);

  return { isChecking };
};