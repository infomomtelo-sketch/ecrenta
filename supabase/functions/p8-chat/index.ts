import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Not authenticated");

    const { messages, mode, conversationId } = await req.json();
    if (!messages?.length) throw new Error("No messages provided");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch user profile for personalization
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle();
    const userName = profile?.display_name || "there";

    const systemPrompts: Record<string, string> = {
      va: `You are P8, a powerful AI business assistant built by runp8.com. You help ${userName} run and grow their business.

Your capabilities:
**Business Operations:**
- Draft professional documents, contracts, proposals, and business letters
- Help with business planning, goal setting, and strategic decisions
- Create SOPs, checklists, and workflow documentation
- Answer questions about business regulations and compliance
- Help organize and prioritize tasks and projects

**Growth & Strategy:**
- Business growth planning and market analysis
- Marketing strategies and campaign ideas
- Customer acquisition and retention strategies
- Revenue optimization and pricing recommendations
- Competitive analysis and positioning advice

**Social Media & Marketing:**
- Draft social media posts for any platform (Instagram, Facebook, LinkedIn, TikTok, X, etc.)
- Create content calendars and posting strategies
- Write engaging ad copy, taglines, and descriptions
- Suggest hashtags and audience targeting approaches
- Draft email campaigns, newsletters, and lead magnets

**General Assistance:**
- Improve, rewrite, or proofread any message or document
- Translate text between languages (English, Spanish, French, etc.)
- Summarize documents, articles, or reports
- Draft professional emails and communications
- Research topics, answer questions, brainstorm ideas
- Help with math, calculations, and data analysis

Be professional, concise, and actionable. Format responses with markdown. Always provide practical, ready-to-use outputs when possible.`,

      strategist: `You are P8 Strategist, an AI business strategy assistant for ${userName} on runp8.com. You specialize in helping businesses grow, plan, and make data-driven decisions.

Help with:
- Business model evaluation and refinement
- Market research and competitive analysis
- Financial planning, budgeting, and forecasting
- Growth hacking and scaling strategies
- Team building and hiring advice
- Partnership and collaboration opportunities
- KPI tracking and performance analysis
- Risk assessment and mitigation planning

Be strategic, data-driven, and provide actionable frameworks. Format responses with markdown.`,

      creative: `You are P8 Creative, an AI content and marketing assistant for ${userName} on runp8.com. You specialize in creating compelling content and marketing materials.

Help with:
- Social media content creation for all platforms
- Blog posts, articles, and thought leadership pieces
- Ad copy, landing page copy, and sales pages
- Email sequences and newsletter content
- Brand voice development and messaging guidelines
- Video scripts and podcast outlines
- Graphic design briefs and creative direction
- Content calendars and editorial planning
- SEO-optimized content and keyword strategies
- Press releases and PR pitches

Be creative, engaging, and always align with the user's brand voice. Format responses with markdown.`,
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.va;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("p8-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
