
-- Capture pages table
CREATE TABLE public.capture_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_image TEXT,
  listing_id UUID REFERENCES public.listings(id),
  form_fields JSONB NOT NULL DEFAULT '[{"name":"name","label":"Full Name","type":"text","required":true},{"name":"email","label":"Email","type":"email","required":true},{"name":"phone","label":"Phone","type":"tel","required":false},{"name":"message","label":"Message","type":"textarea","required":false}]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  view_count INTEGER NOT NULL DEFAULT 0,
  lead_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.capture_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own capture pages" ON public.capture_pages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own capture pages" ON public.capture_pages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own capture pages" ON public.capture_pages FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own capture pages" ON public.capture_pages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public can view active capture pages" ON public.capture_pages FOR SELECT TO anon USING (status = 'active');

CREATE TRIGGER update_capture_pages_updated_at BEFORE UPDATE ON public.capture_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Capture leads table
CREATE TABLE public.capture_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capture_page_id UUID NOT NULL REFERENCES public.capture_pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'direct',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.capture_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads" ON public.capture_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Page owners can view their leads" ON public.capture_leads FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.capture_pages cp WHERE cp.id = capture_page_id AND cp.user_id = auth.uid()));

-- User activity log for P8
CREATE TABLE public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  summary TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON public.user_activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own activity" ON public.user_activity_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_activity_user_created ON public.user_activity_log(user_id, created_at DESC);
CREATE INDEX idx_capture_pages_slug ON public.capture_pages(slug);
CREATE INDEX idx_capture_leads_page ON public.capture_leads(capture_page_id);
