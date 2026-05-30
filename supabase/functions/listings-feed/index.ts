// Public listings syndication feed (RSS 2.0 + JSON)
// Usage:
//   GET /functions/v1/listings-feed              -> RSS XML
//   GET /functions/v1/listings-feed?format=json  -> JSON
//   GET /functions/v1/listings-feed?format=rss   -> RSS XML
// Optional: ?limit=100 (max 500)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const SITE_URL = "https://ecrenta.space";
const FEED_TITLE = "ecrenta — Rental Listings";
const FEED_DESC = "Live rental listings from ecrenta. Updated continuously.";

function escapeXml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(s: string): string {
  return `<![CDATA[${String(s ?? "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const format = (url.searchParams.get("format") || "rss").toLowerCase();
    const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 1), 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: listings, error } = await supabase
      .from("listings")
      .select("id,title,price,address,bedrooms,bathrooms,sqft,description,images,landlord_name,available,created_at,updated_at")
      .eq("available", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const items = (listings ?? []).map((l) => ({
      ...l,
      url: `${SITE_URL}/listings/${l.id}`,
      image: Array.isArray(l.images) && l.images.length > 0 ? l.images[0] : null,
    }));

    if (format === "json") {
      // JSON Feed 1.1 style
      const body = {
        version: "https://jsonfeed.org/version/1.1",
        title: FEED_TITLE,
        home_page_url: SITE_URL,
        feed_url: `${SITE_URL}/feed.json`,
        description: FEED_DESC,
        items: items.map((l) => ({
          id: l.id,
          url: l.url,
          title: l.title,
          content_html: `<p>${escapeXml(l.description || "")}</p>`,
          summary: `${l.bedrooms}bd ${l.bathrooms}ba · ${l.sqft} sqft · $${l.price}/mo · ${l.address}`,
          image: l.image,
          date_published: new Date(l.created_at).toISOString(),
          date_modified: new Date(l.updated_at || l.created_at).toISOString(),
          authors: l.landlord_name ? [{ name: l.landlord_name }] : undefined,
          _rental: {
            price: l.price,
            currency: "USD",
            period: "month",
            bedrooms: l.bedrooms,
            bathrooms: l.bathrooms,
            sqft: l.sqft,
            address: l.address,
            images: l.images,
          },
        })),
      };
      return new Response(JSON.stringify(body, null, 2), {
        headers: { ...corsHeaders, "Content-Type": "application/feed+json; charset=utf-8", "Cache-Control": "public, max-age=300" },
      });
    }

    // RSS 2.0 with media:content for images
    const now = new Date().toUTCString();
    const itemsXml = items.map((l) => {
      const pubDate = new Date(l.created_at).toUTCString();
      const desc = `${l.bedrooms} bed · ${l.bathrooms} bath · ${l.sqft} sqft · $${l.price}/mo\n${l.address}\n\n${l.description || ""}`;
      const media = l.image ? `<media:content url="${escapeXml(l.image)}" medium="image" />` : "";
      return `
    <item>
      <title>${escapeXml(l.title)}</title>
      <link>${escapeXml(l.url)}</link>
      <guid isPermaLink="false">${escapeXml(l.id)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cdata(desc)}</description>
      <author>${escapeXml(l.landlord_name || "ecrenta")}</author>
      <category>${l.bedrooms} bedroom</category>
      ${media}
    </item>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${itemsXml}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
