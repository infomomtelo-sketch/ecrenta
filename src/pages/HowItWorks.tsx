import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, UserPlus, Search, MessageCircle, Home, Shield, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tenantSteps = [
  { icon: UserPlus, title: "Create a Free Account", description: "Sign up in seconds — no credit card required. Browse listings immediately." },
  { icon: Search, title: "Search Furnished Rentals", description: "Filter by price, bedrooms, location, and lease length across Fresno County." },
  { icon: MessageCircle, title: "Message Landlords", description: "Contact property owners directly through our built-in messaging system." },
  { icon: Shield, title: "Get Screened for Free", description: "Complete your background and credit check at no cost — landlords see results instantly." },
  { icon: Home, title: "Move In", description: "Sign your lease and move into your furnished rental. It's that simple." },
];

const landlordSteps = [
  { icon: CreditCard, title: "Choose a Plan", description: "Start with $9.99/month or save with $99/year. Cancel anytime." },
  { icon: Home, title: "List Your Property", description: "Add photos, details, and pricing for your furnished rental units." },
  { icon: Search, title: "Get Discovered", description: "Traveling nurses and professionals actively search for Fresno County housing." },
  { icon: MessageCircle, title: "Review & Chat", description: "Receive inquiries, review free screening reports, and chat with applicants." },
  { icon: Shield, title: "Lease with Confidence", description: "Choose your ideal tenant with pre-screened applicant data." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-lg font-bold">runp8</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-[var(--font-heading)] text-4xl font-extrabold text-center sm:text-5xl">How It Works</h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-lg text-muted-foreground">
          Whether you're finding housing or listing it, runp8 makes the process straightforward.
        </p>

        {/* Tenant flow */}
        <div className="mt-16">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">T</span>
            For Tenants (Free)
          </h2>
          <div className="mt-8 space-y-6">
            {tenantSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[var(--font-heading)] font-semibold">
                    <span className="text-primary mr-1">Step {i + 1}.</span> {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Landlord flow */}
        <div className="mt-16">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">L</span>
            For Landlords (From $9.99/mo)
          </h2>
          <div className="mt-8 space-y-6">
            {landlordSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[var(--font-heading)] font-semibold">
                    <span className="text-accent mr-1">Step {i + 1}.</span> {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
            <Link to="/auth">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} runp8. All rights reserved.
      </footer>
    </div>
  );
}
