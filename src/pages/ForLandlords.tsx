import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  Check,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Zap,
  BarChart3,
  MessageCircle,
  Clock,
  Star,
  MapPin,
  Building,
  ChevronRight,
  DoorOpen,
  Home,
  Banknote,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: DollarSign,
    title: "Lower Fees, Higher Returns",
    description:
      "Starting at just $9.99/mo — a fraction of what competitors charge. Zero commissions on any rental, ever.",
  },
  {
    icon: Users,
    title: "Pre-Qualified Tenants",
    description:
      "Every tenant gets free background & credit screening before they message you. No tire-kickers.",
  },
  {
    icon: Zap,
    title: "Fill Vacancies Faster",
    description:
      "Direct messaging means no middlemen. Connect with traveling healthcare pros actively seeking furnished housing.",
  },
  {
    icon: Shield,
    title: "Reliable, Long-Term Stays",
    description:
      "30+ day minimum stays with contract professionals. Less turnover, fewer headaches, consistent income.",
  },
  {
    icon: BarChart3,
    title: "Landlord Dashboard",
    description:
      "Manage listings, track inquiries, review applications, and handle conversations — all in one place.",
  },
  {
    icon: MessageCircle,
    title: "Built-In Messaging",
    description:
      "Chat directly with prospective tenants. Schedule showings, negotiate terms, and close deals without leaving the platform.",
  },
];

const comparisonData = [
  { feature: "Monthly Plan", ecrenta: "$9.99/mo", competitor: "$16.58/mo" },
  { feature: "Annual Plan", ecrenta: "$99/yr", competitor: "$199/yr" },
  { feature: "Commission Fees", ecrenta: "0%", competitor: "0–10%" },
  { feature: "Tenant Screening Cost", ecrenta: "Free (we pay)", competitor: "$44.99/tenant" },
  { feature: "Direct Messaging", ecrenta: "Included", competitor: "Included" },
  { feature: "Fresno County Focus", ecrenta: "Specialized", competitor: "Generic" },
];

const testimonials = [
  {
    quote:
      "I listed my duplex and had a traveling nurse reach out within 48 hours. The screening was already done — I just had to say yes.",
    name: "Maria G.",
    detail: "2 properties in Clovis",
    stars: 5,
  },
  {
    quote:
      "Switching from FurnishedFinder saved me $100/yr and I'm getting more inquiries from local healthcare workers.",
    name: "James T.",
    detail: "4 properties in Fresno",
    stars: 5,
  },
  {
    quote:
      "The direct messaging is a game changer. No back-and-forth emails, no phone tag. Just real conversations that lead to signed leases.",
    name: "Sarah K.",
    detail: "1 property in Madera",
    stars: 5,
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up in under 2 minutes. Pick monthly or annual — cancel anytime.",
  },
  {
    number: "02",
    title: "List Your Property",
    description: "Add photos, set your price, describe amenities. Or import from an existing listing.",
  },
  {
    number: "03",
    title: "Get Screened Inquiries",
    description: "Pre-qualified tenants message you directly. Review their free background check instantly.",
  },
  {
    number: "04",
    title: "Close the Deal",
    description: "Agree on terms, sign the lease, and welcome your new tenant. We handle nothing else — it's your property.",
  },
];

const faqs = [
  {
    q: "How is ecrenta different from FurnishedFinder?",
    a: "We're cheaper ($99/yr vs $199/yr), we cover tenant screening for free (they charge $44.99), and we specialize in Fresno County so your listing reaches the right local audience.",
  },
  {
    q: "What kind of tenants will I get?",
    a: "Primarily traveling nurses, therapists, and contract healthcare workers on 3–12 month assignments in the Central Valley. These are employed professionals with verified income.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. Monthly plans cancel anytime with no penalty. Annual plans run for the full year. Manage everything from your dashboard.",
  },
  {
    q: "Do I have to pay any commission on rentals?",
    a: "Never. Zero commissions, zero transaction fees. Your subscription is all you pay.",
  },
  {
    q: "What does 'free tenant screening' mean?",
    a: "We run background and credit checks on tenants at no cost to them or you. You see results before you even respond to an inquiry.",
  },
  {
    q: "Can I list just a spare room, not a full property?",
    a: "Absolutely. Many of our listings are private rooms with separate entrances — guest houses, casitas, converted garages, or ADUs. If it's furnished with its own access, traveling nurses love it.",
  },
  {
    q: "How much can I earn from a spare room?",
    a: "Private furnished rooms in Fresno County typically rent for $800–$1,500/mo depending on size and amenities. After your $9.99/mo subscription, that's nearly all profit with zero commissions.",
  },
  {
    q: "What if I've never been a landlord before?",
    a: "No experience needed. We pre-screen every tenant for you (free), provide direct messaging so you can ask questions before committing, and the 30-day minimum means you're getting stable, employed professionals — not short-term party guests.",
  },
];

