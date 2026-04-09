import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Search, MapPin, Shield, Heart, MessageCircle,
  Sparkles, Building2, DollarSign, CheckCircle2, Star,
  Camera, Home, Wrench, CreditCard, Users, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveMarkets } from "@/data/markets";

const stats = [
  { value: "2025", label: "Year Founded" },
  { value: "$99", label: "Flat Monthly Fee" },
  { value: "0%", label: "Commissions" },
  { value: "Free", label: "Tenant Screening" },
];

const services = [
  { icon: Camera, title: "Professional Photography", desc: "High-quality photos that get your property rented fast." },
  { icon: Users, title: "On-Demand Showings", desc: "We show your property to qualified tenants on your schedule." },
  { icon: Shield, title: "Instant Tenant Screening", desc: "Background, credit, and income verification — free for tenants." },
  { icon: CreditCard, title: "Online Rent Collection", desc: "Automatic monthly rent collection deposited to your account." },
  { icon: Wrench, title: "Maintenance Coordination", desc: "24/7 maintenance handling — we dispatch, you don't worry." },
  { icon: TrendingUp, title: "Monthly Statements", desc: "Transparent financials delivered to your inbox every month." },
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
        <title>ecrenta — Property Management Simplified | Fresno County</title>
        <meta name="description" content="Professional property management from $99/mo. Tenant placement for $499. Free tenant screening, no commissions. Serving Fresno, Clovis, and Central Valley." />
      </Helmet>

      {/* Nav — Ziprent-style */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/for-landlords" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Homeowners</Link>
            <Link to="/listings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Available Listings</Link>
            <Link to="/resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Resources</Link>
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
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/get-started">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — Ziprent-style */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(152_55%_38%/0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h1 className="font-[var(--font-heading)] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Property Management{" "}
                <span className="text-primary">Simplified</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                ecrenta utilizes the latest technology and excellent customer service. All for{" "}
                <strong className="text-foreground">$99 bucks a month</strong>.{" "}
                <strong className="text-foreground">Get started with a no commitment guarantee.</strong>
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
                  <Link to="/get-started">
                    Get started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-xl text-base">
                  <Link to="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Search for tenants */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h3 className="font-[var(--font-heading)] text-lg font-bold mb-4">
                Looking for a rental?
              </h3>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="City, neighborhood, or zip code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl">
                  Search Available Listings
                </Button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeMarkets.slice(0, 4).map((m) => (
                  <Link
                    key={m.slug}
                    to={`/listings?area=${m.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MapPin className="h-3 w-3" />
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Efficiency Through Automation */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Efficiency Through Automation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            At ecrenta, we aim to provide the most efficient property management experience for both
            tenants and homeowners. Through the perfect integration of technology and hands-on customer
            service, our platform provides the highest level of property monetization, maintenance, and
            utilization at the lowest cost possible.
          </p>
          <Button variant="outline" asChild className="mt-6 gap-2 rounded-xl">
            <Link to="/how-it-works">See How <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Transparency by the Numbers */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-[var(--font-heading)] text-center text-2xl font-bold sm:text-3xl">
            Transparency by the Numbers
          </h2>
          <p className="mx-auto mt-2 text-center text-muted-foreground">
            A live look at how we are doing
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-background p-6 text-center">
                <p className="font-[var(--font-heading)] text-3xl font-extrabold text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[var(--font-heading)] text-center text-2xl font-bold sm:text-3xl">
          Everything You Need, Under One Roof
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">
          From listing to lease to ongoing management — we handle it all.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-[var(--font-heading)] font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
                  Available Listings
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
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-10">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Ready to Simplify Your Landlording?
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-muted-foreground">
            Submit your property and get immediate access. No commitment, no credit card required.
            Your personal property concierge will reach out within 24 hours.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
              <Link to="/get-started">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-xl text-base">
              <Link to="/pricing">See Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Starting at $99/mo · No commissions · No percentages</p>
        </div>
      </section>

      {/* Markets */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-[var(--font-heading)] text-center text-2xl font-bold sm:text-3xl">
            Areas We Serve
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
            Currently serving Fresno County and Central Valley, CA
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeMarkets.map((m) => (
              <Link
                key={m.slug}
                to={`/listings?area=${m.slug}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/30"
              >
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{m.name}, {m.state}</p>
                  <p className="text-xs text-muted-foreground">{m.county} County</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <BrandLogo size="sm" />
              </Link>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Efficient Property Management with world class customer service.
              </p>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link to="/for-landlords" className="hover:text-foreground transition-colors">Services</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/listings" className="hover:text-foreground transition-colors">Available Listings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Information</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link></li>
                <li><Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} ecrenta. All rights reserved. Fresno County, California.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
