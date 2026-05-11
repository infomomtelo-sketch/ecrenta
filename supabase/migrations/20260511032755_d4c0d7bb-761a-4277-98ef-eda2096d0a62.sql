
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS tenant_user_id uuid,
  ADD COLUMN IF NOT EXISTS landlord_user_id uuid,
  ADD COLUMN IF NOT EXISTS last_message_text text,
  ADD COLUMN IF NOT EXISTS last_message_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS conversations_listing_tenant_unique
  ON public.conversations(listing_id, tenant_user_id)
  WHERE tenant_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS conversations_landlord_idx ON public.conversations(landlord_user_id);
CREATE INDEX IF NOT EXISTS conversations_tenant_idx ON public.conversations(tenant_user_id);

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS sender_user_id uuid,
  ADD COLUMN IF NOT EXISTS read_at timestamptz;
CREATE INDEX IF NOT EXISTS messages_conv_created_idx ON public.messages(conversation_id, created_at);

DROP POLICY IF EXISTS "Anyone can view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can update conversations" ON public.conversations;
DROP POLICY IF EXISTS "Participants can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Tenant can create conversation" ON public.conversations;
DROP POLICY IF EXISTS "Participants can update their conversations" ON public.conversations;

CREATE POLICY "Participants can view their conversations"
  ON public.conversations FOR SELECT TO authenticated
  USING (auth.uid() = tenant_user_id OR auth.uid() = landlord_user_id);
CREATE POLICY "Tenant can create conversation"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = tenant_user_id);
CREATE POLICY "Participants can update their conversations"
  ON public.conversations FOR UPDATE TO authenticated
  USING (auth.uid() = tenant_user_id OR auth.uid() = landlord_user_id);

DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can create messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can mark read" ON public.messages;

CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (auth.uid() = c.tenant_user_id OR auth.uid() = c.landlord_user_id)));
CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_user_id AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (auth.uid() = c.tenant_user_id OR auth.uid() = c.landlord_user_id)));
CREATE POLICY "Participants can mark read"
  ON public.messages FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (auth.uid() = c.tenant_user_id OR auth.uid() = c.landlord_user_id)));

CREATE OR REPLACE FUNCTION public.bump_conversation_on_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.conversations
     SET last_message_text = NEW.text,
         last_message_at = NEW.created_at,
         updated_at = NEW.created_at
   WHERE id = NEW.conversation_id;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS messages_bump_conversation ON public.messages;
CREATE TRIGGER messages_bump_conversation
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.bump_conversation_on_message();
