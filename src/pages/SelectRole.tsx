import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SelectRole() {
  const navigate = useNavigate();
  const { user, role: currentRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const hasRedirected = useRef(false);

  const getRoleDestination = (role: "landlord" | "tenant") =>
    role === "landlord" ? "/dashboard" : "/listings";

  useEffect(() => {
    if (!currentRole || hasRedirected.current) return;
    hasRedirected.current = true;
    navigate(getRoleDestination(currentRole), { replace: true });
  }, [currentRole, navigate]);

  const selectRole = async (role: "landlord" | "tenant") => {
    if (!user || loading) return;
    setLoading(true);

    try {
      const { data: existingRoles, error: fetchError } = await supabase
        .from("user_roles")
        .select("id, role")
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;

      const matchingRole = existingRoles?.find((entry) => entry.role === role);
      if (matchingRole) {
        toast({ title: "Welcome back!", description: `You're already set up as a ${role}.` });
        navigate(getRoleDestination(role), { replace: true });
        return;
      }

      const existingUserRole = existingRoles?.find(
        (entry) => entry.role === "landlord" || entry.role === "tenant",
      );

      if (existingUserRole) {
        const { error: updateError } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("id", existingUserRole.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("user_roles").insert({
          user_id: user.id,
          role,
        });

        if (insertError) throw insertError;
      }

      toast({ title: "Welcome!", description: `You're signed up as a ${role}.` });
      navigate(getRoleDestination(role), { replace: true });
    } catch (error) {
      const description =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Could not save your role.";

      toast({ title: "Error", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">How will you use myrental?</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose your role to get started</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => selectRole("landlord")}
            disabled={loading}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-secondary/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">I'm a Landlord</p>
              <p className="text-sm text-muted-foreground">Manage properties & tenants</p>
            </div>
          </button>

          <button
            onClick={() => selectRole("tenant")}
            disabled={loading}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-secondary/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">I'm a Tenant</p>
              <p className="text-sm text-muted-foreground">Browse listings & find a home</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
