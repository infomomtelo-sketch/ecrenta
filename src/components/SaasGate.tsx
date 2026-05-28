import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Gates premium SaaS features behind any paid tier (saas/management/premium).
export function SaasGate({ children }: { children: React.ReactNode }) {
  const { subscriptionTier, checkingSubscription, user, loading } = useAuth();

  // Wait only while auth is loading or the very first subscription check is in flight.
  if (loading || (user && checkingSubscription && subscriptionTier === null && !user)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!subscriptionTier) return <Navigate to="/pricing?upgrade=saas" replace />;
  return <>{children}</>;
}

export function useHasSaas() {
  const { subscriptionTier } = useAuth();
  return subscriptionTier === "saas" || subscriptionTier === "management" || subscriptionTier === "premium";
}
