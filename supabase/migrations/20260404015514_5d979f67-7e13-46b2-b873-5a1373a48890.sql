ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS source_url text,
ADD COLUMN IF NOT EXISTS external_id text;

CREATE UNIQUE INDEX IF NOT EXISTS listings_external_id_source_idx ON public.listings (external_id, source) WHERE external_id IS NOT NULL;