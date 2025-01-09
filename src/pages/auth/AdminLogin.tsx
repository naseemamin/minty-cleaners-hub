import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { AuthChangeEvent } from "@supabase/supabase-js";

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
    // Add auth state change listener for debugging and error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('Auth event:', event);
      console.log('Session state:', session ? 'Logged in' : 'Logged out');
      console.log('Full session data:', session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in successfully:', session.user.email);
        // Check admin role after successful sign in
        checkAdminRole();
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast.error('Please log in with admin credentials.');
      }

      // Add specific error handling for auth errors
      if (event === 'TOKEN_REFRESHED' || event === 'PASSWORD_RECOVERY') {
        console.log('Auth event requiring attention:', event);
        toast.error('Authentication error. Please try again.');
      }
    });

    const checkAdminRole = async () => {
      if (!session?.user) {
        console.log('No session found during admin role check');
        return;
      }

      console.log('Checking admin role for user:', session.user.email);
      
      try {
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role_id(name)')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking admin role:', error);
          toast.error("Error verifying admin permissions");
          await supabase.auth.signOut();
          return;
        }

        console.log('User roles data:', userRoles);
        const roleData = userRoles as UserRoleResponse;

        if (roleData?.role_id?.name === 'admin') {
          console.log('Admin role confirmed, navigating to applications');
          toast.success('Welcome, admin!');
          navigate("/admin/applications");
        } else {
          console.log('Not an admin, signing out');
          toast.error("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
          navigate("/auth/admin-login");
        }
      } catch (error) {
        console.error('Unexpected error during admin check:', error);
        toast.error("An unexpected error occurred");
        await supabase.auth.signOut();
      }
    };

    // Initial admin role check if session exists
    if (session?.user) {
      checkAdminRole();
    }

    return () => {
      subscription.unsubscribe();
    };
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