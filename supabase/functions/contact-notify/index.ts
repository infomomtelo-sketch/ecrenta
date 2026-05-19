import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOTIFY_EMAIL = "infomomtelo@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { name, email, message } = await req.json();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await admin.functions.invoke("send-transactional-email", {
      body: {
        templateName: "internal-notification",
        recipientEmail: NOTIFY_EMAIL,
        idempotencyKey: `contact-notify-${email}-${Date.now()}`,
        templateData: {
          eventType: "Contact form",
          title: `New message from ${name}`,
          summaryLines: [`Name: ${name}`, `Email: ${email}`],
          message,
        },
      },
    });

    if (error) console.error("send-transactional-email error:", error);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Contact notify error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
