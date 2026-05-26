import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  Check,
  Search,
  Shield,
  MessageCircle,
  Home,
  Stethoscope,
  Wallet,
  MapPin,
  Star,
  Sparkles,
  CalendarCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Wallet,
    title: "No Fees, Ever",
    description:
      "Searching, messaging, and background checks are 100% free for tenants. You only pay your rent — never us.",
  },
  {
    icon: Shield,
    title: "Free Background Check",
    description:
      "Get pre-screened once and landlords see you're verified. Skip the application fees other platforms charge.",
  },
  {
    icon: MessageCircle,
    title: "Message Landlords Directly",
    description:
      "No agents, no middlemen. Chat directly with owners, ask questions, schedule a tour, and lock in your stay.",
  },
  {
    icon: Stethoscope,
    title: "Built for Traveling Pros",
    description:
      "Furnished 30+ day stays designed for nurses, therapists, and contract healthcare workers on Central Valley assignments.",
  },
  {
    icon: Home,
    title: "Move-In Ready Homes",
    description:
      "Every listing is fully furnished — bed, kitchen, Wi-Fi, utilities. Bring a suitcase, not a U-Haul.",
  },
  {
    icon: MapPin,
    title: "Fresno County Focus",
    description:
      "Near hospitals, clinics, and travel assignments across Fresno, Clovis, Madera, and Visalia.",
  },
];

const steps = [
  {
    number: "01",
    title: "Browse Verified Listings",
    description: "Filter by neighborhood, dates, price, and amenities. Every home is furnished and move-in ready.",
  },
  {
    number: "02",
    title: "Get Screened Free",
    description: "One background and credit check, used across every landlord conversation. No repeat fees.",
  },
  {
    number: "03",
    title: "Message the Landlord",
    description: "Ask questions, request a tour, agree on dates. All in one chat — no email tag.",
  },
  {
    number: "04",
    title: "Move In",
    description: "Sign the lease, get your keys, and start your assignment with a place that already feels like home.",
  },
];

const testimonials = [
  {
    quote:
      "Found a furnished casita 10 minutes from CRMC in two days. The landlord answered me directly — no agent runaround.",
    name: "Alyssa M.",
    detail: "Travel Nurse, 13-week assignment",
    stars: 5,
  },
  {
    quote:
      "I'd been quoted $44 per application elsewhere. ecrenta screened me once for free and I had three landlord replies the same week.",
    name: "Devon R.",
    detail: "Travel PT, Clovis",
    stars: 5,
  },
  {
    quote:
      "Everything was already there — Wi-Fi, dishes, parking. I just unpacked and started my shift the next morning.",
    name: "Priya S.",
    detail: "ICU Nurse, Fresno",
    stars: 5,
  },
];

const faqs = [
  {
    q: "Is ecrenta really free for tenants?",
    a: "Yes. Browsing, messaging, and background checks cost nothing. Landlords pay a small subscription so you don't have to.",
  },
  {
    q: "Who are the typical landlords on ecrenta?",
    a: "Local Fresno County property owners renting furnished homes, guest houses, casitas, and ADUs — most of them experienced with traveling healthcare professionals.",
  },
  {
    q: "What does 'furnished' actually include?",
    a: "Beds, linens, a stocked kitchen, Wi-Fi, and usually utilities. Each listing details exactly what's included so there are no surprises.",
  },
  {
    q: "Can I stay less than 30 days?",
    a: "Most listings are 30+ day stays designed for travel contracts. Some landlords offer shorter terms — filter by length to see what's available.",
  },
  {
    q: "How does the free background check work?",
    a: "Complete one quick screening on your profile. Verified landlords see your status instantly — no paying $40+ for every application.",
  },
  {
    q: "Do I need a travel assignment to use ecrenta?",
    a: "Not at all. Anyone needing a furnished mid-term rental in the Central Valley can book — relocation, remote workers, family stays, all welcome.",
  },
];

export default function ForTenants() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="For Tenants – Furnished Rentals in Fresno County"
        description="Furnished 30+ day rentals for traveling nurses and professionals in Fresno County. Free background checks, message landlords directly, zero tenant fees."
      />
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" asChild>
                <Link to="/listings">Browse Listings</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/listings">Browse Listings</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(152_55%_38%/0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Stethoscope className="h-4 w-4" />
              For Traveling Professionals
            </div>
            <h1 className="font-[var(--font-heading)] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Furnished Rentals That
              <span className="text-primary"> Feel Like Home</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Mid-term furnished housing in Fresno County for traveling nurses and healthcare pros.
              <strong className="text-foreground"> Free background checks</strong>,
              <strong className="text-foreground"> direct landlord chat</strong>, and
              <strong className="text-foreground"> zero tenant fees</strong>.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="gap-2 text-base px-10 py-7 rounded-xl shadow-lg">
                <Link to="/listings">
                  Browse Rentals
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-10 py-7 rounded-xl">
                <Link to="#how-it-works">See How It Works</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free for tenants</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free background check</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 30+ day furnished stays</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Near every Central Valley hospital</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 text-center">
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">$0</p>
            <p className="mt-1 text-sm text-muted-foreground">Tenant Fees</p>
          </div>
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">Free</p>
            <p className="mt-1 text-sm text-muted-foreground">Background Check</p>
          </div>
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">30+</p>
            <p className="mt-1 text-sm text-muted-foreground">Day Furnished Stays</p>
          </div>
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">48hr</p>
            <p className="mt-1 text-sm text-muted-foreground">Avg. Landlord Reply</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Built Around How Tenants Actually Move
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We cut out the fees, agents, and paperwork — so you can land somewhere comfortable, fast.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-[var(--font-heading)] text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-card border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">From Search to Keys in Days</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Four straightforward steps — no agents, no application fees.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.number} className="rounded-2xl border border-border bg-background p-6">
                <p className="font-[var(--font-heading)] text-3xl font-bold text-primary/60">{s.number}</p>
                <h3 className="mt-3 font-[var(--font-heading)] text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Travelers Who Found Home Here
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <div className="mt-5">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <div className="text-center">
            <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">Tenant FAQs</h2>
          </div>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-background">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="font-medium text-sm">{f.q}</span>
                  <span className="text-primary transition group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Free for Tenants
          </div>
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Your Next Assignment Deserves a Real Home
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Browse verified furnished rentals across Fresno County and message landlords today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 text-base px-10 py-7 rounded-xl shadow-lg">
              <Link to="/listings">
                Browse Rentals
                <KeyRound className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-10 py-7 rounded-xl">
              <Link to="/auth">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row">
          <BrandLogo size="sm" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ecrenta. Furnished rentals for the Central Valley.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/for-landlords" className="hover:text-foreground">For Landlords</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
