import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MessageCircle, Shield, Heart, Star, MapPin, ArrowRight, Check, Stethoscope, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Search,
    title: "Find Furnished Rentals",
    description: "Browse verified, fully-furnished properties across Fresno County — ready for move-in.",
  },
  {
    icon: MessageCircle,
    title: "Message Landlords Directly",
    description: "No middlemen. Chat with property owners, schedule tours, and sign leases in one place.",
  },
  {
    icon: Shield,
    title: "Free Tenant Screening",
    description: "Background and credit checks at no cost to tenants — a runp8 exclusive.",
  },
  {
    icon: Heart,
    title: "Built for Travel Professionals",
    description: "Designed for traveling nurses, therapists, and contract workers relocating to the Central Valley.",
  },
];

const stats = [
  { value: "500+", label: "Furnished Properties" },
  { value: "Free", label: "Tenant Screening" },
  { value: "$9.99", label: "Landlord Plans Start At" },
  { value: "30+", label: "Day Minimum Stays" },
];

const howItWorks = [
  { step: "1", title: "Create Your Profile", description: "Sign up free as a tenant or start a landlord subscription." },
  { step: "2", title: "Browse or List", description: "Search furnished rentals in Fresno County or list your property." },
  { step: "3", title: "Connect & Move In", description: "Message directly, get screened for free, and secure your housing." },
];

export default function Index() {
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
              runp8
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/listings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Browse Rentals</Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/inspections" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Inspections</Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/listings">Browse</Link>
            </Button>
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
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(152_55%_38%/0.06),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pt-24">
          <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Stethoscope className="h-4 w-4" />
                Built for Traveling Healthcare Professionals
              </div>
              <h1 className="font-[var(--font-heading)] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Furnished Rentals in
                <span className="text-primary"> Fresno County</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground lg:mx-0">
                The affordable mid-term housing marketplace for traveling nurses, therapists, 
                and professionals relocating to California's Central Valley. 30+ day furnished stays, 
                no commissions.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Button size="lg" asChild className="w-full sm:w-auto gap-2 text-base px-8 py-6 rounded-xl">
                  <Link to="/listings">
                    Find Housing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-8 py-6 rounded-xl">
                  <Link to="/pricing">List Your Property</Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" /> Free for tenants
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" /> No commissions
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" /> Free screening
                </div>
              </div>
            </div>
            {/* Hero visual */}
            <div className="mt-12 hidden lg:block lg:mt-0">
              <div className="relative">
                <div className="h-80 w-80 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[22px] bg-card">
                    <Building className="h-16 w-16 text-primary/40" />
                    <p className="text-sm font-medium text-muted-foreground">Fresno County Rentals</p>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Furnished</span>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">30+ Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-[var(--font-heading)] text-2xl font-bold text-primary sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Why Choose runp8?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            A better alternative for mid-term furnished housing — designed for healthcare travelers, priced for everyone.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-[var(--font-heading)] text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-[var(--font-heading)] text-center text-3xl font-bold sm:text-4xl">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-[var(--font-heading)] text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-[var(--font-heading)] text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-[var(--font-heading)] text-center text-3xl font-bold sm:text-4xl">
          runp8 vs. The Competition
        </h2>
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-primary">runp8</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Landlord Annual Fee", "$99/yr", "$199/yr"],
                ["Tenant Access", "Free", "Free"],
                ["Tenant Screening", "Free", "$44.99"],
                ["Commission Fees", "None", "None–10%"],
                ["Fresno County Focus", "✓", "Limited"],
                ["Direct Messaging", "✓", "✓"],
                ["Monthly Plan Option", "$9.99/mo", "N/A"],
              ].map(([feature, us, them]) => (
                <tr key={feature} className="bg-card">
                  <td className="px-4 py-3 font-medium">{feature}</td>
                  <td className="px-4 py-3 text-center font-semibold text-primary">{us}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <Users className="mx-auto h-12 w-12 text-primary/60 mb-4" />
          <h2 className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl">
            Join Fresno's Housing Network
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Whether you're a traveling nurse searching for your next assignment housing or a landlord 
            with furnished units — runp8 connects you affordably.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 px-8 py-6 rounded-xl text-base">
              <Link to={user ? "/add-property" : "/pricing"}>
                List a Property
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-xl text-base">
              <Link to="/listings">Browse Furnished Rentals</Link>
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
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-[var(--font-heading)] text-lg font-bold">runp8</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Affordable furnished rentals in Fresno County for traveling healthcare professionals.
              </p>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">For Tenants</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/listings" className="hover:text-foreground transition-colors">Browse Rentals</Link></li>
                <li><Link to="/auth" className="hover:text-foreground transition-colors">Create Account</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">For Landlords</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/auth" className="hover:text-foreground transition-colors">List Property</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} runp8. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Fresno County, California</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
