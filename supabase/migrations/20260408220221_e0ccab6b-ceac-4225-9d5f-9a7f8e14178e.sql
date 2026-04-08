
-- Add SaaS columns to inspections
ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS template_type TEXT NOT NULL DEFAULT 'custom',
  ADD COLUMN IF NOT EXISTS comparison_id UUID REFERENCES public.inspections(id),
  ADD COLUMN IF NOT EXISTS checklist_data JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Public can view inspections by share token
CREATE POLICY "Public can view shared inspections"
  ON public.inspections FOR SELECT TO anon
  USING (share_token IS NOT NULL);

-- Inspection schedules for recurring inspections
CREATE TABLE public.inspection_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_address TEXT NOT NULL,
  listing_id UUID REFERENCES public.listings(id),
  interval_months INTEGER NOT NULL DEFAULT 12,
  next_due DATE NOT NULL,
  notify_email TEXT,
  notes TEXT,
  last_completed_id UUID REFERENCES public.inspections(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inspection_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own schedules"
  ON public.inspection_schedules FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own schedules"
  ON public.inspection_schedules FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON public.inspection_schedules FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON public.inspection_schedules FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_inspection_schedules_updated_at
  BEFORE UPDATE ON public.inspection_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
