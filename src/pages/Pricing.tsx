import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Check, MapPin, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptions";
import SEOHead from "@/components/SEOHead";

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

  const handleCheckout = async (priceId: string, planKey: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to subscribe.", variant: "destructive" });
      return;
    }
    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
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
      key: "tenant",
      name: "Tenant",
      price: "Free",
      period: "",
      description: "Search and apply for furnished rentals at no cost.",
      features: [
        "Browse all listings",
        "Direct messaging with landlords",
        "Free background & credit screening",
        "Save favorite properties",
        "Receive new listing alerts",
      ],
      cta: user ? "You're all set!" : "Sign Up Free",
      ctaAction: () => {},
      ctaLink: user ? undefined : "/auth",
      popular: false,
      isCurrentPlan: !!user && !subscribed,
      disabled: !!user,
    },
    {
      key: "monthly",
      name: "Landlord Monthly",
      price: "$9.99",
      period: "/month",
      description: "List your furnished properties with full platform access.",
      features: [
        "Unlimited property listings",
        "Direct tenant messaging",
        "Tenant screening reports",
        "Listing analytics & views",
        "Priority support",
        "Cancel anytime",
      ],
      cta: subscriptionTier === "monthly" ? "Current Plan" : "Start Monthly Plan",
      ctaAction: () => handleCheckout(SUBSCRIPTION_TIERS.monthly.price_id, "monthly"),
      popular: true,
      isCurrentPlan: subscriptionTier === "monthly",
      disabled: subscriptionTier === "monthly",
    },
    {
      key: "annual",
      name: "Landlord Annual",
      price: "$99",
      period: "/year",
      description: "Best value — save over 17% vs. monthly billing.",
      features: [
        "Everything in Monthly plan",
        "Save $20.88 per year",
        "Featured listing badges",
        "Early access to new features",
        "Premium landlord profile",
        "Priority placement in search",
      ],
      cta: subscriptionTier === "annual" ? "Current Plan" : "Start Annual Plan",
      ctaAction: () => handleCheckout(SUBSCRIPTION_TIERS.annual.price_id, "annual"),
      popular: false,
      badge: "Best Value",
      isCurrentPlan: subscriptionTier === "annual",
      disabled: subscriptionTier === "annual",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Pricing – Landlord Plans from $9.99/mo" description="Free for tenants. Landlord plans start at $9.99/month or $99/year. No commissions, free tenant screening. Compare plans." />
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">ecrenta</span>
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
          <h1 className="font-[var(--font-heading)] text-4xl font-extrabold sm:text-5xl">
            Simple, Affordable Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Free for tenants. Landlords get unlimited listings starting at just $9.99/month — half the cost of competitors.
          </p>
        </div>

        {subscribed && (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-sm font-medium text-primary">
              ✓ Active {subscriptionTier === "annual" ? "Annual" : "Monthly"} Subscription
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
              {!plan.isCurrentPlan && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                  {plan.badge}
                </div>
              )}
              <h3 className="font-[var(--font-heading)] text-xl font-bold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-[var(--font-heading)] text-4xl font-extrabold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.ctaLink ? (
                <Button
                  asChild
                  className="mt-8 w-full rounded-xl py-6 text-sm font-semibold"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  disabled={plan.disabled}
                >
                  <Link to={plan.ctaLink}>{plan.cta}</Link>
                </Button>
              ) : (
                <Button
                  className="mt-8 w-full rounded-xl py-6 text-sm font-semibold"
                  variant={plan.isCurrentPlan ? "secondary" : plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={plan.ctaAction}
                  disabled={plan.disabled || loadingPlan === plan.key}
                >
                  {loadingPlan === plan.key && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is it really free for tenants?", a: "Yes! Tenants can browse listings, message landlords, and get screened for free. We only charge landlords a small subscription fee." },
              { q: "What's included in the free tenant screening?", a: "We provide a basic background check and credit screening at no cost to tenants. This helps landlords make decisions faster." },
              { q: "Can I cancel my landlord subscription?", a: "Yes, you can cancel anytime. Monthly plans stop at the end of the billing cycle. Annual plans can be cancelled with a prorated refund." },
              { q: "What areas do you cover?", a: "We currently focus on Fresno County, California — including Fresno, Clovis, Madera, Sanger, Selma, Reedley, and surrounding areas." },
              { q: "Why is ecrenta cheaper than competitors?", a: "We keep costs low by focusing on one region and building lean. No commissions, no hidden fees — just a simple subscription for landlords." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-[var(--font-heading)] font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
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
