import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "cleaner" | "customer";

interface RoleData {
  name: UserRole;
}

interface RoleResponse {
  role_id: RoleData;
}

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
          .select("role_id(name)")
          .eq("user_id", session.user.id)
          .single();

        if (error) throw error;

        // Type assertion and safe access of the role name
        const roleData = data as RoleResponse;
        setRole(roleData?.role_id?.name || null);
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