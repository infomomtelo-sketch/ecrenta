import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ArrowLeft, Upload, X, Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROOMS = ["Kitchen", "Living Room", "Master Bedroom", "Bedroom 2", "Bedroom 3", "Bathroom 1", "Bathroom 2", "Garage", "Patio/Yard", "Hallway", "Laundry", "Dining Room"];

export default function NewInspection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [address, setAddress] = useState("");
  const [type, setType] = useState("move_out");
  const [notes, setNotes] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) => prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]);
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
    if (!user || !address.trim() || photos.length === 0) {
      toast({ title: "Missing info", description: "Please fill address and upload at least 1 photo", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    try {
      // Upload photos to storage
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        const ext = photo.name.split(".").pop() || "jpg";
        const path = `inspections/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("listing-images").upload(path, photo);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }

      // Create inspection record
      const { data: inspection, error: insertErr } = await supabase
        .from("inspections")
        .insert({
          user_id: user.id,
          property_address: address.trim(),
          inspection_type: type,
          notes: notes.trim() || null,
          photos: uploadedUrls,
          status: "draft",
        } as any)
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Trigger AI analysis
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
        toast({ title: "Analysis started", description: "Photos uploaded. AI analysis may take a moment.", variant: "default" });
      } else {
        toast({ title: "Inspection complete!", description: "AI analysis is ready to view." });
      }

      navigate(`/inspections/${(inspection as any).id}`);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to create inspection", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">runp8</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/inspections"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-[var(--font-heading)] text-3xl font-bold mb-2">New Inspection</h1>
        <p className="text-muted-foreground mb-8">Upload property photos and let AI analyze the condition.</p>

        <div className="space-y-6">
          {/* Property Address */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Property Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Property Address *</Label>
                <Input id="address" placeholder="123 Main St, Fresno, CA 93710" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label>Inspection Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="move_out">Move-Out</SelectItem>
                    <SelectItem value="move_in">Move-In</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

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
            <CardHeader><CardTitle className="text-lg">Photos * (max 20)</CardTitle></CardHeader>
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
                placeholder="Any specific areas of concern, prior damage, or notes for the inspection..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Button className="w-full h-12 text-base" onClick={handleSubmit} disabled={submitting || !address.trim() || photos.length === 0}>
            {submitting ? (
              <><Loader2 className="h-5 w-5 animate-spin mr-2" />Uploading & Analyzing...</>
            ) : (
              <><Upload className="h-5 w-5 mr-2" />Run AI Inspection</>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
