DROP POLICY IF EXISTS "Participants can update applications" ON public.applications;

CREATE POLICY "Landlord can update applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.listings l
  WHERE l.id = applications.listing_id AND l.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.listings l
  WHERE l.id = applications.listing_id AND l.user_id = auth.uid()
));

CREATE POLICY "Tenant can update own application notes"
ON public.applications
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.conversations c
  WHERE c.id = applications.conversation_id AND c.tenant_user_id = auth.uid()
))
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = applications.conversation_id AND c.tenant_user_id = auth.uid()
  )
  AND status = (SELECT status FROM public.applications WHERE id = applications.id)
);