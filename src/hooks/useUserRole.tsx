import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "cleaner" | "customer";

export const useUserRole = () => {
  const { session } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select(`
            roles (
              name
            )
          `)
          .eq("user_id", session.user.id)
          .single();

        if (error) throw error;

        // Safely access the role name from the response data
        const roleName = data?.roles?.name as UserRole;
        setRole(roleName || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [session]);

  return { role, loading };
};