import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ARCHIVE_EMAIL = "p8@ecrenta.space";

function buildSummary(formType: string, content: any): string[] {
  const lines: string[] = [];
  if (content.property_address) lines.push(`Property: ${content.property_address}`);
  if (content.tenant_name) lines.push(`Tenant: ${content.tenant_name}`);
  if (content.landlord_name) lines.push(`Landlord: ${content.landlord_name}`);
  if (content.rent_amount) lines.push(`Monthly Rent: $${content.rent_amount}`);
  if (content.lease_start && content.lease_end) lines.push(`Term: ${content.lease_start} → ${content.lease_end}`);
  if (content.amount_paid) lines.push(`Amount Paid: $${content.amount_paid}`);
  if (content.amount) lines.push(`Amount: $${content.amount}`);
  if (content.due_date) lines.push(`Due Date: ${content.due_date}`);
  if (content.payment_date) lines.push(`Payment Date: ${content.payment_date}`);
  if (content.payment_method) lines.push(`Payment Method: ${String(content.payment_method).replace(/_/g, " ")}`);
  if (content.notice_type) lines.push(`Notice Type: ${String(content.notice_type).replace(/_/g, " ")}`);
  if (content.effective_date) lines.push(`Effective: ${content.effective_date}`);
  return lines;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { formId } = await req.json();
    if (!formId) throw new Error("formId is required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch form
    const { data: form, error: formErr } = await supabase
      .from("rental_forms")
      .select("*")
      .eq("id", formId)
      .single();
    if (formErr || !form) throw new Error(`Form not found: ${formErr?.message}`);

    // Resolve landlord email via auth.users (admin API)
    let landlordEmail: string | null = null;
    if (form.user_id) {
      const { data: userRes } = await supabase.auth.admin.getUserById(form.user_id);
      landlordEmail = userRes?.user?.email ?? null;
    }

    const tenantEmail: string | null = form.recipient_email ?? null;
    const summaryLines = buildSummary(form.form_type, form.content || {});
    const baseUrl = Deno.env.get("PUBLIC_APP_URL") || "https://ecrenta.space";
    const documentUrl = form.sign_token ? `${baseUrl}/sign/${form.sign_token}` : undefined;

    const sharedData = {
      title: form.title,
      formType: form.form_type,
      signerName: form.signer_name,
      signedAt: form.signed_at,
      signatureDataUrl: form.signature_data,
      summaryLines,
      documentUrl,
    };

    const recipients: Array<{ email: string; role: "signer" | "landlord" | "archive" }> = [];
    if (tenantEmail) recipients.push({ email: tenantEmail, role: "signer" });
    if (landlordEmail && landlordEmail !== tenantEmail) recipients.push({ email: landlordEmail, role: "landlord" });
    recipients.push({ email: ARCHIVE_EMAIL, role: "archive" });

    const results: Array<{ email: string; ok: boolean; error?: string }> = [];
    for (const r of recipients) {
      try {
        const { error } = await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "form-signed-copy",
            recipientEmail: r.email,
            idempotencyKey: `form-signed-${formId}-${r.role}`,
            templateData: { ...sharedData, recipientRole: r.role },
          },
        });
        results.push({ email: r.email, ok: !error, error: error?.message });
      } catch (e: any) {
        results.push({ email: r.email, ok: false, error: e?.message });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("notify-form-signed error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
