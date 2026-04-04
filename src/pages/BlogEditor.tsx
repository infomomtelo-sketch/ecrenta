import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function BlogEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("blog_posts").insert({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      published,
      published_at: published ? new Date().toISOString() : null,
      user_id: user.id,
      author_name: user.user_metadata?.display_name || "runp8 Team",
    });
    setSaving(false);

    if (error) {
      toast({ title: "Error saving post", description: error.message, variant: "destructive" });
    } else {
      toast({ title: published ? "Published!" : "Draft saved" });
      navigate("/blog");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/blog" className="text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="flex-1 text-lg font-bold text-foreground">New Article</h1>
        <button
          onClick={() => setPublished(!published)}
          className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium ${
            published ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
          }`}
        >
          {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {published ? "Public" : "Draft"}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
        </button>
        <UserMenu />
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Travel Nurse Housing in Fresno: The Complete Guide"
            className="w-full rounded-lg bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">URL Slug</label>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>runp8.com/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Excerpt (shown in preview cards)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary of your article for SEO and social sharing..."
            rows={2}
            className="w-full rounded-lg bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Content (HTML)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<h2>Finding the Right Furnished Rental</h2><p>When you arrive in Fresno for a travel assignment...</p>"
            rows={16}
            className="w-full rounded-lg bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Cover Image URL</label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="travel nurse, fresno, housing guide"
            className="w-full rounded-lg bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <details className="rounded-lg bg-card border border-border p-4">
          <summary className="text-sm font-medium text-foreground cursor-pointer">SEO Settings</summary>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Meta Title (under 60 chars)</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || "SEO page title"}
                className="w-full rounded-lg bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">{(metaTitle || title).length}/60</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Meta Description (under 160 chars)</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={excerpt || "SEO description for search results"}
                rows={2}
                className="w-full rounded-lg bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground">{(metaDescription || excerpt).length}/160</p>
            </div>
          </div>
        </details>
      </main>
    </div>
  );
}
