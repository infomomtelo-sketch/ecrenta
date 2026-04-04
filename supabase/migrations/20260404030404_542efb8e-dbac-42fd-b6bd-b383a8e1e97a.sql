
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);

CREATE POLICY "Anyone can view listing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Users can delete their own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
