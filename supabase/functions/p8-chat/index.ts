// Direct Anthropic Claude API integration — zero third-party AI gateway dependencies.
// Portable: swap ANTHROPIC_API_KEY across any host (Lovable Cloud, Cloudflare Workers, self-hosted Supabase).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL = "claude-sonnet-4-5-20250929";

// Anthropic tool format (input_schema, not parameters; no OpenAI wrapper).
const TOOLS = [
  {
    name: "create_rent_receipt",
    description: "Create a shareable rent receipt that the landlord can send to a tenant. Use this when the user asks you to create/generate a rent receipt.",
    input_schema: {
      type: "object",
      properties: {
        tenant_name: { type: "string", description: "Tenant's full name" },
        property_address: { type: "string", description: "Property address" },
        amount_paid: { type: "number", description: "Amount paid in dollars" },
        payment_date: { type: "string", description: "Date of payment (YYYY-MM-DD)" },
        period_from: { type: "string", description: "Rental period start (YYYY-MM-DD)" },
        period_to: { type: "string", description: "Rental period end (YYYY-MM-DD)" },
        payment_method: { type: "string", enum: ["cash", "check", "money_order", "zelle", "venmo", "bank_transfer", "other"] },
        received_by: { type: "string", description: "Name of person who received payment" },
        notes: { type: "string", description: "Any additional notes" },
      },
      required: ["tenant_name", "property_address", "amount_paid", "payment_date", "period_from", "period_to", "received_by"],
    },
  },
  {
    name: "create_invoice",
    description: "Create a shareable invoice for a tenant (rent, fees, etc). Use when user asks to create/generate/send an invoice.",
    input_schema: {
      type: "object",
      properties: {
        tenant_name: { type: "string" },
        property_address: { type: "string" },
        amount: { type: "number" },
        due_date: { type: "string", description: "YYYY-MM-DD" },
        description: { type: "string" },
        line_items: {
          type: "array",
          items: {
            type: "object",
            properties: { description: { type: "string" }, amount: { type: "number" } },
            required: ["description", "amount"],
          },
        },
        notes: { type: "string" },
      },
      required: ["tenant_name", "property_address", "amount", "due_date", "description", "line_items"],
    },
  },
  {
    name: "create_notice",
    description: "Create a shareable legal notice (3-day notice, lease violation, move-out notice, etc). Use when user asks to create a formal notice document.",
    input_schema: {
      type: "object",
      properties: {
        notice_type: { type: "string", enum: ["3_day_pay_or_quit", "30_day_notice", "60_day_notice", "lease_violation", "move_out", "entry_notice", "other"] },
        tenant_name: { type: "string" },
        property_address: { type: "string" },
        body_text: { type: "string", description: "Full body text of the notice with all legal language" },
        effective_date: { type: "string", description: "YYYY-MM-DD" },
        landlord_name: { type: "string" },
      },
      required: ["notice_type", "tenant_name", "property_address", "body_text", "effective_date", "landlord_name"],
    },
  },
];

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) token += chars[Math.floor(Math.random() * chars.length)];
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
    return JSON.stringify({ success: true, document_type: "Rent Receipt", share_url: `${siteUrl}/sign/${signToken}`, id: data.id });
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
    return JSON.stringify({ success: true, document_type: "Invoice", share_url: `${siteUrl}/sign/${signToken}`, id: data.id });
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
    return JSON.stringify({ success: true, document_type: "Notice", share_url: `${siteUrl}/sign/${signToken}`, id: data.id });
  }

  return JSON.stringify({ error: `Unknown tool: ${toolName}` });
}

// Convert OpenAI-style [{role, content}] history to Anthropic content-block messages.
function toAnthropicMessages(msgs: { role: string; content: string }[]) {
  return msgs
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: [{ type: "text", text: m.content }] }));
}

