import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOOLS = [
  {
    type: "function",
    function: {
      name: "create_rent_receipt",
      description: "Create a shareable rent receipt that the landlord can send to a tenant. Use this when the user asks you to create/generate a rent receipt.",
      parameters: {
        type: "object",
        properties: {
          tenant_name: { type: "string", description: "Tenant's full name" },
          property_address: { type: "string", description: "Property address" },
          amount_paid: { type: "number", description: "Amount paid in dollars" },
          payment_date: { type: "string", description: "Date of payment (YYYY-MM-DD)" },
          period_from: { type: "string", description: "Rental period start (YYYY-MM-DD)" },
          period_to: { type: "string", description: "Rental period end (YYYY-MM-DD)" },
          payment_method: { type: "string", enum: ["cash", "check", "money_order", "zelle", "venmo", "bank_transfer", "other"], description: "Payment method" },
          received_by: { type: "string", description: "Name of person who received payment" },
          notes: { type: "string", description: "Any additional notes" },
        },
        required: ["tenant_name", "property_address", "amount_paid", "payment_date", "period_from", "period_to", "received_by"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_invoice",
      description: "Create a shareable invoice for a tenant (rent, fees, etc). Use when user asks to create/generate/send an invoice.",
      parameters: {
        type: "object",
        properties: {
          tenant_name: { type: "string", description: "Tenant's full name" },
          property_address: { type: "string", description: "Property address" },
          amount: { type: "number", description: "Total amount due in dollars" },
          due_date: { type: "string", description: "Due date (YYYY-MM-DD)" },
          description: { type: "string", description: "What this invoice is for" },
          line_items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: { type: "string" },
                amount: { type: "number" },
              },
              required: ["description", "amount"],
            },
            description: "Itemized charges",
          },
          notes: { type: "string", description: "Any additional notes or payment instructions" },
        },
        required: ["tenant_name", "property_address", "amount", "due_date", "description", "line_items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_notice",
      description: "Create a shareable legal notice (3-day notice, lease violation, move-out notice, etc). Use when user asks to create a formal notice document.",
      parameters: {
        type: "object",
        properties: {
          notice_type: { type: "string", enum: ["3_day_pay_or_quit", "30_day_notice", "60_day_notice", "lease_violation", "move_out", "entry_notice", "other"], description: "Type of notice" },
          tenant_name: { type: "string", description: "Tenant's full name" },
          property_address: { type: "string", description: "Property address" },
          body_text: { type: "string", description: "Full body text of the notice with all legal language" },
          effective_date: { type: "string", description: "Effective date (YYYY-MM-DD)" },
          landlord_name: { type: "string", description: "Landlord's full name" },
        },
        required: ["notice_type", "tenant_name", "property_address", "body_text", "effective_date", "landlord_name"],
      },
    },
  },
];

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

async function executeToolCall(
  supabase: any,
  userId: string,
  toolName: string,
  args: Record<string, any>,
  siteUrl: string,
): Promise<string> {
  const signToken = generateToken();

  if (toolName === "create_rent_receipt") {
    const content = {
      type: "rent_receipt",
      tenant_name: args.tenant_name,
      property_address: args.property_address,
      amount_paid: args.amount_paid,
      payment_date: args.payment_date,
      period_from: args.period_from,
      period_to: args.period_to,
      payment_method: args.payment_method || "other",
      received_by: args.received_by,
      notes: args.notes || "",
    };

    const { data, error } = await supabase.from("rental_forms").insert({
      user_id: userId,
      title: `Rent Receipt — ${args.tenant_name} — ${args.payment_date}`,
      form_type: "rent_receipt",
      content,
      status: "sent",
      sign_token: signToken,
      recipient_email: null,
    }).select("id").single();

    if (error) throw new Error(`Failed to create receipt: ${error.message}`);
    return JSON.stringify({
      success: true,
      document_type: "Rent Receipt",
      share_url: `${siteUrl}/sign/${signToken}`,
      id: data.id,
    });
  }

  if (toolName === "create_invoice") {
    const content = {
      type: "invoice",
      tenant_name: args.tenant_name,
      property_address: args.property_address,
      amount: args.amount,
      due_date: args.due_date,
      description: args.description,
      line_items: args.line_items,
      notes: args.notes || "",
    };

    const { data, error } = await supabase.from("rental_forms").insert({
      user_id: userId,
      title: `Invoice — ${args.tenant_name} — $${args.amount}`,
      form_type: "invoice",
      content,
      status: "sent",
      sign_token: signToken,
      recipient_email: null,
    }).select("id").single();

    if (error) throw new Error(`Failed to create invoice: ${error.message}`);
    return JSON.stringify({
      success: true,
      document_type: "Invoice",
      share_url: `${siteUrl}/sign/${signToken}`,
      id: data.id,
    });
  }

  if (toolName === "create_notice") {
    const content = {
      type: "notice",
      notice_type: args.notice_type,
      tenant_name: args.tenant_name,
      property_address: args.property_address,
      body_text: args.body_text,
      effective_date: args.effective_date,
      landlord_name: args.landlord_name,
    };

    const { data, error } = await supabase.from("rental_forms").insert({
      user_id: userId,
      title: `${args.notice_type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} — ${args.tenant_name}`,
      form_type: "notice",
      content,
      status: "sent",
      sign_token: signToken,
      recipient_email: null,
    }).select("id").single();

    if (error) throw new Error(`Failed to create notice: ${error.message}`);
    return JSON.stringify({
      success: true,
      document_type: "Notice",
      share_url: `${siteUrl}/sign/${signToken}`,
      id: data.id,
    });
  }

  return JSON.stringify({ error: `Unknown tool: ${toolName}` });
}

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

    const { messages, mode } = await req.json();
    if (!messages?.length) throw new Error("No messages provided");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Determine site URL from referer or env
    const referer = req.headers.get("referer") || req.headers.get("origin") || "";
    const siteUrl = referer ? new URL(referer).origin : "https://myrental.lovable.app";

    // Fetch user's property data for context
    const [{ data: listings }, { data: inspections }, { data: maintenance }, { data: profile }, { data: tenants }] = await Promise.all([
      supabase.from("listings").select("id, title, address, price, bedrooms, bathrooms, sqft, available").eq("user_id", user.id),
      supabase.from("inspections").select("id, property_address, inspection_type, status, created_at, ai_report").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("maintenance_requests").select("id, title, property_address, category, urgency, status, description, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
      supabase.from("tenants").select("full_name, unit_address, rent_amount, email, phone").eq("user_id", user.id),
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

    const tenantContext = tenants?.length
      ? tenants.map(t => `• ${t.full_name} at ${t.unit_address || "N/A"} — $${t.rent_amount || "N/A"}/mo, ${t.email || "no email"}, ${t.phone || "no phone"}`).join("\n")
      : "No tenants added yet.";

    const vacantCount = listings?.filter(l => l.available).length || 0;
    const occupiedCount = listings?.filter(l => !l.available).length || 0;

    const toolInstructions = `
**DOCUMENT CREATION:**
You have tools to create REAL shareable documents. When the user asks for a receipt, invoice, or notice:
1. Use the appropriate tool (create_rent_receipt, create_invoice, create_notice) to generate the document.
2. After the document is created, you'll get back a shareable URL. Present this to the user.
3. Ask the user for any missing required info before calling the tool. Use tenant/property data you have when possible.
4. Today's date is ${new Date().toISOString().split("T")[0]}.

Tenants on file:
${tenantContext}
`;

    const systemPrompts: Record<string, string> = {
      va: `You are P8, an AI virtual assistant for ${userName}, a property manager using myrental (myrental.space). You specialize in rental property management but can help with anything.

**RESPONSE LENGTH: Keep responses SHORT and scannable.** Max 3-5 bullet points or a short paragraph. No walls of text. Only expand when the user explicitly asks for detail or a full document draft. Get to the point fast.

**CRITICAL BEHAVIOR: Be a DO-ER, not a DELEGATOR.**
When the user asks you to do something (e.g. "create a receipt", "generate an invoice", "draft a notice"), DO the actual work:
1. Use your document creation tools to generate REAL shareable receipts, invoices, and notices.
2. When you truly CANNOT perform an action (like clicking buttons on external sites), provide an ULTRA-DETAILED step-by-step walkthrough.
3. The user has a Quick Launch panel next to this chat. Reference these: "Open Instagram from your Quick Launch panel →"
4. Break complex tasks into numbered steps. After giving steps, ask "Which step are you on?" to keep helping.
5. **CLICKABLE SEARCH LINKS:** Wrap recommendations in markdown: [display text](search:search query).

${toolInstructions}

**Property Management:**
- Draft legal notices, create receipts, generate invoices — all as shareable documents
- Answer questions about properties, tenants, and operations
- Help with tenant communication and message drafting
- Calculate vacancy rates, rental income, and expenses
- Maintenance triage and vendor coordination

**General Assistance:**
- Improve, rewrite, or proofread messages and documents
- Translate text between languages (English, Spanish, etc.)
- Summarize documents, draft emails, brainstorm, research
- Business planning and strategy advice

${userName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Maintenance Requests:
${maintenanceContext}

Be professional, concise, and reference specific properties by address when relevant. For legal documents, include proper California legal language. Format responses with markdown.`,

      inspector: `You are P8 Inspector, an AI property inspection assistant for ${userName} on myrental (myrental.space).

**RESPONSE LENGTH: Keep responses SHORT and scannable.** Max 3-5 bullet points or a short paragraph. Only expand for full checklists or detailed estimates when asked.

${toolInstructions}

**Your Capabilities:**
- Help plan move-in, move-out, routine, and annual inspections
- Analyze inspection findings and categorize damage vs. normal wear & tear per California law
- Estimate repair costs with itemized breakdowns
- Guide security deposit deduction calculations
- Generate inspection checklists
- Create shareable inspection-related notices and invoices for repairs

${userName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Be thorough and precise. Always cite California Civil Code when relevant. Format responses with markdown.`,

      growth: `You are P8 Growth, an AI marketing and growth assistant for ${userName} on myrental (myrental.space).

**RESPONSE LENGTH: Keep responses SHORT and scannable.** Max 3-5 bullet points or a short paragraph. Only expand for full ad copy or content drafts when asked.

${toolInstructions}

**Marketing & Content:**
- Draft listing descriptions for rental platforms
- Create social media posts, ad copy, and hashtags
- Draft email campaigns for tenant outreach
- Create content calendars

**Growth Strategy:**
- Market rent comparisons and pricing recommendations
- Tenant acquisition and retention strategies
- Portfolio expansion planning
- Revenue optimization and vacancy reduction

**Current Portfolio:**
${propertyContext}
Vacant: ${vacantCount} | Occupied: ${occupiedCount}

Be creative, data-aware, and provide ready-to-use content. Format responses with markdown.`,
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.va;

    // First AI call — may return tool calls
    const aiPayload: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      tools: TOOLS,
      stream: false, // first call non-streaming to check for tool calls
    };

    const firstResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aiPayload),
    });

    if (!firstResp.ok) {
      const status = firstResp.status;
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

    const firstResult = await firstResp.json();
    const firstChoice = firstResult.choices?.[0];

    // Check if the AI wants to call tools
    if (firstChoice?.message?.tool_calls?.length) {
      const toolCalls = firstChoice.message.tool_calls;
      const toolResults: any[] = [];

      for (const tc of toolCalls) {
        const args = typeof tc.function.arguments === "string"
          ? JSON.parse(tc.function.arguments)
          : tc.function.arguments;
        
        try {
          const result = await executeToolCall(supabase, user.id, tc.function.name, args, siteUrl);
          toolResults.push({
            role: "tool",
            tool_call_id: tc.id,
            content: result,
          });
        } catch (err) {
          toolResults.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify({ error: err instanceof Error ? err.message : "Tool execution failed" }),
          });
        }
      }

      // Second call — stream the final response with tool results
      const secondResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            firstChoice.message,
            ...toolResults,
          ],
          stream: true,
        }),
      });

      if (!secondResp.ok) throw new Error(`AI gateway error on second call: ${secondResp.status}`);

      return new Response(secondResp.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tool calls — stream directly (re-do as streaming)
    const streamResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...aiPayload,
        stream: true,
        tools: undefined, // don't need tools for re-stream
      }),
    });

    if (!streamResp.ok) throw new Error(`AI gateway error: ${streamResp.status}`);

    return new Response(streamResp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("p8-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
