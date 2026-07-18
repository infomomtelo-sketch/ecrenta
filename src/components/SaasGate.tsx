import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Access is admin-granted: only users with profiles.access_granted = true get through.
export function SaasGate({ children }: { children: React.ReactNode }) {
  const { user, loading, accessGranted, profile } = useAuth();

  if (loading || (user && !profile)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!accessGranted) return <Navigate to="/access-pending" replace />;
  return <>{children}</>;
}

export function useHasSaas() {
  const { accessGranted } = useAuth();
  return accessGranted;
}
