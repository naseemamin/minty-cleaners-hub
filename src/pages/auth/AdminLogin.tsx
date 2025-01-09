import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface UserRoleResponse {
  role_id: {
    name: string;
  };
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    let isSubscribed = true;

    const checkAdminRole = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role_id(name)')
          .eq('user_id', userId)
          .single();

        if (!isSubscribed) return;

        if (error) {
          console.error('Error checking admin role:', error);
          toast.error("Error verifying admin permissions");
          await supabase.auth.signOut();
          return;
        }

        const roleData = data as UserRoleResponse;
        
        if (roleData?.role_id?.name === 'admin') {
          toast.success('Welcome, admin!');
          navigate("/admin/applications");
        } else {
          toast.error("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
        }
      } catch (error) {
        if (!isSubscribed) return;
        console.error('Unexpected error:', error);
        toast.error("An unexpected error occurred");
        await supabase.auth.signOut();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isSubscribed) return;

      if (event === 'SIGNED_IN' && currentSession?.user?.id) {
        checkAdminRole(currentSession.user.id);
      }
      
      if (event === 'SIGNED_OUT') {
        toast.error('Please log in with admin credentials.');
      }
    });

    // Check session on mount
    if (session?.user?.id) {
      checkAdminRole(session.user.id);
    }

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate, session]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Authorized access only
        </p>
        <div className="mt-2 text-center text-sm text-gray-400">
          <p>Test account:</p>
          <p>Email: admin@test.com</p>
          <p>Password: password123</p>
        </div>
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