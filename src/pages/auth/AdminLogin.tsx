import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface RoleData {
  name: string;
}

interface UserRoleResponse {
  role_id: {
    name: string;
  };
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (session?.user) {
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role_id(name)')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking admin role:', error);
          return;
        }

        const roleData = userRoles as UserRoleResponse;

        if (roleData?.role_id?.name === 'admin') {
          navigate("/admin/applications");
        } else {
          toast.error("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
          navigate("/auth/admin-login");
        }
      }
    };

    checkAdminRole();
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Authorized access only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4F46E5',
                    brandAccent: '#4338CA',
                  },
                },
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;