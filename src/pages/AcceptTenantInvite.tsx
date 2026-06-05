import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";

interface InviteTenant {
  id: string;
  full_name: string;
  email: string | null;
  unit_address: string | null;
}

export default function AcceptTenantInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [tenant, setTenant] = useState<InviteTenant | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data } = await supabase
        .from("tenants")
        .select("id, full_name, email, unit_address")
        .eq("invite_token", token)
        .is("accepted_at", null)
        .maybeSingle();
      setTenant(data as InviteTenant | null);
      if (data?.email) setEmail(data.email);
      setChecking(false);
    })();
  }, [token]);

  // If user is signed in and we have a valid invite, link automatically.
  useEffect(() => {
    if (authLoading || checking) return;
    if (!user || !tenant) return;
    (async () => {
      setBusy(true);
      const { error } = await supabase
        .from("tenants")
        .update({ auth_user_id: user.id, accepted_at: new Date().toISOString() })
        .eq("invite_token", token!);
      if (error) {
        toast({ title: "Could not link account", description: error.message, variant: "destructive" });
        setBusy(false);
        return;
      }
      // Ensure tenant role
      const { data: existing } = await supabase.from("user_roles").select("id").eq("user_id", user.id).eq("role", "tenant").maybeSingle();
      if (!existing) {
        await supabase.from("user_roles").insert({ user_id: user.id, role: "tenant" });
      }
      toast({ title: "Welcome!", description: "Your rental portal is ready." });
      navigate("/tenant-portal", { replace: true });
    })();
  }, [user, tenant, authLoading, checking, token, navigate, toast]);

  const handleAuth = async () => {
    if (!email || !password) {
      toast({ title: "Email and password required", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/tenant/accept-invite/${token}`,
            data: { full_name: tenant?.full_name },
          },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm your email then return to this link." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // useEffect above will link the account
      }
    } catch (err) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as Error).message) : "Authentication failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-10 text-center space-y-3">
            <h2 className="text-xl font-semibold font-heading">Invite not found</h2>
            <p className="text-sm text-muted-foreground">This invite link is invalid or has already been used.</p>
            <Button asChild><Link to="/">Go home</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Helmet><title>Accept Tenant Invite | myrental</title></Helmet>
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-heading">You're invited, {tenant.full_name}!</CardTitle>
          {tenant.unit_address && <p className="text-sm text-muted-foreground">{tenant.unit_address}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="text-center text-sm text-muted-foreground">
              {busy ? "Linking your account..." : "Connecting..."}
            </div>
          ) : (
            <>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleAuth} disabled={busy}>
                {mode === "signup" ? "Create account & accept" : "Sign in & accept"}
              </Button>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMode((m) => (m === "signup" ? "signin" : "signup"))}
              >
                {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
