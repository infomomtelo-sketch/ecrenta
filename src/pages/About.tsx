import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, Stethoscope, DollarSign, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="About ecrenta" description="ecrenta connects traveling nurses with affordable furnished rentals in Fresno County. Learn our mission and how we serve healthcare professionals." />
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
          <h1 className="font-[var(--font-heading)] text-4xl font-extrabold sm:text-5xl">About ecrenta</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Making mid-term furnished housing affordable and accessible for traveling professionals in Fresno County.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" /> Our Mission
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              ecrenta was created to solve a real problem: traveling nurses and healthcare professionals 
              relocating to Fresno County struggle to find affordable, furnished housing for their 
              assignments. Traditional platforms charge high fees, and most listings aren't tailored 
              to mid-term stays. We built ecrenta to change that — a focused, no-nonsense marketplace 
              where landlords pay less and tenants get screened for free.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <Stethoscope className="mx-auto h-10 w-10 text-primary mb-3" />
              <h3 className="font-[var(--font-heading)] font-semibold">Healthcare First</h3>
              <p className="mt-2 text-sm text-muted-foreground">Designed specifically for traveling nurses, therapists, and contract medical professionals.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <DollarSign className="mx-auto h-10 w-10 text-primary mb-3" />
              <h3 className="font-[var(--font-heading)] font-semibold">Lower Costs</h3>
              <p className="mt-2 text-sm text-muted-foreground">Landlord subscriptions start at $9.99/mo — half the price of competing platforms.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <Users className="mx-auto h-10 w-10 text-primary mb-3" />
              <h3 className="font-[var(--font-heading)] font-semibold">Local Focus</h3>
              <p className="mt-2 text-sm text-muted-foreground">We know Fresno County. Every listing is local — Fresno, Clovis, Madera, and surrounding areas.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-[var(--font-heading)] text-2xl font-bold">Why Fresno County?</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Fresno County is home to major medical centers including Community Regional Medical Center, 
              Saint Agnes Medical Center, and Kaiser Permanente — all of which regularly bring in 
              traveling healthcare workers. The Central Valley is also experiencing growth in other 
              professional sectors. Yet, the furnished rental market here has been underserved compared 
              to coastal cities. ecrenta fills that gap.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
            <Link to="/listings">
              Explore Rentals
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
