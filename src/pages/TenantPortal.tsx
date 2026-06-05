import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, Wrench, MessageCircle, Calendar, ExternalLink } from "lucide-react";

interface TenantRecord {
  id: string;
  full_name: string;
  unit_address: string | null;
  lease_start: string | null;
  lease_end: string | null;
  rent_amount: number | null;
  user_id: string;
}

interface PaymentRequest {
  id: string;
  amount: number;
  description: string | null;
  status: string;
  created_at: string;
  paid_at: string | null;
  stripe_payment_link_url: string | null;
}

export default function TenantPortal() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<TenantRecord | null>(null);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: t } = await supabase
        .from("tenants")
        .select("id, full_name, unit_address, lease_start, lease_end, rent_amount, user_id")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      setTenant(t as TenantRecord | null);

      if (t) {
        const { data: p } = await supabase
          .from("rent_payment_requests")
          .select("id, amount, description, status, created_at, paid_at, stripe_payment_link_url")
          .eq("tenant_id", (t as TenantRecord).id)
          .order("created_at", { ascending: false });
        setPayments((p as PaymentRequest[]) || []);
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Home className="w-12 h-12 mx-auto text-muted-foreground opacity-40" />
            <h2 className="text-xl font-semibold font-heading">No tenant record yet</h2>
            <p className="text-sm text-muted-foreground">
              Your landlord needs to invite you. Once they do, you'll get an email with a link to connect your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unpaid = payments.filter((p) => p.status !== "paid");
  const balance = unpaid.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <Helmet><title>My Rental | myrental</title></Helmet>

      <div>
        <h1 className="text-2xl font-bold font-heading">Welcome, {tenant.full_name}</h1>
        <p className="text-sm text-muted-foreground">Your rental at a glance</p>
      </div>

      {/* Balance */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">Outstanding balance</p>
          <p className="text-4xl font-bold font-heading text-primary mt-1">
            ${(balance / 100).toFixed(2)}
          </p>
          {unpaid.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{unpaid.length} unpaid request{unpaid.length > 1 ? "s" : ""}</p>
          )}
        </CardContent>
      </Card>

      {/* Lease info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Home className="w-4 h-4" />Lease Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {tenant.unit_address && <p><span className="text-muted-foreground">Address:</span> {tenant.unit_address}</p>}
          {tenant.rent_amount && <p><span className="text-muted-foreground">Monthly rent:</span> ${tenant.rent_amount}</p>}
          {tenant.lease_start && tenant.lease_end && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {tenant.lease_start} → {tenant.lease_end}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="w-4 h-4" />Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment requests yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                  <div className="min-w-0">
                    <p className="font-medium">${(p.amount / 100).toFixed(2)}</p>
                    {p.description && <p className="text-xs text-muted-foreground truncate">{p.description}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={p.status === "paid" ? "secondary" : "default"}>{p.status}</Badge>
                    {p.status !== "paid" && p.stripe_payment_link_url && (
                      <Button asChild size="sm">
                        <a href={p.stripe_payment_link_url} target="_blank" rel="noopener noreferrer">
                          Pay <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Payment status is managed by your landlord. Contact them if anything looks off.
          </p>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild variant="outline" className="h-auto py-4 justify-start">
          <Link to="/repair">
            <Wrench className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Report Maintenance</p>
              <p className="text-xs text-muted-foreground">Submit a repair request</p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 justify-start">
          <Link to="/inbox">
            <MessageCircle className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Message Landlord</p>
              <p className="text-xs text-muted-foreground">Open your inbox</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