export default function ForLandlords() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">
              ecrenta
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/pricing">Start Listing</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(152_55%_38%/0.1),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Building className="h-4 w-4" />
              For Property Owners
            </div>
            <h1 className="font-[var(--font-heading)] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Stop Paying Too Much to
              <span className="text-primary"> Fill Your Rentals</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              List your furnished property for as little as <strong className="text-foreground">$9.99/mo</strong>. 
              Reach traveling nurses and healthcare pros relocating to Fresno County — with 
              <strong className="text-foreground"> free tenant screening</strong> and 
              <strong className="text-foreground"> zero commissions</strong>.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="gap-2 text-base px-10 py-7 rounded-xl shadow-lg">
                <Link to="/pricing">
                  Start Listing Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-10 py-7 rounded-xl">
                <Link to="#comparison">See How We Compare</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No commissions</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free tenant screening</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 50% cheaper than competitors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 text-center">
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">$99</p>
            <p className="mt-1 text-sm text-muted-foreground">Per Year, Best Value</p>
          </div>
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">0%</p>
            <p className="mt-1 text-sm text-muted-foreground">Commission Fees</p>
          </div>
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">Free</p>
            <p className="mt-1 text-sm text-muted-foreground">Tenant Screening</p>
          </div>
          <div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-primary">48hr</p>
            <p className="mt-1 text-sm text-muted-foreground">Avg. First Inquiry</p>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Everything You Need to Rent Furnished
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We built ecrenta for landlords who are tired of overpaying platforms that underdeliver.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="font-[var(--font-heading)] text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-[var(--font-heading)] text-center text-3xl font-bold sm:text-4xl">
            List Your Property in 4 Steps
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.number} className="relative">
                {i < steps.length - 1 && (
                  <ChevronRight className="absolute -right-4 top-8 hidden h-6 w-6 text-border lg:block" />
                )}
                <div className="mb-4 font-[var(--font-heading)] text-4xl font-extrabold text-primary/20">
                  {s.number}
                </div>
                <h3 className="font-[var(--font-heading)] text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section id="comparison" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
        <div className="text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            ecrenta vs. FurnishedFinder
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Same tenant pool. Better price. Better tools.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-primary/5">
                <th className="px-5 py-4 text-left font-semibold" />
                <th className="px-5 py-4 text-center font-[var(--font-heading)] font-bold text-primary text-lg">ecrenta</th>
                <th className="px-5 py-4 text-center font-semibold text-muted-foreground">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparisonData.map(({ feature, ecrenta: ours, competitor }) => (
                <tr key={feature} className="bg-card">
                  <td className="px-5 py-4 font-medium">{feature}</td>
                  <td className="px-5 py-4 text-center font-semibold text-primary">{ours}</td>
                  <td className="px-5 py-4 text-center text-muted-foreground line-through decoration-destructive/40">
                    {competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Competitor pricing based on FurnishedFinder's published rates as of 2024.
        </p>
      </section>

      {/* Spare Room / Private Entrance Section */}
      <section id="spare-room" className="border-y border-border bg-primary/5 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-5">
                <DoorOpen className="h-4 w-4" />
                Private Room Rentals
              </div>
              <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl leading-tight">
                Have a Spare Room with a
                <span className="text-primary"> Private Entrance?</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
                Traveling nurses and healthcare professionals are actively searching for private, 
                furnished rooms in Fresno County right now. If you have a guest house, casita, 
                converted garage, or a room with its own entrance — you're sitting on 
                <strong className="text-foreground"> $800–$1,500/mo in extra income</strong>.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: Banknote, text: "Earn $800–$1,500/mo from your unused space" },
                  { icon: Lock, text: "Private entrance = privacy for both you and your tenant" },
                  { icon: Shield, text: "Every tenant is pre-screened — background & credit checks included free" },
                  { icon: Clock, text: "30+ day stays mean stable, reliable income — not revolving-door guests" },
                  { icon: Home, text: "No full property needed — just a furnished room with its own access" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="gap-2 text-base px-8 py-6 rounded-xl">
                  <Link to="/pricing">
                    List Your Room — $9.99/mo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 max-w-md mx-auto lg:mx-0">
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="font-[var(--font-heading)] text-lg font-bold mb-5">Quick Math: Your Spare Room</h3>
                <div className="space-y-4">
                  {[
                    { label: "Avg. monthly rent for private room", value: "$1,100" },
                    { label: "Your ecrenta subscription", value: "−$9.99/mo" },
                    { label: "Commission fees", value: "$0" },
                    { label: "Tenant screening cost", value: "$0" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium text-foreground">{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <span className="font-[var(--font-heading)] font-semibold">You keep per month</span>
                    <span className="font-[var(--font-heading)] text-2xl font-bold text-primary">$1,090</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  That's <strong className="text-foreground">$13,080/yr</strong> from one spare room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-[var(--font-heading)] text-center text-3xl font-bold sm:text-4xl">
            Landlords Love ecrenta
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">"{t.quote}"</p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="font-[var(--font-heading)] text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="font-[var(--font-heading)] text-center text-3xl font-bold sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-border bg-card overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium hover:bg-muted/50 transition-colors">
                {faq.q}
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl lg:text-5xl">
            Your Property Deserves
            <span className="text-primary"> Better Tenants</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join landlords across Fresno County who are filling vacancies faster, 
            screening tenants for free, and keeping more of their rental income.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 text-base px-10 py-7 rounded-xl shadow-lg">
              <Link to="/pricing">
                Get Started — $9.99/mo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Annual plan available at $99/yr — save over 17%. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-[var(--font-heading)] text-lg font-bold">ecrenta</span>
            </Link>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} ecrenta. All rights reserved. Fresno County, California.
          </p>
        </div>
      </footer>
    </div>
  );
}
