import { supabase } from "@/integrations/supabase/client";

type ActivityType =
  | "form_created" | "form_sent" | "form_signed"
  | "invoice_created" | "invoice_sent" | "invoice_paid"
  | "inspection_created" | "inspection_completed"
  | "tenant_added" | "tenant_updated"
  | "listing_created" | "listing_updated"
  | "maintenance_created" | "maintenance_resolved"
  | "capture_page_created" | "lead_received";

export async function logActivity(
  action_type: ActivityType,
  summary: string,
  opts?: { entity_type?: string; entity_id?: string; metadata?: Record<string, unknown> }
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_activity_log").insert({
    user_id: user.id,
    action_type,
    summary,
    entity_type: opts?.entity_type,
    entity_id: opts?.entity_id,
    metadata: opts?.metadata ?? {},
  });
}
