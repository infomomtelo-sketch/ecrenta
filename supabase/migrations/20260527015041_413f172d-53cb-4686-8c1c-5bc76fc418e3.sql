
CREATE TABLE public.stripe_connect_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  stripe_account_id TEXT NOT NULL,
  charges_enabled BOOLEAN NOT NULL DEFAULT false,
  payouts_enabled BOOLEAN NOT NULL DEFAULT false,
  details_submitted BOOLEAN NOT NULL DEFAULT false,
  country TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stripe_connect_accounts TO authenticated;
GRANT ALL ON public.stripe_connect_accounts TO service_role;

ALTER TABLE public.stripe_connect_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own connect account"
ON public.stripe_connect_accounts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own connect account"
ON public.stripe_connect_accounts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own connect account"
ON public.stripe_connect_accounts FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own connect account"
ON public.stripe_connect_accounts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_stripe_connect_updated_at
BEFORE UPDATE ON public.stripe_connect_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.rent_payment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  amount INTEGER NOT NULL,
  description TEXT,
  stripe_payment_link_id TEXT,
  stripe_payment_link_url TEXT,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rent_payment_requests TO authenticated;
GRANT ALL ON public.rent_payment_requests TO service_role;

ALTER TABLE public.rent_payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlord view own rent requests"
ON public.rent_payment_requests FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Landlord create rent requests"
ON public.rent_payment_requests FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Landlord update own rent requests"
ON public.rent_payment_requests FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Landlord delete own rent requests"
ON public.rent_payment_requests FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_rent_requests_updated_at
BEFORE UPDATE ON public.rent_payment_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
