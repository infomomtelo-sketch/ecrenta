import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, Camera, Loader2, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { INSPECTION_TEMPLATES, createChecklistFromTemplate, type ChecklistItem } from "@/lib/inspectionTemplates";

const ROOMS = ["Kitchen", "Living Room", "Master Bedroom", "Bedroom 2", "Bedroom 3", "Bathroom 1", "Bathroom 2", "Garage", "Patio/Yard", "Hallway", "Laundry", "Dining Room"];

export default function NewInspection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const [address, setAddress] = useState(searchParams.get("address") || "");
  const [type, setType] = useState("move_out");
  const [notes, setNotes] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Template & checklist
  const [templateId, setTemplateId] = useState<string>("none");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (templateId === "none") {
      setChecklist([]);
    } else {
      setChecklist(createChecklistFromTemplate(templateId));
    }
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

  const handleSubmit = async () => {
    if (!user || !address.trim()) {
      toast({ title: "Missing info", description: "Please fill in the property address", variant: "destructive" });
      return;
    }
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

      // Trigger AI analysis if photos uploaded
      if (uploadedUrls.length > 0) {
        const { error: fnErr } = await supabase.functions.invoke("analyze-inspection", {
          body: {
            inspectionId: (inspection as any).id,
            photos: uploadedUrls,
            propertyAddress: address.trim(),
            inspectionType: type,
            rooms: selectedRooms,
          },
        });

        if (fnErr) {
          toast({ title: "Analysis started", description: "Photos uploaded. AI analysis may take a moment." });
        } else {
          toast({ title: "Inspection complete!", description: "AI analysis is ready to view." });
        }
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

  // Group checklist by category
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">New Inspection</h1>
          <p className="text-muted-foreground mt-1">Upload photos, fill a checklist, or both — AI analyzes everything.</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/inspections"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Property Details */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Property Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Property Address *</Label>
              <Input id="address" placeholder="123 Main St, Fresno, CA 93710" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Inspection Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="move_out">Move-Out</SelectItem>
                    <SelectItem value="move_in">Move-In</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Checklist Template</Label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Checklist */}
        {checklist.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Inspection Checklist
                <Badge variant="secondary" className="text-xs">
                  {checklist.filter((c) => c.status !== "not_inspected").length}/{checklist.length} inspected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(checklistByCategory).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{category}</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {statusIcon(item.status)}
                            {item.item}
                          </span>
                          <div className="flex gap-1">
                            {(["pass", "fail", "na"] as const).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => updateChecklistItem(item.id, "status", item.status === s ? "not_inspected" : s)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  item.status === s
                                    ? s === "pass" ? "bg-primary text-primary-foreground"
                                      : s === "fail" ? "bg-destructive text-destructive-foreground"
                                      : "bg-muted text-muted-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-muted"
                                }`}
                              >
                                {s === "na" ? "N/A" : s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        {item.status === "fail" && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Notes about this issue..."
                              value={item.notes}
                              onChange={(e) => updateChecklistItem(item.id, "notes", e.target.value)}
                              className="text-xs h-8"
                            />
                            <Select
                              value={item.severity || "minor"}
                              onValueChange={(v) => updateChecklistItem(item.id, "severity", v)}
                            >
                              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
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
            </CardContent>
          </Card>
        )}

        {/* Room Selection */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Rooms to Inspect</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ROOMS.map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={() => toggleRoom(room)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
                    selectedRooms.includes(room)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Photos (max 20)</CardTitle></CardHeader>
          <CardContent>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
            >
              <Camera className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Click to upload or drag photos</p>
              <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG up to 10MB each</p>
            </button>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Additional Notes</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any specific areas of concern, prior damage, or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        <Button className="w-full h-12 text-base" onClick={handleSubmit} disabled={submitting || !address.trim()}>
          {submitting ? (
            <><Loader2 className="h-5 w-5 animate-spin mr-2" />Uploading & Analyzing...</>
          ) : (
            <><Upload className="h-5 w-5 mr-2" />{photos.length > 0 ? "Run AI Inspection" : "Save Inspection"}</>
          )}
        </Button>
      </div>
    </div>
  );
}
