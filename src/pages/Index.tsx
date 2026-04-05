import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import {
  Bot, ClipboardCheck, BarChart3, ArrowRight, Check, Sparkles,
  MessageCircle, Shield, Search, MapPin, Zap, Building, Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const p8Modes = [
  {
    icon: Bot,
    title: "Virtual Assistant",
    tag: "VA",
    description:
      "Draft legal notices, answer tenant questions, and manage communications — all powered by AI that knows your properties.",
    examples: ["'Draft a 3-day notice for unit 5'", "'What's my vacancy rate?'", "'Write a lease renewal offer'"],
  },
  {
    icon: ClipboardCheck,
    title: "Inspector",
    tag: "Inspector",
    description:
      "Upload move-out photos and get instant AI-powered condition reports with damage assessments, repair costs, and deposit deduction recommendations.",
    examples: ["AI photo analysis", "Damage vs. wear & tear", "Cost estimates"],
  },
  {
    icon: BarChart3,
    title: "Property Manager",
    tag: "Manager",
    description:
      "Track maintenance priorities, analyze portfolio performance, and get data-driven insights to maximize your rental income.",
    examples: ["Maintenance triage", "Financial summaries", "Market rent analysis"],
  },
];

const benefits = [
  { icon: Zap, title: "Instant Responses", description: "No waiting for callbacks. P8 answers in seconds, 24/7." },
  { icon: Shield, title: "California Law Compliant", description: "Notices and documents follow CA landlord-tenant law." },
  { icon: Brain, title: "Knows Your Properties", description: "P8 uses your real listings, tenants, and maintenance data." },
  { icon: Building, title: "Built for Small Landlords", description: "Replace expensive PMs. Manage 1–50 units with AI." },
];

const comparison = [
  ["Property Manager Cost", "From $49/mo", "$150–300/unit/mo"],
  ["Availability", "24/7 instant", "Business hours"],
  ["Inspection Reports", "AI in minutes", "Days–weeks"],
  ["Legal Notices", "Drafted instantly", "Attorney fees"],
  ["Maintenance Triage", "Auto-prioritized", "Manual tracking"],
  ["Portfolio Insights", "Real-time AI", "Monthly reports"],
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>runp8 — AI Property Management Assistant</title>
        <meta name="description" content="P8 is your AI property inspector, virtual assistant, and property manager. Manage rentals smarter with AI that knows your properties." />
      </Helmet>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">runp8</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/p8" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">P8 Assistant</Link>
            <Link to="/listings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Rentals</Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/p8">Open P8</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="gap-1.5">
                  <Link to="/auth">
                    <Sparkles className="h-3.5 w-3.5" />
                    Try P8 Free
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — P8 is the star */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(152_55%_38%/0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pt-24">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Property Management
            </div>
            <h1 className="font-[var(--font-heading)] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl max-w-4xl">
              Meet <span className="text-primary">P8</span> — Your AI
              <br className="hidden sm:block" /> Property Manager
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Inspector. Virtual assistant. Property manager. P8 handles inspections, drafts legal notices,
              triages maintenance, and manages your portfolio — so you don't need a $300/month property manager.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto gap-2 text-base px-8 py-6 rounded-xl">
                <Link to={user ? "/p8" : "/auth"}>
                  <Sparkles className="h-4 w-4" />
                  {user ? "Open P8" : "Try P8 Free"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-8 py-6 rounded-xl">
                <Link to="/listings">Browse Rentals</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 justify-center">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" /> No credit card required
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" /> California law compliant
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" /> Uses your real data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* P8 Three Modes */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Three AI Modes. One Assistant.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            P8 adapts to what you need — from inspections to legal drafts to portfolio analytics.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {p8Modes.map((mode) => (
            <div
              key={mode.tag}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <mode.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{mode.tag}</span>
                  <h3 className="font-[var(--font-heading)] text-lg font-semibold mt-0.5">{mode.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{mode.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mode.examples.map((ex) => (
                  <span key={ex} className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
            <Link to={user ? "/p8" : "/auth"}>
              Start Using P8
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-[var(--font-heading)] text-center text-3xl font-bold sm:text-4xl">
            Why Landlords Choose P8
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <b.icon className="h-7 w-7" />
                </div>
                <h3 className="font-[var(--font-heading)] font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* P8 vs. Traditional PM */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-[var(--font-heading)] text-center text-3xl font-bold sm:text-4xl">
          P8 vs. Traditional Property Manager
        </h2>
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-primary">P8 AI</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Traditional PM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.map(([feature, p8, trad]) => (
                <tr key={feature} className="bg-card">
                  <td className="px-4 py-3 font-medium">{feature}</td>
                  <td className="px-4 py-3 text-center font-semibold text-primary">{p8}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{trad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tenant section — secondary */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">For Tenants</span>
            <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl mt-4">
              Looking for a Furnished Rental?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Browse verified furnished properties in Fresno County. Free for tenants — no commissions, free screening.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Search, title: "Browse Listings", desc: "Verified furnished rentals in Fresno County" },
              { icon: MessageCircle, title: "Message Landlords", desc: "Chat directly — no middlemen" },
              { icon: Shield, title: "Free Screening", desc: "Background checks at no cost to you" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border p-6 text-center">
                <f.icon className="mx-auto h-8 w-8 text-accent mb-3" />
                <h3 className="font-[var(--font-heading)] font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" variant="outline" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
              <Link to="/listings">
                Browse Rentals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-primary/60 mb-4" />
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Run Your Properties with P8
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Join landlords who are replacing expensive property managers with AI that works 24/7.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
              <Link to={user ? "/p8" : "/auth"}>
                <Sparkles className="h-4 w-4" />
                {user ? "Open P8" : "Get Started Free"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-xl text-base">
              <Link to="/pricing">See Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-[var(--font-heading)] text-lg font-bold">runp8</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                AI-powered property management for landlords. Inspector. VA. Manager.
              </p>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">P8 AI</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/p8" className="hover:text-foreground transition-colors">P8 Assistant</Link></li>
                <li><Link to="/inspections" className="hover:text-foreground transition-colors">Inspections</Link></li>
                <li><Link to="/maintenance" className="hover:text-foreground transition-colors">Maintenance</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Rentals</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/listings" className="hover:text-foreground transition-colors">Browse Rentals</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link to="/for-landlords" className="hover:text-foreground transition-colors">For Landlords</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} runp8 — EC Rental Property Management LLC</p>
            <p className="text-xs text-muted-foreground">Fresno County, California</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
