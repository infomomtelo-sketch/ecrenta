import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, ExternalLink, Sparkles, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListings, type Listing } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

const SITE_URL = "https://ecrenta.space";

type Platform = "facebook" | "instagram" | "craigslist" | "twitter" | "nextdoor";

interface PlatformConfig {
  id: Platform;
  name: string;
  emoji: string;
  postUrl: string;
  maxLength?: number;
  hint: string;
}

const PLATFORMS: PlatformConfig[] = [
  { id: "facebook", name: "Facebook Marketplace", emoji: "🏪", postUrl: "https://www.facebook.com/marketplace/create/rental", hint: "Paste in title + description fields" },
  { id: "instagram", name: "Instagram", emoji: "📸", postUrl: "https://www.instagram.com/", maxLength: 2200, hint: "Save image, then paste caption" },
  { id: "craigslist", name: "Craigslist", emoji: "📋", postUrl: "https://post.craigslist.org/", hint: "Use under housing → apts/housing for rent" },
  { id: "twitter", name: "X / Twitter", emoji: "𝕏", postUrl: "https://twitter.com/intent/tweet", maxLength: 280, hint: "Short punchy version with link" },
  { id: "nextdoor", name: "Nextdoor", emoji: "🏘️", postUrl: "https://nextdoor.com/news_feed/", hint: "Best for local neighborhood reach" },
];

function generateCaption(listing: Listing, platform: Platform): string {
  const url = `${SITE_URL}/listings/${listing.id}`;
  const price = `$${listing.price.toLocaleString()}/mo`;
  const stats = `${listing.bedrooms}BR · ${listing.bathrooms}BA · ${listing.sqft.toLocaleString()} sqft`;
  const tags = "#ForRent #Rental #Apartment #Housing";

  switch (platform) {
    case "facebook":
      return `🏠 FOR RENT — ${listing.title}\n\n📍 ${listing.address}\n💰 ${price}\n🛏️ ${stats}\n\n${listing.description}\n\n👉 Message to schedule a tour: ${url}`;

    case "instagram":
      return `✨ Just listed ✨\n\n${listing.title}\n📍 ${listing.address}\n💰 ${price} · ${stats}\n\n${listing.description.slice(0, 800)}\n\nDM to tour 🔑\nFull details → link in bio\n\n${tags} #${listing.address.split(",").pop()?.trim().replace(/\s+/g, "") || "Rental"}`;

    case "craigslist":
      return `${listing.title} — ${price}\n\nLocation: ${listing.address}\nBedrooms: ${listing.bedrooms}\nBathrooms: ${listing.bathrooms}\nSqft: ${listing.sqft}\n\n${listing.description}\n\nContact via: ${url}`;

    case "twitter": {
      const short = `🏠 ${price} · ${stats}\n📍 ${listing.address.split(",")[0]}\n${url}`;
      return short.length <= 280 ? short : short.slice(0, 277) + "...";
    }

    case "nextdoor":
      return `Hi neighbors! 👋 I have a rental available nearby:\n\n${listing.title}\n📍 ${listing.address}\n💰 ${price} · ${stats}\n\n${listing.description.slice(0, 500)}\n\nIf you know someone looking, please share! Details: ${url}`;

    default:
      return "";
  }
}

export default function ShareListing() {
  const { listings, loading } = useListings();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editedCaption, setEditedCaption] = useState<string>("");

  const myListings = useMemo(
    () => (user ? listings.filter((l) => l.user_id === user.id) : listings),
    [listings, user]
  );

  const selected = myListings.find((l) => l.id === selectedId) ?? myListings[0] ?? null;
  const activeId = selected?.id ?? null;

  const caption = useMemo(() => {
    if (!selected) return "";
    return generateCaption(selected, platform);
  }, [selected, platform]);

  const currentCaption = editedCaption || caption;
  const platformConfig = PLATFORMS.find((p) => p.id === platform)!;

  const copy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copied!", description: `${field} copied to clipboard.` });
    setTimeout(() => setCopiedField(null), 1500);
  };

  const downloadImage = async () => {
    if (!selected?.images?.[0]) {
      toast({ title: "No image", description: "This listing has no photos to download.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(selected.images[0]);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Download failed", description: "Try right-click → Save image instead.", variant: "destructive" });
    }
  };

  const listingUrl = selected ? `${SITE_URL}/listings/${selected.id}` : "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Share Listing — Multi-Channel Syndication" description="One-click share your rental to Facebook Marketplace, Instagram, Craigslist, Nextdoor, and X." />

      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/dashboard" className="rounded-full p-2 hover:bg-secondary">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Share Your Listing</h1>
          </div>
          <Badge variant="secondary" className="ml-2 gap-1">
            <Sparkles className="h-3 w-3" /> Auto-generated
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {loading ? (
          <p className="text-muted-foreground">Loading your listings...</p>
        ) : myListings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You don't have any listings yet.</p>
            <Button asChild><Link to="/add-property">Create your first listing</Link></Button>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Listing picker */}
            <aside className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">Your listings</h2>
              {myListings.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setSelectedId(l.id); setEditedCaption(""); }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${activeId === l.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"}`}
                >
                  {l.images?.[0] && <img src={l.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{l.title}</p>
                    <p className="text-xs text-muted-foreground">${l.price.toLocaleString()}/mo</p>
                  </div>
                </button>
              ))}
            </aside>

            {/* Generator */}
            {selected && (
              <main className="space-y-4">
                {/* Platform tabs */}
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPlatform(p.id); setEditedCaption(""); }}
                      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${platform === p.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
                    >
                      <span>{p.emoji}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">💡 {platformConfig.hint}</p>

                {/* Caption editor */}
                <Card className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Caption</h3>
                    <div className="flex items-center gap-2">
                      {platformConfig.maxLength && (
                        <span className={`text-xs ${currentCaption.length > platformConfig.maxLength ? "text-destructive" : "text-muted-foreground"}`}>
                          {currentCaption.length}/{platformConfig.maxLength}
                        </span>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setEditedCaption("")}>Reset</Button>
                      <Button size="sm" onClick={() => copy(currentCaption, "Caption")} className="gap-1.5">
                        {copiedField === "Caption" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={currentCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    rows={12}
                    className="resize-none font-mono text-sm"
                  />
                </Card>

                {/* Quick fields */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Card className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Listing link</p>
                        <p className="truncate text-sm font-mono">{listingUrl}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => copy(listingUrl, "Link")} className="shrink-0 gap-1.5">
                        {copiedField === "Link" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Cover image</p>
                        <p className="truncate text-sm">{selected.images?.[0] ? "Ready to download" : "No image"}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={downloadImage} disabled={!selected.images?.[0]} className="shrink-0 gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild size="lg" className="gap-2">
                    <a href={platformConfig.postUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open {platformConfig.name}
                    </a>
                  </Button>
                  {navigator.share && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2"
                      onClick={() => navigator.share({ title: selected.title, text: currentCaption, url: listingUrl }).catch(() => {})}
                    >
                      <Share2 className="h-4 w-4" /> Native share
                    </Button>
                  )}
                </div>

                {/* Image gallery */}
                {selected.images?.length > 0 && (
                  <Card className="p-4">
                    <h3 className="mb-3 text-sm font-semibold">All photos ({selected.images.length})</h3>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {selected.images.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden rounded-lg">
                          <img src={img} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                        </a>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Right-click any photo → Save image, then upload to the platform.</p>
                  </Card>
                )}
              </main>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
