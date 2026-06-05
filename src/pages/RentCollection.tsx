import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight, CheckCircle2, AlertCircle, Loader2, ExternalLink,
  Banknote, Shield, Copy, Send,
} from "lucide-react";

type ConnectStatus = {
  connected: boolean;
  accountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
};

export default function RentCollection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [lastLink, setLastLink] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-connect-status");
      if (error) throw error;
      setStatus(data);
    } catch (e: any) {
      toast({ title: "Status check failed", description: e.message, variant: "destructive" });
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("rent_payment_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setRequests(data || []);
  };

  useEffect(() => {
    if (user) {
      loadStatus();
      loadRequests();
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get("connect") === "success") {
      toast({ title: "Welcome back!", description: "Refreshing your Stripe account status..." });
    }
    if (searchParams.get("paid") === "1") {
      toast({ title: "Payment received!", description: "Reloading rent requests..." });
      loadRequests();
    }
  }, [searchParams]);

  const startOnboarding = async () => {
    setOnboarding(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-connect-onboard");
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast({ title: "Onboarding failed", description: e.message, variant: "destructive" });
    } finally {
      setOnboarding(false);
    }
  };

  const createPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingLink(true);
    setLastLink(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-rent-payment", {
        body: {
          tenantName,
          tenantEmail: tenantEmail || undefined,
          amount: Number(amount),
          description: description || undefined,
        },
      });
      if (error) throw error;
      setLastLink(data.url);
      toast({ title: "Payment link ready", description: "Send it to your tenant." });
      setTenantName(""); setTenantEmail(""); setAmount(""); setDescription("");
      loadRequests();
    } catch (e: any) {
      toast({ title: "Couldn't create link", description: e.message, variant: "destructive" });
    } finally {
      setCreatingLink(false);
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied", description: "Payment link copied to clipboard." });
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p>Please sign in to manage rent collection.</p>
        <Button asChild className="mt-4"><Link to="/auth">Sign In</Link></Button>
      </div>
    );
  }

  const fullyConnected = status?.connected && status?.chargesEnabled;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Rent Collection — Your Stripe, Your Money | myrental</title>
        <meta name="description" content="Connect your own Stripe account and collect rent directly. myrental never touches your money — no tenant fees, no per-transaction cuts." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-[var(--font-heading)] text-3xl font-extrabold">Rent Collection</h1>
          <p className="mt-2 text-muted-foreground">
            Your tenants pay <strong className="text-foreground">directly into your Stripe account</strong>. myrental never touches your money.
          </p>
        </div>

        {/* Connect status card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {loadingStatus ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking your Stripe account...
            </div>
          ) : !status?.connected ? (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-[var(--font-heading)] text-lg font-bold">Connect your Stripe account</h2>
                  <p className="text-sm text-muted-foreground">5-minute setup. Your money, your bank, your name.</p>
                </div>
              </div>
              <ul className="mb-5 space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Tenants pay via card or bank transfer</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Funds deposited straight to your bank — usually next business day</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Zero per-transaction fees from myrental</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" /> You own the Stripe account — disconnect anytime</li>
              </ul>
              <Button onClick={startOnboarding} disabled={onboarding} size="lg" className="rounded-xl">
                {onboarding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect Stripe <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : !fullyConnected ? (
            <div>
              <div className="mb-3 flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p className="font-semibold">Onboarding not complete</p>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Stripe still needs a few more details before you can collect payments.
              </p>
              <Button onClick={startOnboarding} disabled={onboarding}>
                {onboarding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Finish Stripe setup
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-[var(--font-heading)] font-bold text-primary">Stripe connected</p>
                  <p className="text-xs text-muted-foreground">Account: {status.accountId}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={loadStatus}>Refresh</Button>
            </div>
          )}
        </div>

        {/* Create payment link */}
        {fullyConnected && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-[var(--font-heading)] text-lg font-bold mb-1">Request rent payment</h2>
            <p className="mb-5 text-sm text-muted-foreground">Generate a secure payment link and send it to your tenant.</p>

            <form onSubmit={createPaymentLink} className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="tenantName">Tenant name *</Label>
                <Input id="tenantName" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required placeholder="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="tenantEmail">Tenant email</Label>
                <Input id="tenantEmail" type="email" value={tenantEmail} onChange={(e) => setTenantEmail(e.target.value)} placeholder="jane@example.com" />
              </div>
              <div>
                <Label htmlFor="amount">Amount (USD) *</Label>
                <Input id="amount" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="1800" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="December 2026 rent" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={creatingLink} className="rounded-xl">
                  {creatingLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Create payment link
                </Button>
              </div>
            </form>

            {lastLink && (
              <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary mb-2">Payment link ready</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-md bg-background px-3 py-2 text-xs">{lastLink}</code>
                  <Button size="sm" variant="outline" onClick={() => copyLink(lastLink)}><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent requests */}
        {requests.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-[var(--font-heading)] text-lg font-bold mb-4">Recent payment requests</h2>
            <div className="divide-y divide-border">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold text-sm">{r.tenant_name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${(r.amount / 100).toFixed(2)} · {new Date(r.created_at).toLocaleDateString()} · {r.status}
                    </p>
                  </div>
                  {r.stripe_payment_link_url && r.status === "pending" && (
                    <Button size="sm" variant="ghost" onClick={() => copyLink(r.stripe_payment_link_url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">← Back to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
