const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const BodySchema = z.object({
  url: z.string().url().max(2048),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { url } = parsed.data
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Detect source from URL
    let source = 'other'
    if (url.includes('zillow.com')) source = 'zillow'
    else if (url.includes('craigslist.org')) source = 'craigslist'
    else if (url.includes('apartments.com')) source = 'apartments.com'
    else if (url.includes('realtor.com')) source = 'realtor.com'
    else if (url.includes('trulia.com')) source = 'trulia'
    else if (url.includes('redfin.com')) source = 'redfin'

    // Scrape the listing page with structured JSON extraction
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: [
          'markdown',
          'screenshot',
          {
            type: 'json',
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Property title or headline' },
                price: { type: 'number', description: 'Monthly rent price in dollars (number only, no currency symbols)' },
                address: { type: 'string', description: 'Full street address including city, state, zip' },
                bedrooms: { type: 'number', description: 'Number of bedrooms' },
                bathrooms: { type: 'number', description: 'Number of bathrooms' },
                sqft: { type: 'number', description: 'Square footage' },
                description: { type: 'string', description: 'Property description text' },
                images: { type: 'array', items: { type: 'string' }, description: 'Array of image URLs' },
                landlord_name: { type: 'string', description: 'Property manager, landlord, or company name' },
              },
              required: ['title', 'price', 'address'],
            },
          },
        ],
        onlyMainContent: true,
      }),
    })

    const scrapeData = await scrapeResponse.json()

    if (!scrapeResponse.ok) {
      console.error('Firecrawl error:', scrapeData)
      return new Response(
        JSON.stringify({ success: false, error: scrapeData.error || `Scrape failed (${scrapeResponse.status})` }),
        { status: scrapeResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract the JSON data from the response
    const extracted = scrapeData?.data?.json || scrapeData?.json || {}
    const screenshot = scrapeData?.data?.screenshot || scrapeData?.screenshot

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...extracted,
          price: extracted.price ? Math.round(Number(extracted.price)) : 0,
          bedrooms: extracted.bedrooms ? Number(extracted.bedrooms) : 0,
          bathrooms: extracted.bathrooms ? Number(extracted.bathrooms) : 1,
          sqft: extracted.sqft ? Number(extracted.sqft) : 0,
          images: Array.isArray(extracted.images) ? extracted.images.filter((u: string) => u?.startsWith('http')) : [],
          source,
          source_url: url,
          screenshot,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
