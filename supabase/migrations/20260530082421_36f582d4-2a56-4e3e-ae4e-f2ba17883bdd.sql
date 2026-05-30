CREATE POLICY "Owners can delete their listings"
ON public.listings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);