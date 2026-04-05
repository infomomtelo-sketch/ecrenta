
CREATE TABLE public.p8_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New conversation',
  mode text NOT NULL DEFAULT 'va',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.p8_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own p8 conversations" ON public.p8_conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own p8 conversations" ON public.p8_conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own p8 conversations" ON public.p8_conversations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own p8 conversations" ON public.p8_conversations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_p8_conversations_updated_at
  BEFORE UPDATE ON public.p8_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
