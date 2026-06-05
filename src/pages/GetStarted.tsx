import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle2, Shield, Star, Loader2 } from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "full", label: "Find a tenant & full management", description: "We handle everything — placement, rent collection, maintenance, and more." },
  { value: "management", label: "Ongoing management (current tenant in place)", description: "You already have a tenant. We take over management." },
  { value: "placement", label: "Find a tenant only (self-manage afterward)", description: "We find and screen a tenant, then you take it from there." },
];

export default function GetStarted() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "California",
    zip: "",
    unit: "",
    fullName: "",
    email: "",
    phone: "",
    service: "full",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address || !form.city || !form.zip || !form.fullName || !form.email || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      // Store lead in contact_messages for now
      await supabase.from("contact_messages").insert({
        name: form.fullName,
        email: form.email,
        message: `[GET STARTED LEAD]\nService: ${form.service}\nAddress: ${form.address}, ${form.city}, ${form.state} ${form.zip}\nUnit: ${form.unit || "N/A"}\nPhone: ${form.phone}`,
      });
      toast.success("We received your property! Our team will reach out within 24 hours.");
      if (user) {
        navigate("/dashboard?onboarding=started");
      } else {
        navigate("/auth?redirect=/dashboard&onboarding=started");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Get Started — Property Management from $99/mo | myrental"
        description="Submit your property address and get immediate access to professional property management. No commitment guarantee. Flat monthly fee, no commissions."
      />

      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Value prop */}
          <div className="flex flex-col justify-center">
            <h1 className="font-[var(--font-heading)] text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Finally, a property manager that works{" "}
              <em className="not-italic text-primary">for you.</em>
            </h1>
            <p className="mt-4 text-lg font-semibold text-primary">
              Flat monthly fee, no commissions, and no hidden costs. Hassle free.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Kick back and relax, we've got it from here. Within 24 hours your personal property
              concierge will be in touch to get the ball rolling.{" "}
              <strong className="text-foreground">No commitment guarantee!</strong>
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                { icon: Star, text: "5-Star Reviews" },
                { icon: Shield, text: "No Commitment" },
                { icon: CheckCircle2, text: "Fresno County" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium">
                  <b.icon className="h-4 w-4 text-primary" />
                  {b.text}
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth" className="text-primary font-semibold hover:underline">Log In</Link>
            </p>
          </div>

          {/* Right — Lead capture form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="address">Street Address <span className="text-destructive">*</span></Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={form.state} onValueChange={(v) => update("state", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="California">California</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                  <Input
                    id="city"
                    placeholder="Fresno"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zip">Zip <span className="text-destructive">*</span></Label>
                  <Input
                    id="zip"
                    placeholder="93711"
                    value={form.zip}
                    onChange={(e) => update("zip", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="unit">Unit # (optional)</Label>
                <Input
                  id="unit"
                  placeholder="Apt 2B"
                  value={form.unit}
                  onChange={(e) => update("unit", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="fullName"
                  placeholder="John Smith"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(559) 555-0100"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="mb-3 block">Select the service you need <span className="text-destructive">*</span></Label>
                <RadioGroup
                  value={form.service}
                  onValueChange={(v) => update("service", v)}
                  className="space-y-3"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                        form.service === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="mt-0.5" />
                      <div>
                        <span className="font-medium text-sm">{opt.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2 rounded-xl py-6 text-base" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Below fold — How it works summary */}
        <div className="mt-20 text-center">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Full Service Property Management
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            We handle everything from tenant placement to monthly rent collection and maintenance — all for a flat fee. No percentage of rent, no hidden costs.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "1", title: "Submit Your Property", desc: "Enter your address above — takes 30 seconds." },
              { step: "2", title: "Your Concierge Team", desc: "We reach out within 24 hours to discuss your needs." },
              { step: "3", title: "Find the Perfect Tenant", desc: "Professional photos, showings, screening, and lease." },
              { step: "4", title: "We Handle the Rest", desc: "Rent collection, maintenance, and communication." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="font-[var(--font-heading)] text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="flex justify-center gap-4">
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} myrental. All rights reserved.</p>
      </footer>
    </div>
  );
}
