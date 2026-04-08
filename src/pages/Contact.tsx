import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Save to database
      const id = crypto.randomUUID();
      const { error: dbError } = await supabase
        .from("contact_messages")
        .insert({ id, name, email, message });

      if (dbError) throw dbError;

      // Send confirmation email to user
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-confirmation",
          recipientEmail: email,
          idempotencyKey: `contact-confirm-${id}`,
          templateData: { name },
        },
      });

      // Trigger notification edge function
      await supabase.functions.invoke("contact-notify", {
        body: { name, email, message },
      });

      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact form error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly at support@ecrenta.space",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Contact Us" description="Get in touch with ecrenta. Questions about furnished rentals in Fresno County? We're here to help tenants and landlords." />
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-lg font-bold">ecrenta</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-[var(--font-heading)] text-3xl font-extrabold sm:text-4xl text-center">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          Have questions about ecrenta? We're here to help landlords and tenants in the Fresno County area.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <Mail className="mt-0.5 h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="font-[var(--font-heading)] font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">support@ecrenta.space</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <Phone className="mt-0.5 h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="font-[var(--font-heading)] font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">(559) 555-RENT</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <Clock className="mt-0.5 h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="font-[var(--font-heading)] font-semibold">Hours</h3>
                <p className="text-sm text-muted-foreground">Mon–Fri 8am–6pm PST</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={5} className="resize-none" required />
            </div>
            <Button type="submit" disabled={sending} className="w-full rounded-xl py-6">
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ecrenta. All rights reserved.
      </footer>
    </div>
  );
}
