import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { ArrowLeft, Target, Search, Users, Building2, Mail, Share2, BarChart3, Calendar, Megaphone, MapPin } from "lucide-react";
import { getActiveMarkets, getComingSoonMarkets } from "@/data/markets";

const strategies = [
  {
    icon: Search,
    title: "SEO & Local Search",
    description: "Dominate \"furnished rentals Fresno\" and related keywords. Create city-specific landing pages, use schema markup, and build local backlinks.",
    tips: ["Target long-tail keywords like \"travel nurse housing near CRMC\"", "Add JSON-LD RealEstateListing schema to every listing", "Build Google Business Profile with weekly posts"],
  },
  {
    icon: Building2,
    title: "Hospital Partnerships",
    description: "Partner with local hospitals and staffing agencies. Become the recommended housing resource for travel nurses arriving in the Central Valley.",
    tips: ["Contact HR / Travel Nurse Coordinators directly", "Provide QR code flyers for break rooms", "Create custom landing pages per hospital"],
  },
  {
    icon: Users,
    title: "Social Media",
    description: "Facebook is where landlords and tenants already look for housing. Join local housing groups, post listings as helpful content, and build your following.",
    tips: ["Join 10+ local Fresno housing Facebook groups", "Post property tours as Instagram Reels and TikTok", "Use #TravelNurseHousing (3B+ TikTok views)"],
  },
  {
    icon: Megaphone,
    title: "Paid Advertising",
    description: "Start with $10-20/day on Google Ads targeting high-intent local keywords. Add Facebook Ads targeting healthcare workers within 200mi of Fresno.",
    tips: ["Separate campaigns for tenant acquisition vs. landlord acquisition", "Use negative keywords: buy, sale, unfurnished, daily", "Retarget website visitors who didn't sign up"],
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Build an email list with lead magnets and nurture sequences. Monthly newsletters with new listings, market stats, and local area guides.",
    tips: ["Lead magnet: \"Free Guide to Furnished Housing in Fresno\"", "5-email tenant welcome sequence", "4-email landlord onboarding sequence"],
  },
  {
    icon: Share2,
    title: "Referral Program",
    description: "Travel nurses talk to each other constantly. One happy tenant can bring 10 more. Build a referral engine with incentives.",
    tips: ["Tenant referral: $25 Amazon gift card for both parties", "Landlord referral: 1 month free subscription", "Hospital Champion Program with cards to hand out"],
  },
  {
    icon: Target,
    title: "Content Marketing",
    description: "Publish 2-4 blog posts per month targeting local search queries. Position EC Rental Property Management LLC as THE resource for Fresno furnished rentals.",
    tips: ["\"Complete Guide to Travel Nurse Housing in Fresno\"", "\"Top 10 Neighborhoods for Furnished Rentals\"", "\"How to Furnish Your Rental for Travel Nurses\""],
  },
  {
    icon: BarChart3,
    title: "Listing Syndication",
    description: "Cross-post listings on Craigslist, Facebook Marketplace, Zillow, and even FurnishedFinder — but funnel repeat tenants back to EC Rental Property Management LLC for free screening.",
    tips: ["Craigslist: free, post in Housing → Furnished", "Facebook Marketplace: huge local reach", "Zillow/Trulia: free for rentals, massive SEO authority"],
  },
];

export default function Resources() {
  const activeMarkets = getActiveMarkets();
  const comingSoon = getComingSoonMarkets();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/" className="text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="flex-1 text-lg font-bold text-foreground">Marketing Resources</h1>
        <UserMenu />
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-foreground">Grow Your Rental Business</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Proven strategies to get more visibility, attract quality tenants, and fill your furnished rentals faster in the Central Valley.
          </p>
        </section>

        {/* Markets */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Active Markets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activeMarkets.map(m => (
              <div key={m.slug} className="rounded-xl bg-card border border-border p-4 space-y-1">
                <p className="font-semibold text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.county} County, {m.state}</p>
                {m.hospitals && <p className="text-xs text-primary">{m.hospitals.length} hospital{m.hospitals.length > 1 ? "s" : ""}</p>}
              </div>
            ))}
          </div>
          {comingSoon.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-muted-foreground mt-6">Coming Soon</h4>
              <div className="flex flex-wrap gap-2">
                {comingSoon.map(m => (
                  <span key={m.slug} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {m.name}, {m.state}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Strategies */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">Lead Generation Strategies</h3>
          {strategies.map((s, i) => (
            <div key={i} className="rounded-xl bg-card border border-border p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">{s.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{s.description}</p>
              <ul className="space-y-1.5">
                {s.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* 90-day plan teaser */}
        <section className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center space-y-3">
          <Calendar className="h-8 w-8 text-primary mx-auto" />
          <h3 className="text-lg font-bold text-foreground">Want the Full 90-Day Launch Plan?</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Download our comprehensive Marketing & Lead Generation Playbook — 15 chapters covering SEO, partnerships, paid ads, email sequences, and a week-by-week launch checklist.
          </p>
          <p className="text-xs text-muted-foreground">Available as a free PDF for EC Rental Property Management LLC landlords.</p>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4 pb-8">
          <h3 className="text-xl font-bold text-foreground">Ready to List Your Property?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/add-property" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              List Your Property — $9.99/mo
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary/80">
              View Pricing
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
