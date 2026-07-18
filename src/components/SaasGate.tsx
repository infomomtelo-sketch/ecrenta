import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Subscription gate is currently OPEN — any signed-in user can access premium features.
// To re-enable paywall, restore the subscriptionTier check below.
export function SaasGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export function useHasSaas() {
  // Paywall temporarily disabled — grant access to any signed-in user.
  const { user } = useAuth();
  return !!user;
}
