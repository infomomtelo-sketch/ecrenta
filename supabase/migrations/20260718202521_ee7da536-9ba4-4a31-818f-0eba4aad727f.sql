
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS access_granted BOOLEAN NOT NULL DEFAULT false;

-- Grant access to the first (existing) user and make them admin
UPDATE public.profiles SET access_granted = true;

INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Allow admins to update any profile's access flag
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles (for admin panel)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);
