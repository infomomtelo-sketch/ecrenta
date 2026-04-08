import { useParams, Link, Navigate } from "react-router-dom";
import { getMarketBySlug, getActiveMarkets } from "@/data/markets";
import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, MapPin, Building2, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";

export default function MarketLanding() {
  const { slug } = useParams<{ slug: string }>();
  const market = getMarketBySlug(slug || "");
  const { listings } = useListings();
  const activeMarkets = getActiveMarkets().filter(m => m.slug !== slug);

  if (!market || !market.active) return <Navigate to="/listings" replace />;

  const marketListings = listings.filter(
    l => l.available && l.address.toLowerCase().includes(market.name.toLowerCase())
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `ecrenta – Furnished Rentals in ${market.name}, ${market.state}`,
    "description": `Affordable furnished mid-term rentals in ${market.name}, ${market.county} County, ${market.state}. Built for traveling nurses & healthcare professionals.`,
    "url": `https://ecrenta.space/rentals/${market.slug}`,
    "areaServed": {
      "@type": "City",
      "name": market.name,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": `${market.county} County, ${market.state}`,
      },
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": market.name,
      "addressRegion": market.state,
      "addressCountry": "US",
    },
    "priceRange": "$$",
    "image": "https://ecrenta.space/og-image.png",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`Furnished Rentals in ${market.name}, CA – Mid-Term Housing`}
        description={`Browse affordable furnished rentals in ${market.name}, ${market.county} County. Perfect for traveling nurses. No commissions, free screening.`}
        canonical={`https://ecrenta.space/rentals/${market.slug}`}
        jsonLd={jsonLd}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-heading">ecrenta</span>
          </Link>
          <div className="flex-1" />
          <UserMenu />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <MapPin className="h-4 w-4" />
            {market.county} County, {market.state}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Furnished Rentals in {market.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {market.description} Find affordable mid-term housing — no commissions, free tenant screening.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to={`/listings?area=${market.slug}`}>
                Browse {market.name} Listings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/for-landlords">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hospitals */}
      {market.hospitals && market.hospitals.length > 0 && (
        <section className="py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              Nearby Hospitals & Medical Centers
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {market.hospitals.map(h => (
                <div key={h} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold font-heading mb-6">
            Available Rentals in {market.name}
          </h2>
          {marketListings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {marketListings.map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground mb-4">No listings in {market.name} yet. Check back soon!</p>
              <Button asChild variant="outline">
                <Link to="/listings">Browse All Listings</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Other Markets */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold font-heading mb-6">Explore Other Areas</h2>
          <div className="flex flex-wrap gap-3">
            {activeMarkets.map(m => (
              <Link
                key={m.slug}
                to={`/rentals/${m.slug}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold font-heading mb-3">Own property in {market.name}?</h2>
        <p className="text-muted-foreground mb-6">List your furnished rental — plans start at $9.99/mo.</p>
        <Button asChild size="lg">
          <Link to="/pricing">View Landlord Plans</Link>
        </Button>
      </section>
    </div>
  );
}
