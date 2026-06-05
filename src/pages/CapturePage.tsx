import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

export default function CapturePage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("capture_pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle()
      .then(({ data }) => {
        setPage(data);
        setLoading(false);
        // Increment view count (fire and forget)
        if (data) {
          (supabase.rpc as any)("increment_capture_view", { page_id: data.id }).then(() => {});
        }
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;
    setSubmitting(true);
    try {
      const { error } = await (supabase.from as any)("capture_leads").insert({
        capture_page_id: page.id,
        name: formData.name || "Anonymous",
        email: formData.email || null,
        phone: formData.phone || null,
        message: formData.message || null,
        source: "capture_page",
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Thanks! We'll be in touch soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground">This link may have expired or been removed.</p>
      </div>
    );
  }

  const fields: FormField[] = Array.isArray(page.form_fields) ? page.form_fields : [];

  return (
    <>
      <SEOHead title={`${page.title} — myrental`} description={page.description || "Get in touch"} />
      <div className="min-h-screen bg-background">
        {/* Simple header */}
        <header className="border-b border-border bg-card/95 backdrop-blur px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <BrandLogo size="md" />
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-10 space-y-8">
          {/* Cover image */}
          {page.cover_image && (
            <div className="rounded-xl overflow-hidden aspect-video">
              <img src={page.cover_image} alt={page.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Title & description */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground font-heading">{page.title}</h1>
            {page.description && (
              <p className="text-muted-foreground text-lg">{page.description}</p>
            )}
          </div>

          {/* Form or success */}
          {submitted ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Thank you!</h2>
              <p className="text-muted-foreground">We received your info and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Get in Touch</h2>
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name}>{field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, [field.name]: e.target.value }))}
                      placeholder={field.label}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, [field.name]: e.target.value }))}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit
              </Button>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
