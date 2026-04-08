
-- Tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  unit_address TEXT,
  lease_start DATE,
  lease_end DATE,
  rent_amount INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tenants" ON public.tenants FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tenants" ON public.tenants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tenants" ON public.tenants FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tenants" ON public.tenants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Rental forms (lease agreements, move-in/out, custom)
CREATE TABLE public.rental_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  form_type TEXT NOT NULL DEFAULT 'lease_agreement',
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  sign_token TEXT UNIQUE,
  sent_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  signer_name TEXT,
  signer_ip TEXT,
  recipient_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.rental_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own forms" ON public.rental_forms FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own forms" ON public.rental_forms FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forms" ON public.rental_forms FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forms" ON public.rental_forms FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public can view forms by token" ON public.rental_forms FOR SELECT TO anon USING (sign_token IS NOT NULL);
CREATE POLICY "Public can sign forms by token" ON public.rental_forms FOR UPDATE TO anon USING (sign_token IS NOT NULL AND status = 'sent');

-- Invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount INTEGER NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  line_items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON public.invoices FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON public.invoices FOR DELETE TO authenticated USING (auth.uid() = user_id);
