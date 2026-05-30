import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Search, MapPin, Shield, MessageCircle,
  Sparkles, CheckCircle2, Camera, Home, Wrench, CreditCard,
  Users, Laptop, Lock, Download, Zap, FileText, Bot,
  Star, PlayCircle, HelpCircle, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveMarkets } from "@/data/markets";

const saasFeatures = [
  { icon: Home, title: "Unlimited Properties", desc: "Manage 1 or 100. Flat $29/mo — no per-door fees." },
  { icon: MessageCircle, title: "Tenant Inbox", desc: "Every inquiry, message, and application in one place." },
  { icon: Shield, title: "Free Tenant Screening", desc: "Background, credit, income — no fee to your tenant." },
  { icon: CreditCard, title: "Your Stripe, Your Rent", desc: "Connect your own Stripe. Rent goes straight to your bank." },
  { icon: Wrench, title: "Maintenance Tracker", desc: "Log requests, dispatch vendors, keep a paper trail." },
  { icon: FileText, title: "Lease & Form Templates", desc: "Send, e-sign, and store every document — yours forever." },
];

const antiTrap = [
  { icon: Lock, title: "No tenant fees, ever", desc: "We never charge your tenants a dime. They're yours, not ours." },
  { icon: Download, title: "One-click data export", desc: "Tenants, leases, payments, photos — yours to take anywhere." },
  { icon: Zap, title: "Cancel anytime", desc: "Month-to-month. No annual contracts. No exit penalties." },
  { icon: Shield, title: "We never market to tenants", desc: "No upsells, no ads, no poaching. Your relationships stay yours." },
];

