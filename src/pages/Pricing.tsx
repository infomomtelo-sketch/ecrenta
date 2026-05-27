import { BrandLogo } from "@/components/BrandLogo";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Check, MapPin, Star, Loader2, Shield, Camera, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { SERVICE_TIERS } from "@/lib/subscriptions";
import SEOHead from "@/components/SEOHead";

function ComparisonTable() {
  const rows = [
    { feature: "Tenant Placement Fee", ecrenta: "$499", ziprent: "$1,500", ff: "N/A" },
    { feature: "Monthly Management", ecrenta: "$99/mo", ziprent: "$150/mo", ff: "N/A" },
    { feature: "Premium w/ Guarantees", ecrenta: "$149/mo", ziprent: "$250/mo", ff: "N/A" },
    { feature: "Tenant Screening", ecrenta: "Free", ziprent: "Included", ff: "$44.99" },
    { feature: "Professional Photography", ecrenta: "Included", ziprent: "Included", ff: "N/A" },
    { feature: "On-Demand Showings", ecrenta: "Included", ziprent: "Included", ff: "N/A" },
    { feature: "AI Property Assistant", ecrenta: "Premium tier", ziprent: "N/A", ff: "N/A" },
    { feature: "Dedicated Account Manager", ecrenta: "Premium tier", ziprent: "Premium tier", ff: "N/A" },
    { feature: "Commissions", ecrenta: "None", ziprent: "None", ff: "None" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-left font-semibold">Feature</th>
            <th className="py-3 px-4 text-center font-semibold text-primary">ecrenta</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Ziprent</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">FurnishedFinder</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-border/50">
              <td className="py-3 px-4">{row.feature}</td>
              <td className="py-3 px-4 text-center font-medium text-primary">{row.ecrenta}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{row.ziprent}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{row.ff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Pricing() {
  const { user, subscribed, subscriptionTier, subscriptionEnd } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled") {
      toast({ title: "Checkout cancelled", description: "You can subscribe anytime." });
    }
  }, [searchParams]);

  const handleCheckout = async (priceId: string, mode: string, planKey: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to get started.", variant: "destructive" });
      return;
    }
    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, mode },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPlan("manage");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({ title: "Portal error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      key: "management",
      icon: <Home className="h-6 w-6" />,
      name: "Property Management",
      price: "$99",
      period: "/mo per property",
      savings: "1st month free · then $51/mo less than Ziprent",
      description: "Hands-off landlording. Start with a full free month — we handle rent collection, maintenance, and tenant communication.",
      features: [
        "Everything in Tenant Placement",
        "Monthly rent collection",
        "Maintenance coordination & dispatch",
        "Tenant communication management",
        "Monthly financial statements",
        "Lease renewal handling",
        "24/7 emergency support line",
      ],
      cta: subscriptionTier === "management" ? "Current Plan" : "Start Management",
      ctaAction: () => handleCheckout(SERVICE_TIERS.management.price_id, "subscription", "management"),
      popular: true,
      isCurrentPlan: subscriptionTier === "management",
      disabled: subscriptionTier === "management",
    },
    {
      key: "premium",
      icon: <Shield className="h-6 w-6" />,
      name: "Premium Service",
      price: "$149",
      period: "/mo per property",
      savings: "1st month free · still $101/mo less than Ziprent",
      description: "Everything in Management plus power tools — AI assistant, dedicated manager, quarterly inspections, and priority support.",
      features: [
        "Everything in Property Management",
        "P8 AI Assistant — instant answers + tenant triage",
        "Dedicated account manager",
        "Quarterly property inspections with photo reports",
        "Priority vendor network — faster maintenance response",
        "Tax-ready quarterly financial reports",
        "Custom branding on tenant communications",
      ],
      cta: subscriptionTier === "premium" ? "Current Plan" : "Go Premium",
      ctaAction: () => handleCheckout(SERVICE_TIERS.premium.price_id, "subscription", "premium"),
      popular: false,
      badge: "Best Value",
      isCurrentPlan: subscriptionTier === "premium",
      disabled: subscriptionTier === "premium",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Pricing – Property Management from $99/mo | ecrenta"
        description="Professional property management starting at $99/mo — 34% cheaper than Ziprent. Tenant placement for $499 one-time. Free tenant screening. No commissions."
      />

      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" asChild><Link to="/dashboard">Dashboard</Link></Button>
            ) : (
              <Button size="sm" asChild><Link to="/auth">Sign In</Link></Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            🎉 First month free on every plan
          </div>
          <h1 className="font-[var(--font-heading)] text-4xl font-extrabold sm:text-5xl">
            Professional Management.<br />Fresno Prices.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Same full-service property management as the big guys — professional photography, tenant screening, rent collection, maintenance, guarantees — at a fraction of the cost. Built for Fresno County landlords.
          </p>
        </div>

        {subscribed && (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-sm font-medium text-primary">
              ✓ Active Subscription
            </p>
            {subscriptionEnd && (
              <p className="mt-1 text-xs text-muted-foreground">
                Renews {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={handleManageSubscription}
              disabled={loadingPlan === "manage"}
            >
              {loadingPlan === "manage" ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Manage Subscription
            </Button>
          </div>
        )}

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-8 transition-all ${
                plan.isCurrentPlan
                  ? "border-primary bg-primary/5 shadow-[var(--shadow-elevated)]"
                  : plan.popular
                  ? "border-primary bg-card shadow-[var(--shadow-elevated)] scale-[1.02]"
                  : "border-border bg-card"
              }`}
            >
              {plan.isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Your Plan
                </div>
              )}
              {!plan.isCurrentPlan && plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  <Star className="h-3 w-3" /> Most Popular
                </div>
              )}
              {!plan.isCurrentPlan && !plan.popular && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-3 text-primary">
                {plan.icon}
                <h3 className="font-[var(--font-heading)] text-xl font-bold text-foreground">{plan.name}</h3>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-[var(--font-heading)] text-4xl font-extrabold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {plan.savings && (
                <p className="mt-1 text-xs font-semibold text-primary">{plan.savings}</p>
              )}

              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.ctaAction && (
                <Button
                  className="mt-8 w-full rounded-xl py-6 text-sm font-semibold"
                  variant={plan.isCurrentPlan ? "secondary" : plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={plan.ctaAction}
                  disabled={plan.disabled || loadingPlan === plan.key}
                >
                  {loadingPlan === plan.key && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {plan.cta}
                  {!plan.isCurrentPlan && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold mb-8">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { step: "1", title: "Tell Us About Your Property", desc: "Enter your address and property details." },
              { step: "2", title: "We Prep & List It", desc: "Professional photos, optimized listing, syndicated everywhere." },
              { step: "3", title: "We Screen & Place", desc: "Background checks, showings, and lease signing handled." },
              { step: "4", title: "You Collect Rent", desc: "Sit back while we manage the rest." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="font-[var(--font-heading)] text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold text-center mb-8">How We Compare</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <ComparisonTable />
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What's included in Tenant Placement?", a: "Professional photography, listing creation, syndication to major platforms, on-demand showings, full tenant screening (background, credit, income verification), lease generation, and move-in coordination. All for a one-time $499 fee." },
              { q: "How is this cheaper than Ziprent?", a: "We focus exclusively on Fresno County, which keeps our overhead low. No Bay Area office costs. We pass those savings to you — same quality service at 34–67% less." },
              { q: "What does the rent guarantee cover?", a: "On our Premium plan, if your tenant misses rent, we pay you anyway. We also cover eviction costs and legal fees if it comes to that. It's landlording without the risk." },
              { q: "Can I start with placement and upgrade later?", a: "Absolutely. Many landlords start with Tenant Placement, then upgrade to Property Management once they see how much time it saves. You can upgrade anytime." },
              { q: "What areas do you cover?", a: "We currently serve Fresno County — including Fresno, Clovis, Madera, Sanger, Selma, Reedley, and surrounding areas. We know this market inside and out." },
              { q: "Is there a long-term contract?", a: "No. Property Management and Premium plans are month-to-month. Cancel anytime with 30 days notice. No penalties, no hidden fees." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-[var(--font-heading)] font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-lg text-center">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold">Ready to stop overpaying?</h2>
          <p className="mt-2 text-muted-foreground">Join Fresno County landlords saving thousands with ecrenta.</p>
          <Button size="lg" className="mt-6 rounded-xl px-8 py-6" asChild>
            <Link to={user ? "/post-property" : "/auth"}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="flex justify-center gap-4">
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} ecrenta. All rights reserved.</p>
      </footer>
    </div>
  );
}
