import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Upload, X, Camera, Loader2, CheckCircle, XCircle, MinusCircle, MapPin, ClipboardList, ImageIcon, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { INSPECTION_TEMPLATES, createChecklistFromTemplate, type ChecklistItem } from "@/lib/inspectionTemplates";

const ROOMS = ["Kitchen", "Living Room", "Master Bedroom", "Bedroom 2", "Bedroom 3", "Bathroom 1", "Bathroom 2", "Garage", "Patio/Yard", "Hallway", "Laundry", "Dining Room"];

const STEPS = [
  { id: 1, label: "Property", icon: MapPin, description: "Enter property details" },
  { id: 2, label: "Checklist", icon: ClipboardList, description: "Select template & fill checklist" },
  { id: 3, label: "Photos", icon: ImageIcon, description: "Upload property photos" },
  { id: 4, label: "Review", icon: FileText, description: "Review & submit" },
];

export default function NewInspection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(searchParams.get("address") || "");
  const [type, setType] = useState("move_out");
  const [notes, setNotes] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [templateId, setTemplateId] = useState<string>("none");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (templateId === "none") setChecklist([]);
    else setChecklist(createChecklistFromTemplate(templateId));
  }, [templateId]);

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) => prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]);
  };

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: any) => {
    setChecklist((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (photos.length + newFiles.length > 20) {
      toast({ title: "Limit reached", description: "Maximum 20 photos per inspection", variant: "destructive" });
      return;
    }
    setPhotos((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const canProceed = () => {
    if (step === 1) return address.trim().length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    return photos.length > 0 || checklist.length > 0;
  };

  const handleSubmit = async () => {
    if (!user || !address.trim()) return;
    if (photos.length === 0 && checklist.length === 0) {
      toast({ title: "Missing info", description: "Upload photos or fill out a checklist", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    try {
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        const ext = photo.name.split(".").pop() || "jpg";
        const path = `inspections/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("listing-images").upload(path, photo);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }

      const { data: inspection, error: insertErr } = await supabase
        .from("inspections")
        .insert({
          user_id: user.id,
          property_address: address.trim(),
          inspection_type: type,
          notes: notes.trim() || null,
          photos: uploadedUrls,
          status: photos.length > 0 ? "draft" : "completed",
          template_type: templateId === "none" ? "custom" : templateId,
          checklist_data: checklist,
        } as any)
        .select()
        .single();

      if (insertErr) throw insertErr;

      if (uploadedUrls.length > 0) {
        await supabase.functions.invoke("analyze-inspection", {
          body: {
            inspectionId: (inspection as any).id,
            photos: uploadedUrls,
            propertyAddress: address.trim(),
            inspectionType: type,
            rooms: selectedRooms,
          },
        });
        toast({ title: "Inspection submitted!", description: "AI analysis is processing your photos." });
      } else {
        toast({ title: "Inspection saved", description: "Checklist inspection recorded." });
      }

      navigate(`/inspections/${(inspection as any).id}`);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to create inspection", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const checklistByCategory = checklist.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const statusIcon = (status: ChecklistItem["status"]) => {
    if (status === "pass") return <CheckCircle className="h-4 w-4 text-primary" />;
    if (status === "fail") return <XCircle className="h-4 w-4 text-destructive" />;
    if (status === "na") return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
    return <div className="h-4 w-4 rounded-full border-2 border-border" />;
  };

  const inspectedCount = checklist.filter((c) => c.status !== "not_inspected").length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" asChild>
            <Link to="/inspections"><ArrowLeft className="h-4 w-4 mr-1" />Back to Inspections</Link>
          </Button>
          <h1 className="font-[var(--font-heading)] text-3xl font-extrabold tracking-tight">New Inspection</h1>
          <p className="text-muted-foreground mt-1">Complete each step to create your inspection report.</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress bar behind */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={`relative flex flex-col items-center gap-1.5 z-10 ${s.id <= step ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                s.id < step
                  ? "bg-primary border-primary text-primary-foreground"
                  : s.id === step
                  ? "bg-background border-primary text-primary shadow-md shadow-primary/20"
                  : "bg-muted border-border text-muted-foreground"
              }`}>
                {s.id < step ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                s.id === step ? "text-primary" : s.id < step ? "text-foreground" : "text-muted-foreground"
              }`}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {/* Step 1: Property Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-[var(--font-heading)] text-xl font-bold mb-1">Property Details</h2>
              <p className="text-sm text-muted-foreground">Enter the property address and inspection type.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Property Address <span className="text-destructive">*</span></Label>
                <Input
                  id="address"
                  placeholder="123 Main St, Fresno, CA 93710"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Inspection Type <span className="text-destructive">*</span></Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="move_out">Move-Out</SelectItem>
                      <SelectItem value="move_in">Move-In</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Checklist Template</Label>
                  <Select value={templateId} onValueChange={setTemplateId}>
                    <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No template (photos only)</SelectItem>
                      {INSPECTION_TEMPLATES.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.icon} {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Rooms to Inspect</Label>
                <p className="text-xs text-muted-foreground mb-2">Select rooms for focused AI analysis</p>
                <div className="flex flex-wrap gap-2">
                  {ROOMS.map((room) => (
                    <button
                      key={room}
                      type="button"
                      onClick={() => toggleRoom(room)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium border transition-all duration-200 ${
                        selectedRooms.includes(room)
                          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                          : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Checklist */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-[var(--font-heading)] text-xl font-bold mb-1">Inspection Checklist</h2>
                <p className="text-sm text-muted-foreground">
                  {checklist.length === 0
                    ? "Select a template in Step 1 to use a checklist, or skip to photos."
                    : "Go through each item and mark pass, fail, or N/A."}
                </p>
              </div>
              {checklist.length > 0 && (
                <div className="text-right shrink-0">
                  <div className="text-2xl font-[var(--font-heading)] font-bold text-primary">{inspectedCount}/{checklist.length}</div>
                  <div className="text-xs text-muted-foreground">inspected</div>
                </div>
              )}
            </div>

            {checklist.length === 0 ? (
              <div className="text-center py-12 rounded-xl border-2 border-dashed border-border">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">No checklist template selected</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Go back to Step 1 to choose a template, or continue to upload photos.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(inspectedCount / checklist.length) * 100}%` }}
                  />
                </div>

                {Object.entries(checklistByCategory).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pb-2 border-b border-border">{category}</h4>
                    <div className="space-y-1.5">
                      {items.map((item) => (
                        <div key={item.id} className={`rounded-xl border p-3 transition-all duration-200 ${
                          item.status === "fail" ? "border-destructive/30 bg-destructive/5" :
                          item.status === "pass" ? "border-primary/20 bg-primary/5" :
                          "border-border bg-card hover:bg-muted/30"
                        }`}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium flex items-center gap-2.5 min-w-0">
                              {statusIcon(item.status)}
                              <span className="truncate">{item.item}</span>
                            </span>
                            <div className="flex gap-1 shrink-0">
                              {(["pass", "fail", "na"] as const).map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => updateChecklistItem(item.id, "status", item.status === s ? "not_inspected" : s)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    item.status === s
                                      ? s === "pass" ? "bg-primary text-primary-foreground shadow-sm"
                                        : s === "fail" ? "bg-destructive text-destructive-foreground shadow-sm"
                                        : "bg-muted-foreground text-background shadow-sm"
                                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  {s === "na" ? "N/A" : s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                          {item.status === "fail" && (
                            <div className="flex gap-2 mt-2.5 pl-6">
                              <Input
                                placeholder="Describe the issue..."
                                value={item.notes}
                                onChange={(e) => updateChecklistItem(item.id, "notes", e.target.value)}
                                className="text-xs h-9"
                              />
                              <Select
                                value={item.severity || "minor"}
                                onValueChange={(v) => updateChecklistItem(item.id, "severity", v)}
                              >
                                <SelectTrigger className="w-28 h-9 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="minor">Minor</SelectItem>
                                  <SelectItem value="moderate">Moderate</SelectItem>
                                  <SelectItem value="major">Major</SelectItem>
                                  <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-[var(--font-heading)] text-xl font-bold mb-1">Property Photos</h2>
              <p className="text-sm text-muted-foreground">Upload up to 20 photos. Our AI will analyze condition, damages, and estimate repair costs.</p>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border shadow-sm">
                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 bg-foreground/70 text-background text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/40 hover:bg-primary/3 transition-all duration-300 group"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 mb-3 group-hover:bg-primary/15 transition-colors">
                <Camera className="h-7 w-7 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-semibold text-foreground">Click to upload or drag photos here</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB each · {photos.length}/20 uploaded</p>
            </button>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-[var(--font-heading)] text-xl font-bold mb-1">Review & Submit</h2>
              <p className="text-sm text-muted-foreground">Double-check everything before submitting.</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Address", value: address || "—", icon: MapPin },
                { label: "Type", value: type.replace("_", "-"), icon: ClipboardList },
                { label: "Photos", value: `${photos.length} uploaded`, icon: ImageIcon },
                { label: "Checklist", value: checklist.length > 0 ? `${inspectedCount}/${checklist.length}` : "None", icon: FileText },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-border bg-muted/30 p-3.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="text-sm font-semibold truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Photo preview */}
            {previews.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Photos</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {previews.slice(0, 8).map((src, i) => (
                    <div key={i} className="h-16 w-16 rounded-lg overflow-hidden border border-border shrink-0">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {previews.length > 8 && (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xs text-muted-foreground font-medium">
                      +{previews.length - 8}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <Label className="text-sm font-medium">Additional Notes (optional)</Label>
              <Textarea
                placeholder="Any specific areas of concern, prior damage, or notes for the AI..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1.5"
              />
            </div>

            {/* AI notice */}
            {photos.length > 0 && (
              <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Analysis Included</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Our AI will analyze {photos.length} photo{photos.length !== 1 ? "s" : ""} and generate a detailed report with condition scores, repair estimates, and recommended actions. Usually takes 30–60 seconds.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />Back
        </Button>

        {step < 4 ? (
          <Button
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={!canProceed()}
            className="gap-1.5 shadow-sm"
          >
            Continue<ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || (!photos.length && !checklist.length)}
            className="gap-2 shadow-lg shadow-primary/20 px-8"
          >
            {submitting ? (
              <><Loader2 className="h-5 w-5 animate-spin" />Submitting...</>
            ) : (
              <><Upload className="h-5 w-5" />{photos.length > 0 ? "Run AI Inspection" : "Save Inspection"}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
