import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Search, Shield, MessageCircle, Sparkles, CheckCircle2,
  Home, Wrench, CreditCard, Laptop, Lock, Download, Zap, FileText,
  TrendingUp, Star, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const bento = [
  { icon: Home, title: "Unlimited properties", desc: "1 door or 100. Flat $29/mo — no per-unit fees.", span: "sm:col-span-2 sm:row-span-2", accent: "primary" },
  { icon: CreditCard, title: "Your Stripe, your rent", desc: "Tenants pay you direct. We never touch the money.", span: "", accent: "accent" },
  { icon: Shield, title: "Free screening", desc: "Background, credit, income — tenants pay nothing.", span: "", accent: "primary" },
  { icon: MessageCircle, title: "One inbox", desc: "Every inquiry, message, application in one thread.", span: "sm:col-span-2", accent: "accent" },
  { icon: Wrench, title: "Maintenance tracker", desc: "Log, dispatch, paper trail.", span: "", accent: "primary" },
  { icon: FileText, title: "Lease templates", desc: "Send, e-sign, store forever.", span: "", accent: "accent" },
];

const stats = [
  { k: "$29", v: "flat monthly" },
  { k: "0%", v: "tenant fees" },
  { k: "∞", v: "properties" },
  { k: "1-click", v: "data export" },
  { k: "24/7", v: "AI assistant" },
];

const antiTrap = [
  { icon: Lock, title: "No tenant fees, ever", desc: "We never charge your tenants a dime." },
  { icon: Download, title: "One-click data export", desc: "Take everything, anywhere, anytime." },
  { icon: Zap, title: "Cancel anytime", desc: "Month-to-month. No exit penalties." },
  { icon: Shield, title: "No tenant poaching", desc: "Your relationships stay yours." },
];

