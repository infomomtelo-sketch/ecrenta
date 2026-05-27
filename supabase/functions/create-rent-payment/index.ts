import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("Not authenticated");

    const body = await req.json();
    const { tenantName, tenantEmail, amount, description, tenantId } = body;
    if (!tenantName || !amount) throw new Error("tenantName and amount are required");
    const cents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(cents) || cents < 100) throw new Error("Invalid amount");

    const { data: acct } = await supabaseAdmin
      .from("stripe_connect_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!acct?.stripe_account_id) throw new Error("Stripe account not connected");
    if (!acct.charges_enabled) throw new Error("Stripe account not fully onboarded");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: tenantEmail || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: cents,
              product_data: {
                name: description || `Rent payment — ${tenantName}`,
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          // No application fee — landlord keeps 100%, runp8 takes nothing per transaction
          application_fee_amount: 0,
        },
        success_url: `${origin}/rent-collection?paid=1`,
        cancel_url: `${origin}/rent-collection?cancelled=1`,
      },
      { stripeAccount: acct.stripe_account_id }
    );

    const { data: inserted } = await supabaseAdmin
      .from("rent_payment_requests")
      .insert({
        user_id: user.id,
        tenant_id: tenantId || null,
        tenant_name: tenantName,
        tenant_email: tenantEmail || null,
        amount: cents,
        description: description || null,
        stripe_session_id: session.id,
        stripe_payment_link_url: session.url,
        status: "pending",
      })
      .select()
      .single();

    return new Response(JSON.stringify({ url: session.url, request: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[CREATE-RENT-PAYMENT]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
