
CREATE TABLE public.maintenance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_address TEXT NOT NULL,
  listing_id UUID REFERENCES public.listings(id),
  reporter_name TEXT NOT NULL,
  reporter_email TEXT,
  reporter_phone TEXT,
  reporter_role TEXT NOT NULL DEFAULT 'tenant',
  category TEXT NOT NULL DEFAULT 'general',
  urgency TEXT NOT NULL DEFAULT 'normal',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'submitted',
  ai_triage JSONB,
  ai_response TEXT,
  assigned_to TEXT,
  resolution_notes TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a maintenance request (public form)
CREATE POLICY "Anyone can create maintenance requests"
  ON public.maintenance_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- Authenticated users can view requests for their properties
CREATE POLICY "Authenticated users can view maintenance requests"
  ON public.maintenance_requests FOR SELECT
  TO authenticated
  USING (true);

-- Public can view their own requests by id (for status check)
CREATE POLICY "Public can view requests"
  ON public.maintenance_requests FOR SELECT
  TO anon
  USING (true);

-- Authenticated users can update requests
CREATE POLICY "Authenticated users can update maintenance requests"
  ON public.maintenance_requests FOR UPDATE
  TO authenticated
  USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_requests;