export default function Index() {
  const { user, role } = useAuth();
  const { listings } = useListings();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const featuredListings = listings.filter((l) => l.available).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>myrental — Self-manage your rentals for $29/mo</title>
        <meta name="description" content="The anti-trap rental platform. Unlimited properties, your own Stripe for rent, zero tenant fees. $29/mo flat. Cancel anytime." />
      </Helmet>

      {/* Nav */}
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5"><BrandLogo size="md" /></Link>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/listings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Listings</Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" asChild className="rounded-full">
                <Link to={role === "landlord" ? "/dashboard" : "/listings"}>
                  {role === "landlord" ? "Dashboard" : "My Rentals"}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/auth">Login</Link></Button>
                <Button size="sm" asChild className="rounded-full shadow-lg shadow-primary/25">
                  <Link to="/get-started">Start free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="orb w-[500px] h-[500px] bg-primary/30 top-[-100px] left-[-100px] animate-drift" />
        <div className="orb w-[400px] h-[400px] bg-accent/30 top-[100px] right-[-80px] animate-drift" style={{ animationDelay: "-7s" }} />
        <div className="orb w-[300px] h-[300px] bg-primary-glow/20 bottom-[-50px] left-[40%] animate-drift" style={{ animationDelay: "-14s" }} />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground)/0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              New · AI-powered inspections live
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Run your rentals.<br />
              <span className="text-gradient">Keep your tenants.</span><br />
              Keep your money.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              The anti-trap rental platform. <span className="font-semibold text-foreground">$29/mo flat</span>, unlimited properties,
              your own Stripe for rent, and a one-click export of everything — anytime.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="group gap-2 px-8 py-6 rounded-full text-base shadow-xl shadow-primary/30 animate-pulse-glow">
                <Link to="/get-started">
                  Start free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-full text-base backdrop-blur bg-card/50">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">No credit card · Cancel anytime · Keep your data</p>
          </div>

          {/* Tenant search */}
          <div className="mx-auto mt-14 max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="glass rounded-2xl p-2 shadow-xl">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Search className="ml-3 h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Looking to rent? Search city or zip..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <Button type="submit" size="sm" className="rounded-xl">Search</Button>
              </form>
            </div>
          </div>
        </div>

        {/* Marquee stats strip */}
        <div className="relative border-y border-border/60 bg-card/40 backdrop-blur py-6 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...stats, ...stats, ...stats].map((s, i) => (
              <div key={i} className="mx-8 flex items-center gap-3 shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-gradient">{s.k}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">{s.v}</span>
                <span className="ml-8 h-1.5 w-1.5 rounded-full bg-primary/40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO FEATURES */}
      <section id="features" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center mb-14 animate-fade-up">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles className="h-3 w-3" /> Everything, one place
            </div>
            <h2 className="text-4xl font-bold sm:text-5xl">
              Built for landlords who want <span className="text-gradient">control</span>.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              No spreadsheet chaos. No hidden fees. Just software that works.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 auto-rows-[180px]">
            {bento.map((b, i) => {
              const Icon = b.icon;
              const isBig = b.span.includes("row-span-2");
              return (
                <div key={b.title} className={`bento-tile group ${b.span} animate-fade-up`} style={{ animationDelay: `${i * 0.06}s` }}>
                  {/* decoration */}
                  <div className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity ${b.accent === "primary" ? "bg-primary/30" : "bg-accent/30"}`} />
                  <div className={`relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${b.accent === "primary" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className={`relative font-bold ${isBig ? "text-2xl" : "text-lg"}`}>{b.title}</h3>
                  <p className={`relative mt-2 text-muted-foreground ${isBig ? "text-base" : "text-sm"}`}>{b.desc}</p>
                  {isBig && (
                    <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                      Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stripe Connect callout */}
      <section className="relative overflow-hidden border-y border-border/60 bg-card/40">
        <div className="orb w-[400px] h-[400px] bg-primary/20 top-[20%] right-[-100px] animate-drift" />
        <div className="mx-auto max-w-7xl px-4 py-24 relative">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <CreditCard className="h-3 w-3" /> Rent collection, done right
              </div>
              <h2 className="text-4xl font-bold sm:text-5xl leading-tight">
                Your Stripe.<br /><span className="text-gradient">Your bank. Your rent.</span>
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
                Connect your own Stripe account in 5 minutes. Tenants pay you directly — we never touch the money,
                never take a cut, never charge a service fee.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {["Card + ACH payments out of the box", "Next-business-day deposits", "You own the Stripe account — leave anytime"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild className="mt-8 rounded-full shadow-lg shadow-primary/25">
                <Link to={user ? "/rent-collection" : "/get-started"}>
                  Set up rent collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Animated receipt card */}
            <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent blur-3xl" />
              <div className="relative rounded-3xl border border-border bg-card p-8 shadow-2xl animate-float-slow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rent from Unit 4B</p>
                      <p className="font-semibold text-sm">Sarah Chen</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Nov 1</div>
                </div>
                <div className="mb-1 text-xs text-muted-foreground uppercase tracking-wider">You received</div>
                <div className="text-5xl font-extrabold text-gradient">$1,800.00</div>
                <div className="mt-6 space-y-2.5 text-sm border-t border-border pt-5">
                  <div className="flex justify-between"><span className="text-muted-foreground">Monthly rent</span><span className="font-medium tabular-nums">$1,800.00</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Stripe processing</span><span className="text-muted-foreground tabular-nums">to Stripe</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">myrental fee</span><span className="font-bold text-primary tabular-nums">$0.00</span></div>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-xs font-medium text-primary">
                  <TrendingUp className="h-4 w-4" /> Deposit lands tomorrow, 9:00 AM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anti-trap */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="mx-auto max-w-2xl text-center mb-14 animate-fade-up">
            <h2 className="text-4xl font-bold sm:text-5xl">
              No tricks. No traps.<br /><span className="text-gradient">Just software.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Other platforms trap your tenants, your data, and your money. We don't.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {antiTrap.map((a, i) => (
              <div key={a.title} className="bento-tile animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="relative border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="text-center mb-14 animate-fade-up">
            <h2 className="text-4xl font-bold sm:text-5xl">Simple. Honest. <span className="text-gradient">Pricing.</span></h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-lg">
              Start with software. Add management when you're ready.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="relative rounded-3xl bg-card p-8 shadow-xl animate-fade-up overflow-hidden">
              <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-br from-primary via-accent to-primary-glow animate-gradient-pan">
                <div className="h-full w-full rounded-[calc(1.5rem-2px)] bg-card" />
              </div>
              <div className="relative">
                <div className="absolute -top-4 left-0 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">Most Popular</div>
                <Laptop className="h-7 w-7 text-primary mt-4" />
                <h3 className="mt-4 text-xl font-bold">Self-Manage</h3>
                <p className="mt-3"><span className="text-5xl font-extrabold">$29</span><span className="text-muted-foreground text-sm">/mo flat</span></p>
                <p className="mt-3 text-sm text-muted-foreground">You run it. Software does the heavy lifting.</p>
                <Button asChild className="mt-6 w-full rounded-full shadow-lg shadow-primary/25"><Link to="/get-started">Start free</Link></Button>
              </div>
            </div>
            <div className="bento-tile animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <Home className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Property Management</h3>
              <p className="mt-3"><span className="text-5xl font-extrabold">$99</span><span className="text-muted-foreground text-sm">/mo per property</span></p>
              <p className="mt-3 text-sm text-muted-foreground">We list, screen, collect rent, handle maintenance.</p>
              <Button variant="outline" asChild className="mt-6 w-full rounded-full"><Link to="/pricing">Learn more</Link></Button>
            </div>
            <div className="bento-tile animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Shield className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Premium</h3>
              <p className="mt-3"><span className="text-5xl font-extrabold">$149</span><span className="text-muted-foreground text-sm">/mo per property</span></p>
              <p className="mt-3 text-sm text-muted-foreground">Management + AI + dedicated manager.</p>
              <Button variant="outline" asChild className="mt-6 w-full rounded-full"><Link to="/pricing">Learn more</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 py-24">
            <div className="flex items-end justify-between mb-10 animate-fade-up">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  <Star className="h-3 w-3" /> Fresh on the market
                </div>
                <h2 className="text-4xl font-bold sm:text-5xl">Browse rentals</h2>
                <p className="mt-2 text-muted-foreground">Furnished and ready for move-in</p>
              </div>
              <Button variant="ghost" asChild className="gap-1 text-sm rounded-full">
                <Link to="/listings">View all <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border p-1 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary-glow animate-gradient-pan opacity-90" />
            <div className="relative rounded-[calc(2rem-4px)] bg-background/80 backdrop-blur p-10 sm:p-16 text-center">
              <div className="orb w-[400px] h-[400px] bg-primary/20 top-[-100px] left-[-100px] animate-drift" />
              <div className="orb w-[300px] h-[300px] bg-accent/20 bottom-[-80px] right-[-50px] animate-drift" style={{ animationDelay: "-8s" }} />
              <div className="relative">
                <h2 className="text-4xl font-bold sm:text-5xl">Ready to take back <span className="text-gradient">control?</span></h2>
                <p className="mt-4 max-w-xl mx-auto text-muted-foreground text-lg">
                  Start free. Unlimited properties. Cancel anytime. Keep everything.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-full text-base shadow-xl shadow-primary/30 animate-pulse-glow">
                    <Link to="/get-started">Start free <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-full text-base backdrop-blur bg-card/50">
                    <Link to="/pricing">Compare plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2.5"><BrandLogo size="sm" /></Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                The anti-trap rental platform. Software first. Your data, your money, your tenants.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/listings" className="hover:text-foreground transition-colors">Listings</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How it works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border/60 text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} myrental. Made for landlords who care.
          </div>
        </div>
      </footer>
    </div>
  );
}
