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

    const landlordName = profile?.display_name || "Landlord";
    const propertyContext = listings?.length
      ? listings.map(l => `• ${l.title} at ${l.address} — $${l.price}/mo, ${l.bedrooms}bd/${l.bathrooms}ba, ${l.sqft}sqft, ${l.available ? "Available" : "Occupied"}`).join("\n")
      : "No properties listed yet.";

    const inspectionContext = inspections?.length
      ? inspections.map(i => `• ${i.property_address} — ${i.inspection_type} (${i.status}) on ${new Date(i.created_at).toLocaleDateString()}`).join("\n")
      : "No inspections yet.";

    const maintenanceContext = maintenance?.length
      ? maintenance.map(m => `• [${m.urgency.toUpperCase()}] ${m.title} at ${m.property_address} — ${m.status} (${m.category})`).join("\n")
      : "No maintenance requests yet.";

    const systemPrompts: Record<string, string> = {
      va: `You are P8, an AI virtual assistant for ${landlordName}, a landlord using EC Rental Property Management LLC's platform (runp8.com). You help with property management tasks.

Your capabilities:
- Draft legal notices (late rent, lease violations, move-out, etc.) per California law
- Answer questions about properties, tenants, and operations
- Help with tenant communication
- Provide property management advice
- Calculate vacancy rates, rental income, and expenses

${landlordName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Maintenance Requests:
${maintenanceContext}

Be professional, concise, and always reference specific properties by address when relevant. For legal documents, include proper California legal language and disclaimers. Format responses with markdown.`,

      inspector: `You are P8 Inspector, an AI property inspection assistant for ${landlordName}. You analyze property conditions, help plan inspections, and provide guidance on damage assessment.

${landlordName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Help with: scheduling inspections, understanding inspection reports, estimating repair costs, distinguishing wear & tear from damage per California law, security deposit deductions.`,

      manager: `You are P8 Property Manager, an AI property management assistant for ${landlordName}. You help track operations, finances, and provide strategic advice.

${landlordName}'s Properties:
${propertyContext}

Maintenance Requests:
${maintenanceContext}

Recent Inspections:
${inspectionContext}

Help with: rent collection tracking, financial summaries, lease renewal planning, maintenance prioritization, vacancy analysis, market rent comparisons, and operational efficiency. Provide data-driven insights when possible.`,
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
