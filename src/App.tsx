import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Apply from "./pages/recruit/Apply";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import QuoteForm from "./pages/signup/QuoteForm";
import AdminApplications from "./pages/admin/Applications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recruit/apply" element={<Apply />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/admin-login" element={<AdminLogin />} />
            <Route path="/signup/quote" element={<QuoteForm />} />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminApplications />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;