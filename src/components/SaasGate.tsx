import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Gates premium SaaS features behind any paid tier (saas/management/premium).
export function SaasGate({ children }: { children: React.ReactNode }) {
  const { subscriptionTier, checkingSubscription, user } = useAuth();
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);
  const wasChecking = useRef(false);

  useEffect(() => {
    if (checkingSubscription) wasChecking.current = true;
    else if (wasChecking.current) setHasCheckedOnce(true);
  }, [checkingSubscription]);

  if (!user || !hasCheckedOnce) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!subscriptionTier) return <Navigate to="/pricing?upgrade=saas" replace />;
  return <>{children}</>;
}

export function useHasSaas() {
  const { subscriptionTier } = useAuth();
  return subscriptionTier === "saas" || subscriptionTier === "management" || subscriptionTier === "premium";
}