export default function Index() {
  const { user, role } = useAuth();
  const { listings } = useListings();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const activeMarkets = getActiveMarkets();
  const featuredListings = listings.filter((l) => l.available).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>ecrenta — Self-manage your rentals for $29/mo | Anti-Trap Rental SaaS</title>
        <meta name="description" content="Software built for self-managing landlords. Unlimited properties, your own Stripe for rent, no tenant fees, one-click data export. $29/mo flat. Cancel anytime." />
      </Helmet>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#saas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Self-Manage</a>
            <a href="#management" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Full Management</a>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/listings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Listings</Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to={role === "landlord" ? "/dashboard" : "/listings"}>
                  {role === "landlord" ? "Dashboard" : "My Rentals"}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/auth">Login</Link></Button>
                <Button size="sm" asChild><Link to="/get-started">Start free</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* SaaS-first HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(152_55%_38%/0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Software for self-managing landlords
            </div>
            <h1 className="font-[var(--font-heading)] text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Run your rentals.<br />
              <span className="text-primary">Keep your tenants.</span><br />
              Keep your money.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              The anti-trap rental platform. <strong className="text-foreground">First month free</strong>, then
              <strong className="text-foreground"> $29 flat — forever.</strong> Unlimited properties, your own Stripe for rent,
              and <strong className="text-foreground">zero per-transaction fees.</strong>
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
                <Link to="/get-started">Start free — first month on us <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
                <a href="#how-it-works"><PlayCircle className="h-4 w-4" /> See how it works</a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card to start · Cancel anytime · Keep your data</p>
          </div>

          {/* Tenant search — secondary */}
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Search className="ml-2 h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Looking to rent? Search city or zip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <Button type="submit" size="sm" variant="secondary" className="rounded-lg">Search</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Social proof / testimonials — TODO: replace placeholder names with real landlord quotes */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trusted by independent landlords across California
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              // TODO: swap with real testimonials when collected
              { quote: "I cancelled my AppFolio account the day I tried Ecrenta. Same workflow, a tenth of the price.", name: "Marcus T.", city: "Fresno, CA" },
              { quote: "First month was free, set up Stripe in 10 minutes, and rent hit my bank the next day. No drama.", name: "Priya R.", city: "Clovis, CA" },
              { quote: "The fact that I own my Stripe and my tenant data sealed it. No lock-in is the whole point.", name: "Daniel K.", city: "Madera, CA" },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-background p-5">
                <div className="flex gap-0.5 text-primary">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <blockquote className="mt-2 text-sm text-foreground leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{t.name}</span> · {t.city}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* How it works / product preview */}
      <section id="how-it-works" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <PlayCircle className="h-3 w-3" /> See it in action
            </div>
            <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
              One dashboard. Every rental task.
            </h2>
            <p className="mt-3 text-muted-foreground">
              List a unit, invite a tenant, collect rent, log maintenance — all from one screen.
            </p>
          </div>

          {/* Static dashboard mockup */}
          <div className="mt-10 mx-auto max-w-4xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
              <span className="ml-3 text-[11px] text-muted-foreground font-mono">ecrenta.space/dashboard</span>
            </div>
            <div className="grid sm:grid-cols-[180px_1fr] min-h-[320px]">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col gap-1 border-r border-border bg-background/50 p-3 text-xs">
                {[
                  { icon: Home, label: "Properties", active: true },
                  { icon: MessageCircle, label: "Inbox" },
                  { icon: Users, label: "Tenants" },
                  { icon: CreditCard, label: "Rent" },
                  { icon: Wrench, label: "Maintenance" },
                  { icon: FileText, label: "Forms" },
                ].map((i) => (
                  <div key={i.label} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i.active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"}`}>
                    <i.icon className="h-3.5 w-3.5" /> {i.label}
                  </div>
                ))}
              </div>
              {/* Main panel */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-[var(--font-heading)] font-bold text-base">Rent collected — November</h3>
                  <span className="text-[10px] rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">on track</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Collected", value: "$12,400", tint: "text-primary" },
                    { label: "Pending", value: "$1,800", tint: "text-foreground" },
                    { label: "Late", value: "$0", tint: "text-muted-foreground" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-border bg-background p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.label}</p>
                      <p className={`mt-1 font-[var(--font-heading)] text-lg font-extrabold ${m.tint}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-background divide-y divide-border">
                  {[
                    { name: "245 W 14th St", tenant: "S. Johnson", amt: "$1,850", status: "Paid", paid: true },
                    { name: "1422 Oak Ridge Dr", tenant: "D. Park", amt: "$2,800", status: "Paid", paid: true },
                    { name: "78 Industrial Ave", tenant: "M. Lee", amt: "$1,800", status: "Pending", paid: false },
                  ].map((r) => (
                    <div key={r.name} className="flex items-center justify-between px-3 py-2 text-xs">
                      <div>
                        <p className="font-semibold text-foreground">{r.name}</p>
                        <p className="text-muted-foreground text-[11px]">{r.tenant}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold">{r.amt}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.paid ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">Live dashboard preview · actual screens may vary</p>
        </div>
      </section>

      {/* SaaS features grid */}
      <section id="saas" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
              Everything you need to self-manage
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built for landlords who want control without the spreadsheet chaos.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saasFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-[var(--font-heading)] font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stripe Connect callout */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <CreditCard className="h-3 w-3" /> Rent collection, done right
              </div>
              <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
                Your Stripe. Your bank. Your rent.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Connect your own Stripe account in 5 minutes. Tenants pay you directly — we never touch the money,
                never take a cut per transaction, and never charge your tenant a service fee.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Card + ACH payments out of the box</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Next-business-day deposits to your bank</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" /> You own the Stripe account — leave whenever</li>
              </ul>
              <Button size="lg" asChild className="mt-6 rounded-xl">
                <Link to={user ? "/rent-collection" : "/get-started"}>
                  Set up rent collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Lock className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-sm">Ecrenta fee per transaction</p>
                  <p className="font-[var(--font-heading)] text-3xl font-extrabold text-primary">$0.00</p>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Monthly rent</span><span className="font-medium">$1,800.00</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Stripe processing</span><span className="font-medium">paid to Stripe</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ecrenta cut</span><span className="font-medium text-primary">$0</span></div>
                <div className="flex justify-between border-t border-border pt-2 mt-2"><span className="font-semibold">You receive</span><span className="font-bold">100% (minus Stripe)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The anti-trap promise */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
              No tricks. No traps. <span className="text-primary">Just software.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Other platforms trap your tenants, your data, and your money. We don't.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {antiTrap.map((a) => (
              <div key={a.title} className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="font-[var(--font-heading)] font-semibold">{a.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">Simple, honest pricing</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Start with software. Add management when you're ready.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {/* SaaS */}
            <div className="relative rounded-2xl border-2 border-primary bg-background p-6 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Most Popular</div>
              <Laptop className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-[var(--font-heading)] text-lg font-bold">Self-Manage</h3>
              <p className="mt-2"><span className="font-[var(--font-heading)] text-3xl font-extrabold">$29</span><span className="text-muted-foreground text-sm">/mo flat</span></p>
              <p className="mt-2 text-xs text-muted-foreground">You run it. Software does the heavy lifting.</p>
              <Button asChild className="mt-5 w-full rounded-xl"><Link to="/get-started">Start free</Link></Button>
            </div>
            {/* Management */}
            <div id="management" className="rounded-2xl border border-border bg-background p-6">
              <Home className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-[var(--font-heading)] text-lg font-bold">Property Management</h3>
              <p className="mt-2"><span className="font-[var(--font-heading)] text-3xl font-extrabold">$99</span><span className="text-muted-foreground text-sm">/mo per property</span></p>
              <p className="mt-2 text-xs text-muted-foreground">We list, screen, collect rent, handle maintenance.</p>
              <Button variant="outline" asChild className="mt-5 w-full rounded-xl"><Link to="/pricing">Learn more</Link></Button>
            </div>
            {/* Premium */}
            <div className="rounded-2xl border border-border bg-background p-6">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-[var(--font-heading)] text-lg font-bold">Premium</h3>
              <p className="mt-2"><span className="font-[var(--font-heading)] text-3xl font-extrabold">$149</span><span className="text-muted-foreground text-sm">/mo per property</span></p>
              <p className="mt-2 text-xs text-muted-foreground">Management + AI + dedicated manager.</p>
              <Button variant="outline" asChild className="mt-5 w-full rounded-xl"><Link to="/pricing">Learn more</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">Browse rentals</h2>
                <p className="mt-1 text-sm text-muted-foreground">Furnished and ready for move-in</p>
              </div>
              <Button variant="ghost" asChild className="gap-1 text-sm">
                <Link to="/listings">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-10">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold">Ready to take back control?</h2>
          <p className="mt-3 max-w-lg mx-auto text-muted-foreground">
            Start free. Unlimited properties. Cancel anytime. Keep everything.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
              <Link to="/get-started">Start free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-xl text-base">
              <Link to="/pricing">Compare plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2.5"><BrandLogo size="sm" /></Link>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The anti-trap rental platform. Software first. Your data, your money, your tenants.
              </p>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link to="/for-landlords" className="hover:text-foreground transition-colors">For Landlords</Link></li>
                <li><Link to="/listings" className="hover:text-foreground transition-colors">Listings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} ecrenta. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