// Transform Anthropic SSE stream -> OpenAI-compatible SSE (so the existing client parser works untouched).
function transformAnthropicStream(anthropicBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = anthropicBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        const lines = part.split("\n");
        let eventType = "";
        let dataStr = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) eventType = line.slice(7).trim();
          else if (line.startsWith("data: ")) dataStr = line.slice(6);
        }
        if (!dataStr) continue;
        try {
          const data = JSON.parse(dataStr);
          if (eventType === "content_block_delta" && data.delta?.type === "text_delta") {
            const text = data.delta.text ?? "";
            const openaiChunk = { choices: [{ delta: { content: text } }] };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
          }
        } catch {
          // ignore malformed chunks
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

async function callAnthropic(body: Record<string, any>, apiKey: string) {
  return fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Not authenticated");

    const { messages, mode } = await req.json();
    if (!messages?.length) throw new Error("No messages provided");

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

    const referer = req.headers.get("referer") || req.headers.get("origin") || "";
    const siteUrl = referer ? new URL(referer).origin : "https://myrental.space";

    const [{ data: listings }, { data: inspections }, { data: maintenance }, { data: profile }, { data: tenants }] = await Promise.all([
      supabase.from("listings").select("id, title, address, price, bedrooms, bathrooms, sqft, available").eq("user_id", user.id),
      supabase.from("inspections").select("id, property_address, inspection_type, status, created_at, ai_report").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("maintenance_requests").select("id, title, property_address, category, urgency, status, description, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
      supabase.from("tenants").select("full_name, unit_address, rent_amount, email, phone").eq("user_id", user.id),
    ]);

    const userName = profile?.display_name || "Landlord";
    const propertyContext = listings?.length
      ? listings.map((l: any) => `• ${l.title} at ${l.address} — $${l.price}/mo, ${l.bedrooms}bd/${l.bathrooms}ba, ${l.sqft}sqft, ${l.available ? "Available" : "Occupied"}`).join("\n")
      : "No properties listed yet.";
    const inspectionContext = inspections?.length
      ? inspections.map((i: any) => `• ${i.property_address} — ${i.inspection_type} (${i.status}) on ${new Date(i.created_at).toLocaleDateString()}`).join("\n")
      : "No inspections yet.";
    const maintenanceContext = maintenance?.length
      ? maintenance.map((m: any) => `• [${m.urgency.toUpperCase()}] ${m.title} at ${m.property_address} — ${m.status} (${m.category})`).join("\n")
      : "No maintenance requests yet.";
    const tenantContext = tenants?.length
      ? tenants.map((t: any) => `• ${t.full_name} at ${t.unit_address || "N/A"} — $${t.rent_amount || "N/A"}/mo, ${t.email || "no email"}, ${t.phone || "no phone"}`).join("\n")
      : "No tenants added yet.";
    const vacantCount = listings?.filter((l: any) => l.available).length || 0;
    const occupiedCount = listings?.filter((l: any) => !l.available).length || 0;

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
      va: `You are an AI virtual assistant for ${userName}, a property manager using myrental (myrental.space). You specialize in rental property management but can help with anything.

**RESPONSE LENGTH: Keep responses SHORT and scannable.** Max 3-5 bullet points or a short paragraph. No walls of text. Only expand when the user explicitly asks for detail or a full document draft. Get to the point fast.

**CRITICAL BEHAVIOR: Be a DO-ER, not a DELEGATOR.**
When the user asks you to do something (e.g. "create a receipt", "generate an invoice", "draft a notice"), DO the actual work:
1. Use your document creation tools to generate REAL shareable receipts, invoices, and notices.
2. When you truly CANNOT perform an action (like clicking buttons on external sites), provide an ULTRA-DETAILED step-by-step walkthrough.
3. The user has a Quick Launch panel next to this chat. Reference these: "Open Instagram from your Quick Launch panel →"
4. Break complex tasks into numbered steps. After giving steps, ask "Which step are you on?" to keep helping.
5. **CLICKABLE SEARCH LINKS:** Wrap recommendations in markdown: [display text](search:search query).

${toolInstructions}

${userName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Maintenance Requests:
${maintenanceContext}

Be professional, concise, and reference specific properties by address when relevant. For legal documents, include proper California legal language. Format responses with markdown.`,

      inspector: `You are an AI property inspection assistant for ${userName} on myrental (myrental.space).

**RESPONSE LENGTH: Keep responses SHORT and scannable.** Max 3-5 bullet points or a short paragraph.

${toolInstructions}

${userName}'s Properties:
${propertyContext}

Recent Inspections:
${inspectionContext}

Be thorough and precise. Cite California Civil Code when relevant. Format with markdown.`,

      growth: `You are an AI marketing and growth assistant for ${userName} on myrental (myrental.space).

**RESPONSE LENGTH: Keep responses SHORT and scannable.** Max 3-5 bullet points or a short paragraph.

${toolInstructions}

**Current Portfolio:**
${propertyContext}
Vacant: ${vacantCount} | Occupied: ${occupiedCount}

Be creative, data-aware, and provide ready-to-use content. Format with markdown.`,
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.va;
    const anthropicMessages = toAnthropicMessages(messages);

    // First call — non-streaming, may return tool_use blocks.
    const firstResp = await callAnthropic({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
      tools: TOOLS,
    }, ANTHROPIC_API_KEY);

    if (!firstResp.ok) {
      const errText = await firstResp.text();
      console.error(`Anthropic error ${firstResp.status}:`, errText);
      if (firstResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (firstResp.status === 401) {
        return new Response(JSON.stringify({ error: "AI service authentication failed. Please contact support." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`Anthropic API error: ${firstResp.status} — ${errText}`);
    }

    const firstResult = await firstResp.json();
    const toolUses = (firstResult.content || []).filter((c: any) => c.type === "tool_use");

    // Tool-use path: execute tools, then stream the final response.
    if (toolUses.length > 0) {
      const toolResultsBlocks: any[] = [];
      for (const tu of toolUses) {
        try {
          const result = await executeToolCall(supabase, user.id, tu.name, tu.input, siteUrl);
          toolResultsBlocks.push({ type: "tool_result", tool_use_id: tu.id, content: result });
        } catch (err) {
          toolResultsBlocks.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: JSON.stringify({ error: err instanceof Error ? err.message : "Tool execution failed" }),
            is_error: true,
          });
        }
      }

      const secondResp = await callAnthropic({
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          ...anthropicMessages,
          { role: "assistant", content: firstResult.content },
          { role: "user", content: toolResultsBlocks },
        ],
        tools: TOOLS,
        stream: true,
      }, ANTHROPIC_API_KEY);

      if (!secondResp.ok || !secondResp.body) {
        throw new Error(`Anthropic streaming error: ${secondResp.status}`);
      }

      return new Response(transformAnthropicStream(secondResp.body), {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tool calls — re-run as streaming for the assistant reply.
    const streamResp = await callAnthropic({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
      stream: true,
    }, ANTHROPIC_API_KEY);

    if (!streamResp.ok || !streamResp.body) {
      throw new Error(`Anthropic streaming error: ${streamResp.status}`);
    }

    return new Response(transformAnthropicStream(streamResp.body), {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("claude-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
