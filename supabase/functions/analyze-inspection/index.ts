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
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Not authenticated");

    const { inspectionId, photos, propertyAddress, inspectionType, rooms } = await req.json();
    if (!inspectionId || !photos?.length) throw new Error("Missing inspectionId or photos");

    // Update status to analyzing
    await supabase.from("inspections").update({ status: "analyzing" }).eq("id", inspectionId).eq("user_id", user.id);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const roomList = rooms?.length ? rooms.join(", ") : "all rooms";
    const systemPrompt = `You are a professional property inspector for EC Rental Property Management LLC. You analyze property photos to generate detailed move-out (or move-in/routine) inspection reports.

For each photo, identify:
1. Room/area depicted
2. Condition assessment (Excellent, Good, Fair, Poor, Damaged)
3. Specific issues found (scratches, stains, holes, wear, damage, missing items)
4. Whether damage is normal wear & tear vs tenant-caused
5. Estimated repair cost (USD) if applicable

After analyzing all photos, provide:
- Overall property condition score (1-10)
- Summary of findings
- List of items needing repair with cost estimates
- Security deposit deduction recommendations
- Recommended actions before next tenant

Be thorough, professional, and fair. Distinguish normal wear from actual damage per California landlord-tenant law.`;

    const userPrompt = `Analyze this ${inspectionType.replace("_", "-")} inspection for property at: ${propertyAddress}
Rooms to inspect: ${roomList}
Number of photos provided: ${photos.length}

Photo URLs:
${photos.map((url: string, i: number) => `${i + 1}. ${url}`).join("\n")}

Please provide a comprehensive inspection report in the following JSON structure:
{
  "overall_score": number (1-10),
  "overall_condition": "Excellent|Good|Fair|Poor",
  "summary": "Brief overall summary",
  "rooms": [
    {
      "name": "Room name",
      "condition": "Excellent|Good|Fair|Poor|Damaged",
      "score": number (1-10),
      "issues": [
        {
          "description": "Issue description",
          "severity": "Minor|Moderate|Major|Critical",
          "is_wear_and_tear": boolean,
          "estimated_cost": number,
          "photo_index": number
        }
      ]
    }
  ],
  "total_estimated_repairs": number,
  "deposit_deduction_recommended": number,
  "recommended_actions": ["action1", "action2"],
  "move_out_checklist": [
    { "item": "Clean all surfaces", "status": "Pass|Fail|N/A", "notes": "string" }
  ]
}`;

    // Build messages with image content
    const content: any[] = [{ type: "text", text: userPrompt }];
    for (const photoUrl of photos.slice(0, 10)) {
      content.push({ type: "image_url", image_url: { url: photoUrl } });
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
      if (status === 429) {
        await supabase.from("inspections").update({ status: "draft" }).eq("id", inspectionId);
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        await supabase.from("inspections").update({ status: "draft" }).eq("id", inspectionId);
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response (may be wrapped in ```json blocks)
    let report: any;
    try {
      const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/) || rawContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawContent;
      report = JSON.parse(jsonStr);
    } catch {
      report = {
        overall_score: 0,
        summary: rawContent,
        raw_response: true,
      };
    }

    // Save report
    const { error: updateErr } = await supabase
      .from("inspections")
      .update({ ai_report: report, status: "completed" })
      .eq("id", inspectionId)
      .eq("user_id", user.id);

    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true, report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-inspection error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
