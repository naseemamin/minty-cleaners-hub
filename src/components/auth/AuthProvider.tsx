import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove any existing debug divs first
    const existingDebugDiv = document.getElementById('debug-user-id');
    if (existingDebugDiv) {
      existingDebugDiv.remove();
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      if (session?.user) {
        console.log('Your User ID:', session.user.id);
        
        // Create debug div with improved visibility
        const div = document.createElement('div');
        div.id = 'debug-user-id';
        div.style.position = 'fixed';
        div.style.bottom = '20px';
        div.style.right = '20px';
        div.style.padding = '15px';
        div.style.background = '#000';
        div.style.color = '#fff';
        div.style.border = '2px solid #666';
        div.style.borderRadius = '8px';
        div.style.zIndex = '9999';
        div.style.fontSize = '14px';
        div.style.fontFamily = 'monospace';
        div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        div.innerHTML = `
          <div style="margin-bottom: 5px; color: #aaa;">Your User ID:</div>
          <code style="background: #333; padding: 5px; border-radius: 4px;">${session.user.id}</code>
        `;
        document.body.appendChild(div);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      
      // Update debug div when auth state changes
      if (session?.user) {
        console.log('Auth state changed - User ID:', session.user.id);
        const existingDiv = document.getElementById('debug-user-id');
        if (!existingDiv) {
          // Recreate the debug div if it doesn't exist
          const div = document.createElement('div');
          div.id = 'debug-user-id';
          div.style.position = 'fixed';
          div.style.bottom = '20px';
          div.style.right = '20px';
          div.style.padding = '15px';
          div.style.background = '#000';
          div.style.color = '#fff';
          div.style.border = '2px solid #666';
          div.style.borderRadius = '8px';
          div.style.zIndex = '9999';
          div.style.fontSize = '14px';
          div.style.fontFamily = 'monospace';
          div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
          div.innerHTML = `
            <div style="margin-bottom: 5px; color: #aaa;">Your User ID:</div>
            <code style="background: #333; padding: 5px; border-radius: 4px;">${session.user.id}</code>
          `;
          document.body.appendChild(div);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      // Clean up debug div on unmount
      const debugDiv = document.getElementById('debug-user-id');
      if (debugDiv) {
        debugDiv.remove();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};