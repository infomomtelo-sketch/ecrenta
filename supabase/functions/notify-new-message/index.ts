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

    const { data: conv } = await admin
      .from('conversations')
      .select('id, tenant_name, listing_id, tenant_user_id, landlord_user_id')
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
      .select('id, text, sender_id, sender_user_id')
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

    // Determine recipient = the OTHER participant
    const senderIsTenant = senderRole === 'tenant'
    const recipientUserId = senderIsTenant ? conv.landlord_user_id : conv.tenant_user_id

    if (!recipientUserId) {
      return new Response(JSON.stringify({ skipped: 'no recipient user' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: recipientInfo, error: recErr } = await admin.auth.admin.getUserById(recipientUserId)
    if (recErr || !recipientInfo?.user?.email) {
      return new Response(JSON.stringify({ skipped: 'no recipient email' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const recipientEmail = recipientInfo.user.email
    const recipientMeta = (recipientInfo.user.user_metadata as any) || {}
    const recipientName =
      recipientMeta.full_name ||
      recipientMeta.name ||
      (senderIsTenant ? listing.landlord_name : conv.tenant_name) ||
      undefined

    // Sender display name
    let senderName: string | undefined
    if (senderIsTenant) {
      senderName = conv.tenant_name || 'A tenant'
    } else {
      // Landlord sender - pull their name
      if (msg.sender_user_id) {
        const { data: senderInfo } = await admin.auth.admin.getUserById(msg.sender_user_id)
        const sMeta = (senderInfo?.user?.user_metadata as any) || {}
        senderName = sMeta.full_name || sMeta.name || listing.landlord_name || 'The landlord'
      } else {
        senderName = listing.landlord_name || 'The landlord'
      }
    }

    const origin = req.headers.get('origin') || 'https://ecrenta.space'
    const chatUrl = `${origin}/inbox?conv=${conversationId}`

    const { error: invokeErr } = await admin.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'new-chat-message',
        recipientEmail,
        idempotencyKey: `new-msg-${messageId}`,
        templateData: {
          recipientName,
          senderName,
          senderRole,
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

    // Internal admin copy (only for tenant-initiated messages to avoid noise)
    if (senderIsTenant) {
      await admin.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'internal-notification',
          recipientEmail: 'infomomtelo@gmail.com',
          idempotencyKey: `new-msg-admin-${messageId}`,
          templateData: {
            eventType: 'New chat message',
            title: `${senderName} → ${listing.title}`,
            summaryLines: [
              `Tenant: ${conv.tenant_name || 'Anonymous'}`,
              `Listing: ${listing.title}`,
              `Landlord: ${recipientName || recipientEmail}`,
            ],
            message: msg.text,
            actionUrl: chatUrl,
            actionLabel: 'Open conversation',
          },
        },
      })
    }

    return new Response(JSON.stringify({ ok: true, notified: recipientEmail }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
