import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Check, ArrowRight, Shield, DollarSign, Clock, Users, BarChart3, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const benefits = [
  { icon: DollarSign, title: "Earn 20-40% More", desc: "Furnished rentals command premium rates. Travel nurses pay $1,800-$2,500/mo for units that rent unfurnished at $1,200." },
  { icon: Users, title: "Pre-Screened Tenants", desc: "Healthcare professionals with verified employment, guaranteed income, and professional references." },
  { icon: Clock, title: "Fill Vacancies Faster", desc: "Average time-to-lease: 5 days. Our network of travel nurses and relocating professionals need housing now." },
  { icon: Shield, title: "Reduced Risk", desc: "Travel nurse contracts are 8-13 weeks. Shorter commitments mean easier turnover and less wear." },
  { icon: BarChart3, title: "Market Analytics", desc: "See what comparable furnished rentals earn in your area. Data-driven pricing recommendations." },
  { icon: Wrench, title: "Maintenance AI", desc: "Tenants submit repair requests through our AI triage system. You get prioritized, actionable tickets." },
];

const steps = [
  { num: "1", title: "Submit Your Property", desc: "Enter your address and property details. Takes under 5 minutes." },
  { num: "2", title: "We Review & Optimize", desc: "Our team reviews your listing, suggests pricing, and optimizes photos." },
  { num: "3", title: "Go Live & Get Tenants", desc: "Your listing goes live to our network of verified healthcare professionals." },
  { num: "4", title: "Manage Effortlessly", desc: "Use our dashboard for messaging, inspections, invoices, and maintenance." },
];

export default function ListWithUs() {
  return (
    <>
      <SEOHead title="List Your Property — myrental" description="List your furnished rental on myrental and earn 20-40% more. Pre-screened travel nurses, fast leasing, and powerful management tools." />
      <div className="min-h-screen bg-background">
        {/* Nav */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link to="/"><BrandLogo size="md" /></Link>
            <div className="flex items-center gap-3">
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
              <Link to="/get-started">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Your Property. <span className="text-primary">Premium Tenants.</span> More Income.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              List your furnished rental on myrental and connect with pre-screened travel nurses, healthcare professionals, and relocating tenants in the Central Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/get-started">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  List Your Property <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">Starting at $9.99/mo · Cancel anytime · No contracts</p>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-y border-border bg-card py-8 px-4">
          <div className="mx-auto max-w-4xl grid grid-cols-3 gap-6 text-center">
            <div><p className="text-3xl font-bold text-primary">5 days</p><p className="text-xs text-muted-foreground">Avg. time to lease</p></div>
            <div><p className="text-3xl font-bold text-primary">$2,100</p><p className="text-xs text-muted-foreground">Avg. monthly rent</p></div>
            <div><p className="text-3xl font-bold text-primary">98%</p><p className="text-xs text-muted-foreground">On-time payment rate</p></div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-4xl space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">Why Landlords Choose myrental</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 bg-card border-y border-border">
          <div className="mx-auto max-w-3xl space-y-10">
            <h2 className="text-3xl font-bold text-foreground text-center">How It Works</h2>
            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{s.num}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold text-foreground text-center">What's Included</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Listing on myrental marketplace",
                "AI-powered maintenance triage",
                "Digital lease & e-signatures",
                "Tenant messaging inbox",
                "Property inspection reports",
                "Invoice & rent tracking",
                "Travel nurse network access",
                "Market rent analytics",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-primary/5 border-t border-primary/20">
          <div className="mx-auto max-w-xl text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Ready to Earn More From Your Rental?</h2>
            <p className="text-muted-foreground">Join landlords across the Central Valley who are earning premium rents with pre-screened tenants.</p>
            <Link to="/get-started">
              <Button size="lg" className="text-base px-10">Get Started Now</Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} myrental. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
