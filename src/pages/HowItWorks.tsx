import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Users, Shield, FileText, CreditCard, Wrench, Home, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const steps = [
  {
    step: 1,
    title: "Submit Your Property",
    description: "Getting started with myrental is as easy as typing out your address and hitting enter. You'll get immediate access to your property dashboard where you can get a feel for our platform. We don't charge you a dime to see our platform. We want you to get to know us first!",
    cta: { text: "Get Started", href: "/get-started" },
    side: "left" as const,
  },
  {
    step: 2,
    title: "Your Property Concierge Team",
    description: "Once your property has been submitted, your personal property concierge team will reach out and discuss your needs as a property owner. We'll build a custom plan that fits your goals — whether it's finding a tenant, managing rent, or going fully hands-off.",
    side: "right" as const,
  },
  {
    step: 3,
    title: "Find the Perfect Tenant",
    description: "Should you need to find a tenant at any given point, we've come up with a tried and true method of finding high quality tenants as quickly as possible.",
    features: [
      { icon: Camera, text: "Professional Photography" },
      { icon: Users, text: "On-Demand Showings" },
      { icon: Shield, text: "Instant Tenant Screenings" },
      { icon: FileText, text: "Automated Lease Generation" },
    ],
    side: "left" as const,
  },
  {
    step: 4,
    title: "We Take Care of the Rest",
    description: "From rent collection to maintenance coordination, monthly statements to lease renewals — we handle everything so you can focus on what matters. Your only job is to check your bank account.",
    features: [
      { icon: CreditCard, text: "Online Rent Collection" },
      { icon: Wrench, text: "Maintenance Coordination" },
      { icon: Home, text: "Property Inspections" },
      { icon: CheckCircle2, text: "24/7 Communication" },
    ],
    side: "right" as const,
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="How Property Management Works — myrental"
        description="Submit your property, get a concierge team, find a tenant, and we handle the rest. 4 simple steps to stress-free property management in Fresno County."
      />

      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/get-started">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero */}
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">Keeping it simple</p>
          <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            How Our Property Management Works
          </h1>
        </div>

        {/* Steps — Zigzag layout like Ziprent */}
        <div className="mt-16 space-y-20">
          {steps.map((step) => (
            <div
              key={step.step}
              className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${
                step.side === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-5">
                <p className="text-sm font-bold text-primary">Step {step.step}</p>
                <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
                  {step.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {step.features && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {step.features.map((f) => (
                      <div key={f.text} className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                        <f.icon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm font-medium">{f.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step.cta && (
                  <Button asChild className="gap-2 rounded-xl">
                    <Link to={step.cta.href}>
                      {step.cta.text} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Visual placeholder */}
              <div className="flex-1">
                <div className="aspect-[4/3] rounded-2xl border border-border bg-card overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Home className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Step {step.step}</p>
                    <p className="text-xs text-muted-foreground mt-1">{step.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mt-3 mx-auto max-w-lg text-muted-foreground">
            Submit your property in 30 seconds and your personal concierge team will reach out within 24 hours. No commitment required.
          </p>
          <Button size="lg" asChild className="mt-6 gap-2 px-8 py-6 rounded-xl text-base">
            <Link to="/get-started">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="flex justify-center gap-4">
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} myrental. All rights reserved.</p>
      </footer>
    </div>
  );
}
