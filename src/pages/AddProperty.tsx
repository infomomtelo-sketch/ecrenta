import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useListings } from "@/contexts/ListingsContext";
import { useToast } from "@/hooks/use-toast";

export default function AddProperty() {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim() || title.length > 100) e.title = "Title is required (max 100 chars)";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = "Valid price is required";
    if (!address.trim() || address.length > 200) e.address = "Address is required (max 200 chars)";
    if (bedrooms === "" || isNaN(Number(bedrooms)) || Number(bedrooms) < 0) e.bedrooms = "Valid number required";
    if (!bathrooms || isNaN(Number(bathrooms)) || Number(bathrooms) < 1) e.bathrooms = "Valid number required";
    if (!sqft || isNaN(Number(sqft)) || Number(sqft) <= 0) e.sqft = "Valid sqft required";
    if (!description.trim() || description.length > 1000) e.description = "Description required (max 1000 chars)";
    if (!landlordName.trim() || landlordName.length > 100) e.landlordName = "Name required (max 100 chars)";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addListing({
      title: title.trim(),
      price: Number(price),
      address: address.trim(),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      description: description.trim(),
      images: imageUrls,
      landlordName: landlordName.trim(),
      available: true,
    });

    toast({
      title: "Property listed!",
      description: "Your new listing is now live.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Add New Property
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Property Title</Label>
          <Input id="title" placeholder="e.g. Modern Downtown Apartment" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        {/* Price & Address */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="price">Rent ($/mo)</Label>
            <Input id="price" type="number" placeholder="1850" value={price} onChange={(e) => setPrice(e.target.value)} min={0} />
            {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
          </div>
          <div className="col-span-2 space-y-1.5 sm:col-span-1">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="245 W 14th St, Apt 8B" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={200} />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>
        </div>

        {/* Bedrooms, Bathrooms, Sqft */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="bedrooms">Beds</Label>
            <Input id="bedrooms" type="number" placeholder="2" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} min={0} />
            {errors.bedrooms && <p className="text-xs text-destructive">{errors.bedrooms}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bathrooms">Baths</Label>
            <Input id="bathrooms" type="number" placeholder="1" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} min={1} />
            {errors.bathrooms && <p className="text-xs text-destructive">{errors.bathrooms}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sqft">Sqft</Label>
            <Input id="sqft" type="number" placeholder="950" value={sqft} onChange={(e) => setSqft(e.target.value)} min={1} />
            {errors.sqft && <p className="text-xs text-destructive">{errors.sqft}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe the property..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={1000} className="resize-none" />
          <div className="flex justify-between">
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            <p className="ml-auto text-xs text-muted-foreground">{description.length}/1000</p>
          </div>
        </div>

        {/* Landlord Name */}
        <div className="space-y-1.5">
          <Label htmlFor="landlordName">Your Name</Label>
          <Input id="landlordName" placeholder="Alex Chen" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} maxLength={100} />
          {errors.landlordName && <p className="text-xs text-destructive">{errors.landlordName}</p>}
        </div>

        {/* Images */}
        <div className="space-y-1.5">
          <Label>Property Images</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Paste image URL..."
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
            />
            <Button type="button" variant="outline" size="icon" onClick={addImage} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}

          {imageUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full gap-2 rounded-xl py-6 text-base font-semibold" size="lg">
          <Upload className="h-5 w-5" />
          Publish Listing
        </Button>
      </form>
    </div>
  );
}
