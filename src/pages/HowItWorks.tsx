import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Search, MessageCircle, Eye, FileCheck, CreditCard, PenTool, Home, ArrowRight, ArrowDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const endToEndFlow = [
  {
    step: 1,
    icon: Search,
    title: "Find a Listing",
    who: "Tenant",
    description: "Browse furnished rentals on ecrenta by price, location, and bedrooms. Find the perfect room or unit in Fresno County.",
    detail: "Example: '$550 – Private room for rent' in Fresno, CA",
    color: "primary",
  },
  {
    step: 2,
    icon: MessageCircle,
    title: "Send a Message",
    who: "Tenant → Landlord",
    description: "Reach out directly through the built-in chat. Ask questions, share your situation, and express interest — just like messaging on Facebook Marketplace.",
    detail: '"Hi! I\'m interested in the room. Is it still available?"',
    color: "primary",
  },
  {
    step: 3,
    icon: Eye,
    title: "Schedule a Showing",
    who: "Landlord",
    description: "The landlord shares the property address and coordinates a visit. You can call ahead or use the doorbell when you arrive.",
    detail: '"Meet me at 6736 N Western Ave, Fresno CA — 7 min drive"',
    color: "accent",
  },
  {
    step: 4,
    icon: FileCheck,
    title: "Bring Your Documents",
    who: "Tenant",
    description: "Come prepared with your ID, proof of income (paystub or benefit card), and be ready to discuss move-in costs.",
    detail: "ID + paystub or benefit card required",
    color: "primary",
  },
  {
    step: 5,
    icon: CreditCard,
    title: "Pay First & Last Month",
    who: "Tenant → Landlord",
    description: "Secure the unit with first and last month's rent. Pay via Zelle, bank transfer, or cash — whatever works for both parties.",
    detail: "Accepted: Zelle, bank-to-bank, or cash",
    color: "primary",
  },
  {
    step: 6,
    icon: PenTool,
    title: "Sign the Rental Agreement",
    who: "Both",
    description: "Review and sign the lease electronically through ecrenta. Both landlord and tenant get a signed copy instantly.",
    detail: "E-sign right from your phone — no printer needed",
    color: "accent",
  },
  {
    step: 7,
    icon: Home,
    title: "Move In",
    who: "Tenant",
    description: "Get your keys, move in, and enjoy your new furnished space. Utilities often included. The landlord can even help set up a bed and essentials.",
    detail: "Free utilities included on many listings",
    color: "primary",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="How ecrenta Works — From Listing to Move-In"
        description="See the complete rental process on ecrenta: find a listing, message the landlord, schedule a showing, verify documents, pay, sign, and move in. Simple and transparent."
      />

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

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center">
          <h1 className="font-[var(--font-heading)] text-3xl font-extrabold sm:text-5xl">
            How It Works
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            From finding a listing to moving in — here's the complete rental process on ecrenta, step by step.
          </p>
        </div>

        {/* Flow */}
        <div className="relative mt-12 sm:mt-16">
          {/* Vertical line connector */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border sm:left-6" />

          <div className="space-y-0">
            {endToEndFlow.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Step node */}
                <div className="relative flex items-start gap-4 py-5 sm:gap-5">
                  {/* Icon circle */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                      step.color === "primary"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  {/* Content card */}
                  <div className="flex-1 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        step.color === "primary" ? "text-primary" : "text-accent"
                      }`}>
                        Step {step.step}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {step.who}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-[var(--font-heading)] text-lg font-bold sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 px-3 py-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-xs font-medium text-foreground/80">{step.detail}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow between steps */}
                {i < endToEndFlow.length - 1 && (
                  <div className="flex justify-center py-0">
                    <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <h2 className="font-[var(--font-heading)] text-xl font-bold sm:text-2xl">
            Ready to get started?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Whether you're looking for a room or listing one — the process starts here.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 rounded-xl px-8">
              <Link to="/listings">
                <Search className="h-4 w-4" />
                Browse Listings
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 rounded-xl px-8">
              <Link to="/for-landlords">
                <Home className="h-4 w-4" />
                List Your Property
              </Link>
            </Button>
          </div>
        </div>

        {/* FAQ-style note */}
        <div className="mt-10 rounded-2xl bg-secondary/40 p-5 sm:p-6">
          <h3 className="font-[var(--font-heading)] text-base font-bold">This is how we actually do it</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            This flow is based on real conversations between landlords and tenants on our platform. 
            We built ecrenta to streamline exactly this process — from the first message to the signed lease. 
            No middleman, no hidden fees for tenants, and a simple subscription for landlords.
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ecrenta. All rights reserved.
      </footer>
    </div>
  );
}
