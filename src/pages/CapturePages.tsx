import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { logActivity } from "@/lib/activityLogger";
import { Plus, Copy, ExternalLink, Eye, Users, Loader2, ArrowLeft } from "lucide-react";

export default function CapturePages() {
  const { user } = useAuth();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", page_type: "general" });

  const fetchPages = async () => {
    if (!user) return;
    const { data } = await (supabase.from as any)("capture_pages").select("*").order("created_at", { ascending: false });
    setPages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, [user]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

  const handleCreate = async () => {
    if (!user || !form.title || !form.slug) {
      toast.error("Title and slug are required");
      return;
    }
    setCreating(true);
    try {
      const { error } = await (supabase.from as any)("capture_pages").insert({
        user_id: user.id,
        title: form.title,
        slug: form.slug,
        description: form.description,
        page_type: form.page_type,
      });
      if (error) throw error;
      await logActivity("capture_page_created", `Created capture page "${form.title}"`, { entity_type: "capture_page" });
      toast.success("Capture page created!");
      setDialogOpen(false);
      setForm({ title: "", slug: "", description: "", page_type: "general" });
      fetchPages();
    } catch (err: any) {
      toast.error(err.message?.includes("duplicate") ? "That slug is already taken" : "Failed to create page");
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Capture Pages</h1>
          <p className="text-sm text-muted-foreground">Create shareable links to collect leads</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> New Page</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Capture Page</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }));
                  }}
                  placeholder="e.g. 2BR Downtown Apartment"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (URL path)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">/c/</span>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                    placeholder="my-listing"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.page_type} onValueChange={(v) => setForm((p) => ({ ...p, page_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description shown on the page..."
                  rows={2}
                />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full">
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Create Page
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-2">
          <p className="text-muted-foreground">No capture pages yet</p>
          <p className="text-sm text-muted-foreground">Create one to generate a shareable lead capture link</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                  <Badge variant={p.status === "active" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                  <Badge variant="outline" className="text-xs">{p.page_type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">/c/{p.slug}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.view_count} views</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.lead_count} leads</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyLink(p.slug)}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Link
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/c/${p.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
