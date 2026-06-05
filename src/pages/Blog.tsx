import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { ArrowLeft, Plus, Clock, Tag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  author_name: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

export default function Blog() {
  const { user, role } = useAuth();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image, author_name, tags, published_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const canWrite = !!user;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog — Furnished Rental Tips & Housing Guides | myrental</title>
        <meta name="description" content="Expert guides on furnished housing, travel nurse tips, and Central Valley rental market insights. Find your next furnished rental in Fresno County." />
      </Helmet>

      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/" className="text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="flex-1 text-lg font-bold text-foreground">Blog</h1>
        {canWrite && (
          <Link to="/blog/new" className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> Write
          </Link>
        )}
        <UserMenu />
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <section className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Furnished Rental Guides & Tips</h2>
          <p className="text-sm text-muted-foreground">Housing insights for travel nurses, healthcare professionals, and landlords in the Central Valley.</p>
        </section>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-muted-foreground">No articles published yet.</p>
            {canWrite && (
              <Link to="/blog/new" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                <Plus className="h-4 w-4" /> Write Your First Article
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block rounded-xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-colors"
              >
                {post.cover_image && (
                  <img src={post.cover_image} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                )}
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground leading-snug">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span>{post.author_name}</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-0.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                          <Tag className="h-2.5 w-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
