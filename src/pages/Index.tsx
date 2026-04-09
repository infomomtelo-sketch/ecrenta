import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Search, MapPin, Shield, Heart, MessageCircle,
  Sparkles, Building2, DollarSign, CheckCircle2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveMarkets } from "@/data/markets";

const howItWorks = [
  { step: "1", icon: Search, title: "Search", description: "Browse furnished rentals by city, budget, and move-in date." },
  { step: "2", icon: MessageCircle, title: "Connect", description: "Message landlords directly — no brokers, no commissions." },
  { step: "3", icon: CheckCircle2, title: "Move In", description: "Free screening, easy applications. Move in within days." },
];

const tenantPerks = [
  { icon: DollarSign, title: "No Commissions", description: "Zero fees to tenants. Ever." },
  { icon: Shield, title: "Free Screening", description: "Background checks at no cost to you." },
  { icon: Heart, title: "Furnished & Ready", description: "Move-in ready with furniture, WiFi, and utilities." },
  { icon: MapPin, title: "Central Valley", description: "Fresno, Clovis, Madera & more." },
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
        <title>ecrenta — Furnished Rentals in Fresno County, CA</title>
        <meta name="description" content="Find furnished rentals in Fresno, Clovis, and Central Valley. No commissions, free tenant screening. Perfect for traveling nurses and healthcare professionals." />
      </Helmet>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/listings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Browse Rentals</Link>
            <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/for-landlords" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">List Your Property</Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={role === "landlord" ? "/dashboard" : "/listings"}>
                    {role === "landlord" ? "Dashboard" : "My Rentals"}
                  </Link>
                </Button>
                {role === "landlord" && (
                  <Button size="sm" asChild className="gap-1.5">
                    <Link to="/p8"><Sparkles className="h-3.5 w-3.5" /> P8 AI</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — Search-focused, FF-style */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(152_55%_38%/0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-[var(--font-heading)] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl max-w-3xl">
              Find Furnished Rentals in{" "}
              <span className="text-primary">Central Valley</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              30+ day furnished housing for traveling nurses, healthcare professionals &amp; relocators.
              No commissions. Free screening.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex w-full max-w-lg items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-lg"
            >
              <div className="flex flex-1 items-center gap-2 pl-3">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="City, neighborhood, or zip code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </div>
              <Button type="submit" className="rounded-lg px-6">
                Search
              </Button>
            </form>

            {/* Quick city links */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {activeMarkets.slice(0, 4).map((m) => (
                <Link
                  key={m.slug}
                  to={`/listings?area=${m.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  {m.name}
                </Link>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" /> Free Screening
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-primary" /> No Commissions
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-primary" /> 30+ Day Stays
              </div>
            </div>

            {/* Powered by P8 AI badge */}
            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Powered by P8 AI
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
                Featured Rentals
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Furnished and ready for move-in</p>
            </div>
            <Button variant="ghost" asChild className="gap-1 text-sm">
              <Link to="/listings">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-[var(--font-heading)] text-center text-2xl font-bold sm:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
            Find your next furnished home in three simple steps
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-[var(--font-heading)] text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
              <Link to="/listings">
                Browse Rentals <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tenant Perks */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[var(--font-heading)] text-center text-2xl font-bold sm:text-3xl">
          Why Tenants Love ecrenta
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tenantPerks.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="font-[var(--font-heading)] font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Landlords — P8 AI Teaser */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">For Landlords</span>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
                List Your Property — Powered by P8 AI
              </h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Reach traveling healthcare workers looking for furnished housing. Plus, manage your properties with P8 —
                your AI assistant that handles inspections, legal notices, maintenance triage, and more.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 w-full max-w-lg">
                {[
                  { icon: Building2, text: "List properties" },
                  { icon: MessageCircle, text: "Chat with tenants" },
                  { icon: Star, text: "AI property manager" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-sm font-medium">
                    <f.icon className="h-4 w-4 text-primary shrink-0" />
                    {f.text}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
                <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
                  <Link to={user ? "/add-property" : "/auth"}>
                    List Your Property <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-xl text-base">
                  <Link to="/pricing">See Plans</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Starting at $9.99/mo · No commissions on rentals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[var(--font-heading)] text-center text-2xl font-bold sm:text-3xl">
          Available Markets
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
          Currently serving Fresno County and Central Valley, CA
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeMarkets.map((m) => (
            <Link
              key={m.slug}
              to={`/listings?area=${m.slug}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/30"
            >
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-sm">{m.name}, {m.state}</p>
                <p className="text-xs text-muted-foreground">{m.county} County</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <BrandLogo size="sm" />
              </Link>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Furnished rentals for traveling professionals. Powered by P8 AI.
              </p>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">For Tenants</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/listings" className="hover:text-foreground transition-colors">Browse Rentals</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">For Landlords</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/for-landlords" className="hover:text-foreground transition-colors">List Property</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/p8" className="hover:text-foreground transition-colors flex items-center gap-1"><Sparkles className="h-3 w-3" /> P8 AI</Link></li>
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
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ecrenta</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                <Sparkles className="h-3 w-3" /> Powered by P8 AI
              </span>
              <span className="text-xs text-muted-foreground">Fresno County, California</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
