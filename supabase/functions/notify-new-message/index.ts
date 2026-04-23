import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2.95.0/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messageId, conversationId, senderRole } = await req.json()
    if (!messageId || !conversationId || !senderRole) {
      return new Response(JSON.stringify({ error: 'missing fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(supabaseUrl, serviceKey)

    // Load conversation + message + listing
    const { data: conv } = await admin
      .from('conversations')
      .select('id, tenant_name, listing_id')
      .eq('id', conversationId)
      .single()
    if (!conv) {
      return new Response(JSON.stringify({ error: 'conversation not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: msg } = await admin
      .from('messages')
      .select('id, text, sender_id')
      .eq('id', messageId)
      .single()
    if (!msg) {
      return new Response(JSON.stringify({ error: 'message not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: listing } = await admin
      .from('listings')
      .select('id, title, user_id, landlord_name')
      .eq('id', conv.listing_id)
      .single()
    if (!listing) {
      return new Response(JSON.stringify({ error: 'listing not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Only notify the landlord (listing owner) when the tenant sends.
    // Tenants are anonymous in this app, so we don't notify them when landlord replies.
    if (senderRole !== 'tenant') {
      return new Response(JSON.stringify({ skipped: 'sender is not tenant' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!listing.user_id) {
      return new Response(JSON.stringify({ skipped: 'listing has no owner' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: userInfo, error: userErr } = await admin.auth.admin.getUserById(listing.user_id)
    if (userErr || !userInfo?.user?.email) {
      return new Response(JSON.stringify({ skipped: 'no recipient email' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const recipientEmail = userInfo.user.email
    const recipientName =
      (userInfo.user.user_metadata as any)?.full_name ||
      (userInfo.user.user_metadata as any)?.name ||
      listing.landlord_name ||
      undefined

    const origin = req.headers.get('origin') || 'https://ecrenta.space'
    const chatUrl = `${origin}/inbox?conv=${conversationId}`

    const { error: invokeErr } = await admin.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'new-chat-message',
        recipientEmail,
        idempotencyKey: `new-msg-${messageId}`,
        templateData: {
          recipientName,
          senderName: conv.tenant_name || 'A tenant',
          senderRole: 'tenant',
          listingTitle: listing.title,
          messageText: msg.text,
          chatUrl,
        },
      },
    })

    if (invokeErr) {
      return new Response(JSON.stringify({ error: invokeErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
