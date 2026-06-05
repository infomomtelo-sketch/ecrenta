import { BrandLogo } from "@/components/BrandLogo";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Upload, AlertTriangle, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { value: "plumbing", label: "🔧 Plumbing (leaks, clogs, water)" },
  { value: "electrical", label: "⚡ Electrical (outlets, lights, wiring)" },
  { value: "hvac", label: "🌡️ HVAC (heating, cooling, ventilation)" },
  { value: "appliance", label: "🍳 Appliance (fridge, stove, washer)" },
  { value: "structural", label: "🏗️ Structural (walls, floors, roof)" },
  { value: "pest", label: "🐛 Pest Control" },
  { value: "cosmetic", label: "🎨 Cosmetic (paint, scratches)" },
  { value: "safety", label: "🚨 Safety Hazard" },
  { value: "general", label: "📋 General / Other" },
];

const URGENCY = [
  { value: "emergency", label: "🚨 Emergency — Immediate danger or major damage" },
  { value: "urgent", label: "⚠️ Urgent — Needs attention within 24 hours" },
  { value: "normal", label: "📋 Normal — Can wait a few days" },
  { value: "low", label: "📝 Low — Minor issue, no rush" },
];

export default function RepairRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const [form, setForm] = useState({
    property_address: "",
    reporter_name: "",
    reporter_email: "",
    reporter_phone: "",
    reporter_role: "tenant",
    category: "general",
    urgency: "normal",
    title: "",
    description: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files) return;
    const newPhotos = [...photos];
    const newUrls = [...photoUrls];

    for (const file of Array.from(files).slice(0, 5 - photos.length)) {
      newPhotos.push(file);
      newUrls.push(URL.createObjectURL(file));
    }
    setPhotos(newPhotos);
    setPhotoUrls(newUrls);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    setPhotoUrls(photoUrls.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.property_address || !form.reporter_name || !form.title || !form.description) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Upload photos to storage
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        const fileName = `repairs/${Date.now()}-${Math.random().toString(36).slice(2)}-${photo.name}`;
        const { error: uploadErr } = await supabase.storage.from("listing-images").upload(fileName, photo);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(fileName);
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      // Insert the request
      const { data, error } = await supabase
        .from("maintenance_requests")
        .insert({
          ...form,
          photos: uploadedUrls,
        } as any)
        .select("id")
        .single();

      if (error) throw error;

      setRequestId(data.id);
      setSubmitted(true);
      setAiProcessing(true);

      // Trigger P8 AI triage
      const { data: triageData, error: triageErr } = await supabase.functions.invoke("triage-repair", {
        body: { requestId: data.id },
      });

      if (triageErr) {
        console.error("AI triage error:", triageErr);
        setAiResponse("P8 received your request and will process it shortly. Our team has been notified.");
      } else {
        setAiResponse(triageData?.triage?.ai_response || "P8 has analyzed your request. Our team will follow up soon.");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit request", variant: "destructive" });
    } finally {
      setSubmitting(false);
      setAiProcessing(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet><title>Request Submitted | myrental</title></Helmet>
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <BrandLogo size="sm" />
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-primary/30 shadow-lg">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <CheckCircle2 className="h-8 w-8" />
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Request Submitted!</h2>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Request ID</p>
                <p className="font-mono text-sm font-medium text-foreground">{requestId}</p>
              </div>

              {aiProcessing ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p>P8 is analyzing your request...</p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">P8</span>
                    </div>
                    <h3 className="font-semibold text-foreground">P8 AI Response</h3>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3 pt-4">
                <Button onClick={() => navigate(`/maintenance/${requestId}`)} className="flex-1">
                  View Full Details
                </Button>
                <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ property_address: "", reporter_name: "", reporter_email: "", reporter_phone: "", reporter_role: "tenant", category: "general", urgency: "normal", title: "", description: "" }); setPhotos([]); setPhotoUrls([]); }}>
                  Submit Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Report a Repair | myrental</title>
        <meta name="description" content="Submit a maintenance or repair request for your rental property. P8 AI will triage and respond instantly." />
      </Helmet>

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo size="sm" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Wrench className="h-4 w-4" />
            AI-Powered Maintenance
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Report a Repair
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Submit your maintenance request and <strong>P8</strong> will instantly analyze, categorize, and provide guidance.
          </p>
        </div>

        {/* Emergency Banner */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            <strong>Emergency?</strong> For gas leaks, flooding, fire, or immediate danger, call <a href="tel:5598253038" className="underline font-semibold">559-825-3038</a> now.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reporter Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={form.reporter_name} onChange={(e) => setForm({ ...form, reporter_name: e.target.value })} placeholder="Your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={form.reporter_role} onValueChange={(v) => setForm({ ...form, reporter_role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="landlord">Landlord / Owner</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.reporter_email} onChange={(e) => setForm({ ...form, reporter_email: e.target.value })} placeholder="you@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={form.reporter_phone} onChange={(e) => setForm({ ...form, reporter_phone: e.target.value })} placeholder="(559) 825-3038" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property & Issue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Property & Issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Property Address *</Label>
                <Input id="address" value={form.property_address} onChange={(e) => setForm({ ...form, property_address: e.target.value })} placeholder="123 Main St, Fresno, CA" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {URGENCY.map((u) => (
                        <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Kitchen faucet leaking" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description *</Label>
                <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail. When did it start? How severe is it?" rows={4} required />
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>Photos (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload up to 5 photos to help P8 assess the issue accurately.</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {photoUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handlePhotoUpload(e.target.files)} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full text-lg py-6" disabled={submitting}>
            {submitting ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting to P8...</>
            ) : (
              <><Wrench className="h-5 w-5 mr-2" /> Submit Repair Request</>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
