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
    const { requestId } = await req.json();
    if (!requestId) throw new Error("Missing requestId");

    // Fetch the maintenance request
    const { data: request, error: fetchErr } = await supabase
      .from("maintenance_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchErr || !request) throw new Error("Request not found");

    // Update status to triaging
    await supabase.from("maintenance_requests").update({ status: "triaging" }).eq("id", requestId);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are P8, the AI property maintenance assistant for myrental. You receive repair and maintenance requests and provide RECOMMENDATIONS — you do NOT make final decisions. The landlord, property owner, or home inspector always has the final say.

Your job is to ANALYZE photos and descriptions, then RECOMMEND actions:
1. Analyze any uploaded photos carefully — identify visible damage, wear, issues
2. Categorize the issue (plumbing, electrical, HVAC, appliance, structural, pest, cosmetic, safety, general)
3. Assess severity (emergency, urgent, normal, low)
4. Determine if it's a safety hazard
5. Provide an estimated repair cost range (USD)
6. Give immediate troubleshooting advice the reporter can try RIGHT NOW
7. Suggest whether professional help is needed
8. Estimate response time needed
9. Provide a friendly, helpful response to the reporter

IMPORTANT: Always make it clear that your assessment is a RECOMMENDATION. The property owner/landlord/inspector will review and make the final decision on repairs, costs, and next steps. Frame everything as "P8 recommends..." or "Based on the photos, P8 suggests..."

Be practical, helpful, and professional. If it's an emergency (gas leak, flooding, electrical fire risk, no heat in winter), flag it immediately. For simpler issues, provide DIY guidance first.

Respond in this JSON format:
{
  "category": "plumbing|electrical|hvac|appliance|structural|pest|cosmetic|safety|general",
  "severity": "emergency|urgent|normal|low",
  "is_safety_hazard": boolean,
  "estimated_cost_min": number,
  "estimated_cost_max": number,
  "needs_professional": boolean,
  "estimated_response_time": "immediate|24h|48h|1week|scheduled",
  "troubleshooting_steps": ["step1", "step2"],
  "ai_response": "A friendly, detailed message to the reporter explaining what P8 found and what happens next",
  "recommended_vendors": ["type of vendor needed"],
  "priority_score": number (1-10, 10 being most urgent)
}`;

    const userPrompt = `Maintenance request details:
- Property: ${request.property_address}
- Reporter: ${request.reporter_name} (${request.reporter_role})
- Category reported: ${request.category}
- Urgency reported: ${request.urgency}
- Issue: ${request.title}
- Description: ${request.description}
- Photos attached: ${request.photos?.length || 0}
${request.photos?.length ? `\nPhoto URLs:\n${request.photos.map((u: string, i: number) => `${i + 1}. ${u}`).join("\n")}` : ""}

Please analyze this request and provide your triage assessment.`;

    // Build messages
    const content: any[] = [{ type: "text", text: userPrompt }];
    if (request.photos?.length) {
      for (const photoUrl of request.photos.slice(0, 5)) {
        content.push({ type: "image_url", image_url: { url: photoUrl } });
      }
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      await supabase.from("maintenance_requests").update({ status: "submitted" }).eq("id", requestId);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    let triage: any;
    try {
      const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/) || rawContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawContent;
      triage = JSON.parse(jsonStr);
    } catch {
      triage = { category: "general", severity: "normal", ai_response: rawContent, raw: true };
    }

    // Status is always "pending_review" — human makes the final call
    const newStatus = triage.severity === "emergency" ? "emergency" : "pending_review";

    const { error: updateErr } = await supabase
      .from("maintenance_requests")
      .update({
        ai_triage: triage,
        ai_response: triage.ai_response || rawContent,
        status: newStatus,
        category: triage.category || request.category,
        urgency: triage.severity || request.urgency,
      })
      .eq("id", requestId);

    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true, triage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("triage-repair error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
