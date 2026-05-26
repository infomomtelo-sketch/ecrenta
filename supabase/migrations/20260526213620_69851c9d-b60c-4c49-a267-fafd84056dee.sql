
-- Add admin to app_role enum if missing
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='admin' AND enumtypid=(SELECT oid FROM pg_type WHERE typname='app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE 'admin';
  END IF;
END $$;

-- APPLICATIONS: lock down
DROP POLICY IF EXISTS "Anyone can view applications" ON public.applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON public.applications;

CREATE POLICY "Participants can view applications"
ON public.applications FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.listings l WHERE l.id = applications.listing_id AND l.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = applications.conversation_id AND c.tenant_user_id = auth.uid())
);

CREATE POLICY "Participants can update applications"
ON public.applications FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.listings l WHERE l.id = applications.listing_id AND l.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = applications.conversation_id AND c.tenant_user_id = auth.uid())
);

-- MAINTENANCE REQUESTS: lock down
DROP POLICY IF EXISTS "Authenticated users can view maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Authenticated users can update maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Public can view requests" ON public.maintenance_requests;

CREATE POLICY "Participants can view maintenance requests"
ON public.maintenance_requests FOR SELECT TO authenticated
USING (
  auth.uid() = user_id
  OR reporter_email = (auth.jwt() ->> 'email')
  OR EXISTS (SELECT 1 FROM public.listings l WHERE l.id = maintenance_requests.listing_id AND l.user_id = auth.uid())
);

CREATE POLICY "Landlords can update maintenance requests"
ON public.maintenance_requests FOR UPDATE TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.listings l WHERE l.id = maintenance_requests.listing_id AND l.user_id = auth.uid())
);

-- CONTACT MESSAGES: admin-only read
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Reattach conversation bump trigger
DROP TRIGGER IF EXISTS bump_conv_on_message ON public.messages;
CREATE TRIGGER bump_conv_on_message
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_conversation_on_message();
