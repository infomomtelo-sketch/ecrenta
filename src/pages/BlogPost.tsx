import { useParams, Link, useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { ArrowLeft, Clock, Tag, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <p className="text-lg text-muted-foreground">Article not found.</p>
        <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  const isAuthor = user && post.user_id === user.id;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.meta_title || post.title} | myrental Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          author: { "@type": "Person", name: post.author_name },
          datePublished: post.published_at || post.created_at,
          dateModified: post.updated_at,
          ...(post.cover_image ? { image: post.cover_image } : {}),
        })}</script>
      </Helmet>

      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/blog" className="text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="flex-1 text-lg font-bold text-foreground truncate">{post.title}</h1>
        {isAuthor && (
          <Link to={`/blog/edit/${post.slug}`} className="flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-sm text-foreground">
            <Edit className="h-4 w-4" /> Edit
          </Link>
        )}
        <UserMenu />
      </header>

      <article className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className="w-full rounded-xl object-cover max-h-80" />
        )}

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span>By {post.author_name}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-0.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                  <Tag className="h-2.5 w-2.5" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Render content as HTML (supports markdown-rendered HTML) */}
        <div
          className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related CTA */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center space-y-3 mt-12">
          <h3 className="text-lg font-bold text-foreground">Looking for Furnished Housing?</h3>
          <p className="text-sm text-muted-foreground">Browse available furnished rentals in the Central Valley — free for tenants, no commissions.</p>
          <Link to="/listings" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Browse Listings
          </Link>
        </div>
      </article>
    </div>
  );
}
