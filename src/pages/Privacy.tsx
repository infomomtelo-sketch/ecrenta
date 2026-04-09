import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo size="sm" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-[var(--font-heading)] text-3xl font-extrabold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect information you provide when creating an account, listing a property, or messaging other users. This includes your name, email address, phone number, and property details. We also automatically collect usage data such as IP address, browser type, and pages visited.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process transactions, communicate with you, verify your identity for tenant screening, and personalize your experience on the platform.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your data with landlords or tenants as part of the rental process, with service providers who help operate our platform, and when required by law.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">4. Tenant Screening Data</h2>
            <p>Screening information is handled with strict confidentiality. Results are only shared with the landlord for the specific property you apply to. Screening data is retained for 30 days and then permanently deleted.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">5. Data Security</h2>
            <p>We implement industry-standard security measures including encryption, secure data storage, and regular security audits to protect your information.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">6. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us. California residents have additional rights under the CCPA.</p>
          </section>

          <section>
            <h2 className="font-[var(--font-heading)] text-lg font-semibold text-foreground mb-2">7. Contact Us</h2>
            <p>For privacy questions, contact us at <a href="mailto:privacy@ecrenta.space" className="text-primary hover:underline">privacy@ecrenta.space</a></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ecrenta. All rights reserved.
      </footer>
    </div>
  );
}
