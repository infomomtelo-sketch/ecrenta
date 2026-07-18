import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Clock } from "lucide-react";

export default function AccessPending() {
  const { profile, user, signOut } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <BrandLogo size="lg" />
      <div className="mt-8 max-w-md text-center rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold">Access pending approval</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Hi {profile?.display_name || user?.email} — thanks for signing up! This workspace is invite-only right now.
          An admin will review your account and grant access shortly.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild variant="outline"><Link to="/">Back to homepage</Link></Button>
          <Button variant="ghost" onClick={signOut}>Sign out</Button>
        </div>
      </div>
    </div>
  );
}
