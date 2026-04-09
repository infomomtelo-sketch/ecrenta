
CREATE TABLE public.property_owner_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  property_address TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.property_owner_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads"
  ON public.property_owner_leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leads"
  ON public.property_owner_leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON public.property_owner_leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON public.property_owner_leads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_property_owner_leads_updated_at
  BEFORE UPDATE ON public.property_owner_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
