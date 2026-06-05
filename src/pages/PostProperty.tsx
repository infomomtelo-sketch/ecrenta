import { BrandLogo } from "@/components/BrandLogo";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin, ArrowRight, Check, Upload, ImagePlus, X, Plus,
  Zap, Shield, DollarSign, Users, Rocket, Star, Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const perks = [
  { icon: Zap, label: "Live in seconds", desc: "Your listing goes live instantly across the marketplace" },
  { icon: Shield, label: "Free tenant screening", desc: "Background & credit checks included at no extra cost" },
  { icon: DollarSign, label: "Zero commissions", desc: "Keep 100% of your rental income — no hidden fees" },
  { icon: Users, label: "Reach healthcare pros", desc: "Connect with traveling nurses actively searching Fresno County" },
];

const socialProof = [
  { stat: "200+", label: "Properties Listed" },
  { stat: "48hr", label: "Avg. First Inquiry" },
  { stat: "0%", label: "Commission" },
  { stat: "Free", label: "Screening" },
];

export default function PostProperty() {
  const navigate = useNavigate();
  const { user, profile, role, subscribed } = useAuth();
  const { addListing } = useListings();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile?.display_name) setLandlordName(profile.display_name);
  }, [profile]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Required";
    if (!price || Number(price) <= 0) e.price = "Required";
    if (!address.trim()) e.address = "Required";
    if (!sqft || Number(sqft) <= 0) e.sqft = "Required";
    if (!description.trim()) e.description = "Required";
    if (!landlordName.trim()) e.landlordName = "Required";
    if (imageUrls.length === 0) e.images = "Add at least one photo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    try {
      new URL(url);
      setImageUrls((prev) => [...prev, url]);
      setImageInput("");
      setErrors((prev) => ({ ...prev, images: "" }));
    } catch {
      setErrors((prev) => ({ ...prev, images: "Invalid URL" }));
    }
  };

  const removeImage = (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      toast({ title: "Please sign in first", variant: "destructive" });
      return;
    }
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${authUser.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("listing-images").upload(path, file);
      if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); continue; }
      const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(path);
      newUrls.push(publicUrl);
    }
    if (newUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...newUrls]);
      setErrors((prev) => ({ ...prev, images: "" }));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Sign in to post", description: "Create an account to list your property.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    if (role === "landlord" && !subscribed) {
      toast({ title: "Subscription required", description: "Choose a plan to start listing.", variant: "destructive" });
      navigate("/pricing");
      return;
    }

    if (!validate()) return;
    setSubmitting(true);

    try {
      await addListing({
        title: title.trim(),
        price: Number(price),
        address: address.trim(),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        sqft: Number(sqft),
        description: description.trim(),
        images: imageUrls,
        landlord_name: landlordName.trim(),
        available: true,
      });

      toast({ title: "🎉 Property is live!", description: "Your listing is now visible to tenants on the marketplace." });
      navigate("/listings");
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-2">
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
                  <Link to="/pricing">Plans</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(152_55%_38%/0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-5">
              <Rocket className="h-4 w-4" />
              Post & Go Live Instantly
            </div>
            <h1 className="font-[var(--font-heading)] text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Post Your Property.
              <br />
              <span className="text-primary">Auto-List. Start Earning.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Fill out the form below and your property instantly goes live on the myrental marketplace — reaching 
              hundreds of traveling healthcare professionals in Fresno County.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={scrollToForm} className="gap-2 text-base px-10 py-7 rounded-xl shadow-lg">
                Post Your Property Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Instant listing</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No commissions</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free screening</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 text-center">
          {socialProof.map((s) => (
            <div key={s.label}>
              <p className="font-[var(--font-heading)] text-2xl font-bold text-primary sm:text-3xl">{s.stat}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
          Why Landlords Choose myrental
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.label} className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="font-[var(--font-heading)] font-semibold">{p.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className="scroll-mt-20 border-t border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Building className="h-4 w-4" />
              Quick Post
            </div>
            <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
              List Your Property in 60 Seconds
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in the details below and your listing auto-publishes to the marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-background p-5 sm:p-8">
            <div className="space-y-1.5">
              <Label htmlFor="pp-title">Property Title</Label>
              <Input id="pp-title" placeholder="e.g. Cozy Furnished Studio Near CMC" value={title} onChange={(e) => setTitle(e.target.value)} />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pp-price">Rent ($/mo)</Label>
                <Input id="pp-price" type="number" placeholder="1200" value={price} onChange={(e) => setPrice(e.target.value)} />
                {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pp-sqft">Sqft</Label>
                <Input id="pp-sqft" type="number" placeholder="800" value={sqft} onChange={(e) => setSqft(e.target.value)} />
                {errors.sqft && <p className="text-xs text-destructive">{errors.sqft}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pp-address">Address</Label>
              <Input id="pp-address" placeholder="123 Main St, Fresno, CA" value={address} onChange={(e) => setAddress(e.target.value)} />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pp-beds">Bedrooms</Label>
                <Input id="pp-beds" type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pp-baths">Bathrooms</Label>
                <Input id="pp-baths" type="number" min="1" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pp-desc">Description</Label>
              <Textarea id="pp-desc" placeholder="Describe your property — amenities, location highlights, what makes it great for traveling professionals..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="resize-none" />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pp-name">Your Name</Label>
              <Input id="pp-name" placeholder="Your name" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} />
              {errors.landlordName && <p className="text-xs text-destructive">{errors.landlordName}</p>}
            </div>

            {/* Images */}
            <div className="space-y-1.5">
              <Label>Property Photos</Label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2 flex-1">
                  <ImagePlus className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Photos"}
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Input placeholder="Or paste image URL..." value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} />
                <Button type="button" variant="outline" size="icon" onClick={addImage} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}
              {imageUrls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <X className="h-4 w-4 text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={submitting || uploading} className="w-full gap-2 rounded-xl py-6 text-base font-semibold" size="lg">
              <Upload className="h-5 w-5" />
              {submitting ? "Publishing..." : "Publish & Go Live"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By posting, you agree to our{" "}
              <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">Terms</Link> and{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>.
              {!user && (
                <span> Already have an account? <Link to="/auth" className="text-primary underline underline-offset-2">Sign in</Link>.</span>
              )}
            </p>
          </form>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-primary text-primary" />
            ))}
          </div>
          <blockquote className="text-lg italic text-foreground leading-relaxed">
            "I posted my spare room at 9pm and had a traveling nurse reach out by the next morning. 
            myrental made it incredibly easy."
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-muted-foreground">— Maria G., Clovis</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border bg-primary/5">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h2 className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Ready to Start Earning?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Join landlords across Fresno County who are filling vacancies faster with myrental.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={scrollToForm} className="gap-2 text-base px-10 py-7 rounded-xl">
              Post Your Property
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-10 py-7 rounded-xl">
              <Link to="/for-landlords">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} myrental · Powered by P8 AI</p>
      </footer>
    </div>
  );
}
