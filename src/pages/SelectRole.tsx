import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SelectRole() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const selectRole = async (role: "landlord" | "tenant") => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("user_roles").insert({
      user_id: user.id,
      role,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Welcome!`, description: `You're signed up as a ${role}.` });
      navigate(role === "landlord" ? "/dashboard" : "/");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">How will you use runp8?</h1>
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
