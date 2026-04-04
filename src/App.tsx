import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ListingsProvider } from "@/contexts/ListingsContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Inbox from "./pages/Inbox";
import AddProperty from "./pages/AddProperty";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import SelectRole from "./pages/SelectRole";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ImportListing from "./pages/ImportListing";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function RoleGate({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (user && !role) return <Navigate to="/select-role" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ListingsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route path="/select-role" element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />
              <Route path="/inbox" element={<ProtectedRoute><RoleGate><Inbox /></RoleGate></ProtectedRoute>} />
              <Route path="/add-property" element={<ProtectedRoute><RoleGate><AddProperty /></RoleGate></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><RoleGate><Dashboard /></RoleGate></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ListingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
