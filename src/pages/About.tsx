import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Shield, DollarSign, Users, ArrowRight, CheckCircle, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="About ecrenta — Affordable Property Management in Fresno County" description="ecrenta is a full-service property management platform connecting Fresno County landlords with qualified tenants. Tenant placement from $499, management from $99/mo." />
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo size="sm" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="font-[var(--font-heading)] text-4xl font-extrabold sm:text-5xl">
            Full-Service Property Management,<br className="hidden sm:block" /> Half the Price
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            ecrenta is a two-sided rental platform built for Fresno County. Landlords get professional property management at a fraction of Bay Area prices. Tenants browse, apply, and get screened — completely free.
          </p>
        </div>

        {/* For Landlords */}
        <div className="mt-16 space-y-8">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" /> For Landlords
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <DollarSign className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-[var(--font-heading)] font-bold text-lg">Tenant Placement</h3>
              <p className="text-2xl font-extrabold mt-1">$499</p>
              <p className="text-sm text-muted-foreground mt-1">One-time fee. We find, screen, and place a qualified tenant in your property.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Home className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-[var(--font-heading)] font-bold text-lg">Monthly Management</h3>
              <p className="text-2xl font-extrabold mt-1">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground mt-1">Rent collection, maintenance coordination, inspections, and tenant communication — handled.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-[var(--font-heading)] font-bold text-lg">Premium Service</h3>
              <p className="text-2xl font-extrabold mt-1">$149<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground mt-1">Everything in management plus AI assistant, dedicated manager, quarterly inspections, and priority vendors.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card/50 p-6">
            <h3 className="font-[var(--font-heading)] font-semibold mb-3">Why landlords choose ecrenta</h3>
            <ul className="space-y-2">
              {[
                "No commissions on any rental — ever",
                "3× cheaper than Bay Area competitors like Ziprent",
                "AI-powered maintenance triage and inspection reports",
                "California-compliant lease agreements with e-signature",
                "Dedicated to Fresno County — we know this market inside out",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* For Tenants */}
        <div className="mt-16 space-y-8">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-3">
            <Search className="h-6 w-6 text-primary" /> For Tenants
          </h2>
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-3xl font-extrabold text-primary mb-2">100% Free</p>
            <p className="text-muted-foreground leading-relaxed">
              Tenants never pay a dime to use ecrenta. Browse all available rentals in Fresno, Clovis, Madera, Sanger, Selma, and Reedley. Apply online. Get screened for free — no $45 application fees. Message landlords directly through our built-in chat.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "Free tenant screening (competitors charge $45+)",
                "Browse furnished and unfurnished rentals",
                "Message landlords directly — no middleman",
                "Ideal for traveling nurses, healthcare workers, and professionals relocating to the Central Valley",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Market Focus */}
        <div className="mt-16 space-y-6">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" /> Built for Fresno County
          </h2>
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-muted-foreground leading-relaxed">
              Fresno County has a growing rental market but has been underserved by tech-forward property management. National platforms charge premium prices designed for San Francisco and LA. ecrenta was built from the ground up for the Central Valley — serving Fresno, Clovis, Madera, Sanger, Selma, Reedley, and surrounding communities. We combine local market expertise with modern tools like AI maintenance triage, digital inspections, and automated lease management.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
            <Link to="/listings">
              Browse Rentals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
            <Link to="/list-with-us">
              List Your Property
              <ArrowRight className="h-4 w-4" />
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
