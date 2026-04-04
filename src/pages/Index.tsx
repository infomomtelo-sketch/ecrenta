import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, MessageCircle, Shield, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Search,
    title: "Browse Listings",
    description: "Explore hundreds of rental properties with detailed photos and info.",
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging",
    description: "Chat with landlords instantly — schedule showings and ask questions.",
  },
  {
    icon: Shield,
    title: "Verified Landlords",
    description: "Every listing is tied to a verified account for your peace of mind.",
  },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight">
              runp8
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/listings">Browse</Link>
            </Button>
            {user ? (
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:pt-28">
          <h1 className="font-[var(--font-heading)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Next Home,
            <br />
            <span className="text-primary">Without the Hassle</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            The modern rental marketplace connecting tenants with landlords.
            Browse, message, and move&nbsp;in&nbsp;— all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/listings">
                Browse Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {!user && (
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/auth">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="font-[var(--font-heading)] text-center text-2xl font-bold sm:text-3xl">
          How It Works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-[var(--font-heading)] text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Whether you're looking for a place or listing one, runp8 makes the process simple.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to={user ? "/add-property" : "/auth"}>
                List a Property
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/listings">Explore Rentals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} runp8. All rights reserved.
      </footer>
    </div>
  );
}
