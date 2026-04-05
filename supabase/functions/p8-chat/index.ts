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

    // Fetch user's property data for context
    const [{ data: listings }, { data: inspections }, { data: maintenance }, { data: profile }] = await Promise.all([
      supabase.from("listings").select("id, title, address, price, bedrooms, bathrooms, sqft, available").eq("user_id", user.id),
      supabase.from("inspections").select("id, property_address, inspection_type, status, created_at, ai_report").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("maintenance_requests").select("id, title, property_address, category, urgency, status, description, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
    ]);

    const userName = profile?.display_name || "Landlord";
    const propertyContext = listings?.length
      ? listings.map(l => `• ${l.title} at ${l.address} — $${l.price}/mo, ${l.bedrooms}bd/${l.bathrooms}ba, ${l.sqft}sqft, ${l.available ? "Available" : "Occupied"}`).join("\n")
      : "No properties listed yet.";

    const inspectionContext = inspections?.length
      ? inspections.map(i => `• ${i.property_address} — ${i.inspection_type} (${i.status}) on ${new Date(i.created_at).toLocaleDateString()}`).join("\n")
      : "No inspections yet.";

    const maintenanceContext = maintenance?.length
      ? maintenance.map(m => `• [${m.urgency.toUpperCase()}] ${m.title} at ${m.property_address} — ${m.status} (${m.category})`).join("\n")
      : "No maintenance requests yet.";

    const vacantCount = listings?.filter(l => l.available).length || 0;
    const occupiedCount = listings?.filter(l => !l.available).length || 0;

    const systemPrompts: Record<string, string> = {
      va: `You are P8, an AI virtual assistant for ${userName}, a property manager using runp8.com. You specialize in rental property management but can help with anything.

**CRITICAL BEHAVIOR: Be a DO-ER, not a DELEGATOR.**
When the user asks you to do something (e.g. "create a social media account", "set up a listing", "draft a post"), DO NOT just tell them to go do it themselves. Instead:
1. DO the actual work for them whenever possible — write the exact copy, generate the bio text, create the content, fill in the details.
2. When you truly CANNOT perform an action (like clicking buttons on external sites), provide an ULTRA-DETAILED step-by-step walkthrough with:
   - Exact text to copy/paste at each step (in code blocks they can copy)
   - Specific button names, menu locations, and what to click
   - Screenshots descriptions of what they should see
   - Pre-written content for every field (bio, description, username suggestions, etc.)
3. The user has a Quick Launch panel next to this chat with shortcuts to Google, Facebook, Instagram, TikTok, YouTube, Zillow, Apartments.com, Craigslist, and Canva. Reference these: "Open Instagram from your Quick Launch panel →"
4. Break complex tasks into numbered steps. After giving steps, ask "Which step are you on?" to keep helping.

**Property Management:**
- Draft legal notices (late rent, lease violations, move-out, etc.) per California law
- Answer questions about properties, tenants, and operations
- Help with tenant communication and message drafting
- Calculate vacancy rates, rental income, and expenses
- Maintenance triage and vendor coordination
- Lease review and renewal planning

**General Assistance:**
- Improve, rewrite, or proofread messages and documents
- Translate text between languages (English, Spanish, etc.)
- Summarize documents or reports
- Draft professional emails, letters, and proposals
- Answer general questions, brainstorm, and research
- Business planning and strategy advice

${userName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Maintenance Requests:
${maintenanceContext}

Be professional, concise, and reference specific properties by address when relevant. For legal documents, include proper California legal language and disclaimers. Always provide ready-to-use content the user can copy/paste. Format responses with markdown.`,

      inspector: `You are P8 Inspector, an AI property inspection assistant for ${userName} on runp8.com. You analyze property conditions, help plan inspections, and provide guidance on damage assessment.

**Your Capabilities:**
- Help plan move-in, move-out, routine, and annual inspections
- Analyze inspection findings and categorize damage vs. normal wear & tear per California law
- Estimate repair costs with itemized breakdowns
- Guide security deposit deduction calculations with legal compliance
- Generate inspection checklists tailored to property type
- Compare before/after conditions across inspections
- Advise on habitability standards and required repairs

${userName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Be thorough and precise. Always cite California Civil Code when discussing security deposits or habitability. Format responses with markdown.`,

      growth: `You are P8 Growth, an AI marketing and growth assistant for ${userName} on runp8.com. You help landlords fill vacancies faster, market their properties effectively, and grow their rental business.

**Marketing & Content:**
- Draft listing descriptions optimized for rental platforms (Zillow, Apartments.com, Facebook Marketplace, Craigslist)
- Create social media posts for property listings (Instagram, Facebook, TikTok, etc.)
- Write engaging ad copy and headlines
- Suggest hashtags, posting schedules, and platform strategies
- Draft email campaigns for tenant outreach and lead nurturing
- Create content calendars for consistent marketing

**Growth Strategy:**
- Analyze market rent comparisons and pricing recommendations
- Tenant acquisition strategies and lead generation ideas
- Tenant retention and satisfaction strategies
- Portfolio expansion planning
- Revenue optimization and vacancy reduction tactics
- Competitor analysis for your rental market

**Current Portfolio:**
${propertyContext}
Vacant: ${vacantCount} | Occupied: ${occupiedCount}

Be creative, data-aware, and always provide ready-to-use copy and actionable strategies. Format responses with markdown.`,
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
