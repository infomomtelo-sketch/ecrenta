
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS auth_user_id uuid,
  ADD COLUMN IF NOT EXISTS invite_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS invited_at timestamptz,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_tenants_auth_user_id ON public.tenants(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_invite_token ON public.tenants(invite_token);

GRANT SELECT ON public.tenants TO anon;

-- Helper: get the tenant record id linked to the current user
CREATE OR REPLACE FUNCTION public.get_my_tenant_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.tenants WHERE auth_user_id = auth.uid() LIMIT 1
$$;

-- Tenant can view their own tenant row
CREATE POLICY "Tenant can view own tenant record"
ON public.tenants FOR SELECT TO authenticated
USING (auth_user_id = auth.uid());

-- Public can look up tenant row by invite token (for accept-invite page)
CREATE POLICY "Public can view tenant by invite token"
ON public.tenants FOR SELECT TO anon, authenticated
USING (invite_token IS NOT NULL AND accepted_at IS NULL);

-- Authenticated user can accept an invite (link account to tenant row)
CREATE POLICY "Authenticated can accept tenant invite"
ON public.tenants FOR UPDATE TO authenticated
USING (invite_token IS NOT NULL AND accepted_at IS NULL)
WITH CHECK (auth_user_id = auth.uid());

-- Tenant can view rent payment requests addressed to them (read-only)
CREATE POLICY "Tenant can view own rent requests"
ON public.rent_payment_requests FOR SELECT TO authenticated
USING (tenant_id = public.get_my_tenant_id());
