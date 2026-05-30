import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Globe, Loader2, Check, AlertTriangle, Layers } from "lucide-react";

interface ScrapedListing {
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  images: string[];
  landlord_name: string;
  source: string;
  source_url: string;
  screenshot?: string;
}

export default function ImportListing() {
  const { user } = useAuth();
  const { refreshListings } = useListings();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<ScrapedListing | null>(null);
  const [error, setError] = useState("");

  // Bulk import state
  const [bulkUrls, setBulkUrls] = useState("");
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number; ok: number; failed: number } | null>(null);
  const [bulkLog, setBulkLog] = useState<{ url: string; ok: boolean; message: string }[]>([]);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPreview(null);
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("scrape-listing", {
        body: { url: url.trim() },
      });

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error || "Failed to scrape listing");

      setPreview(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to scrape. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!preview || !user) return;
    setSaving(true);

    try {
      const { error: insertError } = await supabase.from("listings").insert({
        title: preview.title,
        price: preview.price,
        address: preview.address,
        bedrooms: preview.bedrooms,
        bathrooms: preview.bathrooms,
        sqft: preview.sqft,
        description: preview.description || "",
        images: preview.images.length > 0 ? preview.images : [],
        landlord_name: preview.landlord_name || "Imported Listing",
        available: true,
        user_id: user.id,
        source: preview.source,
        source_url: preview.source_url,
      } as any);

      if (insertError) throw insertError;

      await refreshListings();
      toast({ title: "Listing imported!", description: `"${preview.title}" has been added.` });
      navigate("/listings");
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkImport = async () => {
    if (!user) return;
    const urls = bulkUrls
      .split(/\s+/)
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\//i.test(u));
    if (urls.length === 0) {
      toast({ title: "No valid URLs found", description: "Paste one URL per line.", variant: "destructive" });
      return;
    }

    setBulkRunning(true);
    setBulkLog([]);
    setBulkProgress({ done: 0, total: urls.length, ok: 0, failed: 0 });

    let ok = 0;
    let failed = 0;
    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      try {
        const { data, error: fnError } = await supabase.functions.invoke("scrape-listing", { body: { url: u } });
        if (fnError) throw new Error(fnError.message);
        if (!data?.success) throw new Error(data?.error || "Scrape failed");
        const d = data.data as ScrapedListing;
        const { error: insertError } = await supabase.from("listings").insert({
          title: d.title,
          price: d.price,
          address: d.address,
          bedrooms: d.bedrooms,
          bathrooms: d.bathrooms,
          sqft: d.sqft,
          description: d.description || "",
          images: d.images?.length > 0 ? d.images : [],
          landlord_name: d.landlord_name || "Imported Listing",
          available: true,
          user_id: user.id,
          source: d.source,
          source_url: d.source_url,
        } as any);
        if (insertError) throw insertError;
        ok++;
        setBulkLog((l) => [...l, { url: u, ok: true, message: d.title }]);
      } catch (err: any) {
        failed++;
        setBulkLog((l) => [...l, { url: u, ok: false, message: err.message || "Failed" }]);
      }
      setBulkProgress({ done: i + 1, total: urls.length, ok, failed });
    }

    await refreshListings();
    setBulkRunning(false);
    toast({
      title: "Bulk import complete",
      description: `${ok} imported, ${failed} failed`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/listings" className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Import Listing</h1>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Compliance notice */}
        <div className="flex gap-3 rounded-lg bg-accent/10 p-3 text-sm text-muted-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0 text-accent" />
          <p>
            Imported listings include source attribution per fair use. Ensure you have rights to relist properties. Original source links are preserved.
          </p>
        </div>

        {/* URL input */}
        <form onSubmit={handleScrape} className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Paste a listing URL from any marketplace
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://zillow.com/..."
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" disabled={loading || !url.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Scrape"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports Zillow, Craigslist, Apartments.com, Realtor.com, Trulia, Redfin & more
          </p>
        </form>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        {/* Preview */}
        {preview && (
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">Preview</h2>

            {preview.screenshot && (
              <img
                src={`data:image/png;base64,${preview.screenshot}`}
                alt="Page screenshot"
                className="w-full rounded-md"
              />
            )}

            {preview.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {preview.images.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt="" className="h-20 w-28 shrink-0 rounded-md object-cover" />
                ))}
              </div>
            )}

            <div className="space-y-2 text-sm">
              <p className="text-lg font-bold text-foreground">{preview.title}</p>
              <p className="text-xl font-bold text-primary">${preview.price?.toLocaleString()}/mo</p>
              <p className="text-muted-foreground">{preview.address}</p>
              <div className="flex gap-4 text-muted-foreground">
                <span>{preview.bedrooms} bed</span>
                <span>{preview.bathrooms} bath</span>
                {preview.sqft > 0 && <span>{preview.sqft.toLocaleString()} sqft</span>}
              </div>
              {preview.description && (
                <p className="text-muted-foreground line-clamp-3">{preview.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Source: <span className="capitalize">{preview.source}</span> •{" "}
                <a href={preview.source_url} target="_blank" rel="noopener noreferrer" className="underline">
                  View original
                </a>
              </p>
            </div>

            <Button onClick={handleImport} disabled={saving} className="w-full">
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Import to ecrenta
            </Button>
          </div>
        )}

        {/* Bulk import */}
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Bulk Import</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste multiple URLs (one per line). Each will be scraped and added automatically.
          </p>
          <Textarea
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            placeholder={"https://zillow.com/listing1\nhttps://idealista.pt/listing2\nhttps://olx.pt/listing3"}
            className="min-h-[120px] font-mono text-xs"
            disabled={bulkRunning}
          />
          <Button onClick={handleBulkImport} disabled={bulkRunning || !bulkUrls.trim()} className="w-full">
            {bulkRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing {bulkProgress?.done}/{bulkProgress?.total}…
              </>
            ) : (
              <>
                <Layers className="mr-2 h-4 w-4" />
                Import all
              </>
            )}
          </Button>

          {bulkProgress && (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{bulkProgress.done} / {bulkProgress.total} processed</span>
                <span>
                  <span className="text-primary">{bulkProgress.ok} ok</span>
                  {bulkProgress.failed > 0 && <span className="text-destructive"> · {bulkProgress.failed} failed</span>}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {bulkLog.length > 0 && (
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md bg-muted/50 p-2 text-xs">
              {bulkLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-2">
                  {entry.ok ? (
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                  )}
                  <span className={entry.ok ? "text-foreground" : "text-destructive"}>{entry.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
