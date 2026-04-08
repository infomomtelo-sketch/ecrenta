import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-lg font-bold">EC Rental Property Management LLC</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-[var(--font-heading)] text-3xl font-extrabold sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>By using EC Rental Property Management LLC, you agree to these Terms of Service. If you do not agree, do not use the platform. We may update these terms at any time, and continued use constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">2. User Accounts</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account. Both tenants and landlords must be at least 18 years old.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">3. Landlord Subscriptions</h2>
            <p>Landlords must maintain an active subscription ($9.99/month or $99/year) to list properties. Subscriptions auto-renew unless cancelled. Cancellation takes effect at the end of the billing period. Active listings will be hidden upon subscription expiration.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">4. Listing Requirements</h2>
            <p>All listings must be for furnished, mid-term (30+ day) rentals located within Fresno County, California. Listings must be accurate, include real photos, and comply with all local housing regulations including Fair Housing laws.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">5. Tenant Screening</h2>
            <p>EC Rental Property Management LLC provides free basic tenant screening. Results are advisory only — landlords make their own rental decisions. EC Rental Property Management LLC is not responsible for the accuracy of screening results or rental decisions made based on them.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">6. Prohibited Conduct</h2>
            <p>Users may not: post fraudulent listings, discriminate against protected classes, harass other users, use the platform for short-term (under 30 day) rentals, or attempt to circumvent the subscription system.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
            <p>EC Rental Property Management LLC is a marketplace platform. We do not guarantee the quality of listings, the reliability of users, or the outcome of any rental arrangement. We are not a party to any lease agreement between landlords and tenants.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">8. Contact</h2>
            <p>Questions about these terms? Contact <a href="mailto:legal@ecrenta.space" className="text-primary hover:underline">legal@ecrenta.space</a></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ecrenta. All rights reserved.
      </footer>
    </div>
  );
}
