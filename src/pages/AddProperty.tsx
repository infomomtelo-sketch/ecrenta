import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X, ImagePlus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useListings } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AddProperty() {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const { profile, role, subscribed } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [landlordName, setLandlordName] = useState("");

  useEffect(() => {
    if (profile?.display_name) setLandlordName(profile.display_name);
  }, [profile]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!price || Number(price) <= 0) e.price = "Valid price is required";
    if (!address.trim()) e.address = "Address is required";
    if (bedrooms === "" || Number(bedrooms) < 0) e.bedrooms = "Valid number required";
    if (!bathrooms || Number(bathrooms) < 1) e.bathrooms = "Valid number required";
    if (!sqft || Number(sqft) <= 0) e.sqft = "Valid sqft required";
    if (!description.trim()) e.description = "Description required";
    if (!landlordName.trim()) e.landlordName = "Name required";
    if (imageUrls.length === 0) e.images = "At least one image URL is required";
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
      setErrors((prev) => ({ ...prev, images: "Please enter a valid URL" }));
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please sign in", description: "You must be signed in to upload images.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("listing-images").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }
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
    if (!validate()) return;
    setSubmitting(true);

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

    toast({ title: "Property listed!", description: "Your new listing is now live." });
    setSubmitting(false);
    navigate("/listings");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-secondary">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Add New Property</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        <div className="space-y-1.5">
          <Label htmlFor="title">Property Title</Label>
          <Input id="title" placeholder="e.g. Modern Downtown Apartment" value={title} onChange={(e) => setTitle(e.target.value)} />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="price">Rent ($/mo)</Label>
            <Input id="price" type="number" placeholder="1850" value={price} onChange={(e) => setPrice(e.target.value)} />
            {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="245 W 14th St" value={address} onChange={(e) => setAddress(e.target.value)} />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="bedrooms">Beds</Label>
            <Input id="bedrooms" type="number" placeholder="2" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
            {errors.bedrooms && <p className="text-xs text-destructive">{errors.bedrooms}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bathrooms">Baths</Label>
            <Input id="bathrooms" type="number" placeholder="1" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
            {errors.bathrooms && <p className="text-xs text-destructive">{errors.bathrooms}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sqft">Sqft</Label>
            <Input id="sqft" type="number" placeholder="950" value={sqft} onChange={(e) => setSqft(e.target.value)} />
            {errors.sqft && <p className="text-xs text-destructive">{errors.sqft}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe the property..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="resize-none" />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="landlordName">Your Name</Label>
          <Input id="landlordName" placeholder="Alex Chen" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} />
          {errors.landlordName && <p className="text-xs text-destructive">{errors.landlordName}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Property Images</Label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
              <ImagePlus className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Photos"}
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Input placeholder="Or paste image URL..." value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }} />
            <Button type="button" variant="outline" size="icon" onClick={addImage} className="shrink-0"><Plus className="h-4 w-4" /></Button>
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

        <Button type="submit" disabled={submitting} className="w-full gap-2 rounded-xl py-6 text-base font-semibold" size="lg">
          <Upload className="h-5 w-5" />
          {submitting ? "Publishing..." : "Publish Listing"}
        </Button>
      </form>
    </div>
  );
}
