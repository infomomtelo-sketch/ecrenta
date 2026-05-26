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

    // Detect source from URL and pick an extraction strategy.
    // - "structured": sites that render listing data server-side and behave well
    //   with onlyMainContent + JSON extraction (most major US portals).
    // - "dynamic": JS-heavy or aggressively bot-protected sites that need the
    //   browser to wait for content before extraction.
    // - "classified": text-first classifieds where the description IS the listing
    //   and structured fields are unreliable; we keep full page content.
    const sourceMap: Array<{ match: RegExp; source: string; strategy: 'structured' | 'dynamic' | 'classified' }> = [
      // Major US portals — structured
      { match: /(^|\.)zillow\.com/i, source: 'zillow', strategy: 'structured' },
      { match: /(^|\.)trulia\.com/i, source: 'trulia', strategy: 'structured' },
      { match: /(^|\.)redfin\.com/i, source: 'redfin', strategy: 'structured' },
      { match: /(^|\.)realtor\.com/i, source: 'realtor.com', strategy: 'structured' },
      { match: /(^|\.)apartments\.com/i, source: 'apartments.com', strategy: 'structured' },
      { match: /(^|\.)apartmentguide\.com/i, source: 'apartmentguide', strategy: 'structured' },
      { match: /(^|\.)rent\.com/i, source: 'rent.com', strategy: 'structured' },
      { match: /(^|\.)rentals\.com/i, source: 'rentals.com', strategy: 'structured' },
      { match: /(^|\.)hotpads\.com/i, source: 'hotpads', strategy: 'structured' },
      { match: /(^|\.)padmapper\.com/i, source: 'padmapper', strategy: 'structured' },
      { match: /(^|\.)homes\.com/i, source: 'homes.com', strategy: 'structured' },
      { match: /(^|\.)movoto\.com/i, source: 'movoto', strategy: 'structured' },
      { match: /(^|\.)compass\.com/i, source: 'compass', strategy: 'structured' },
      { match: /(^|\.)coldwellbanker\.com/i, source: 'coldwell-banker', strategy: 'structured' },
      { match: /(^|\.)century21\.com/i, source: 'century21', strategy: 'structured' },
      { match: /(^|\.)remax\.com/i, source: 'remax', strategy: 'structured' },
      { match: /(^|\.)berkshirehathawayhs\.com/i, source: 'bhhs', strategy: 'structured' },
      { match: /(^|\.)kw\.com/i, source: 'keller-williams', strategy: 'structured' },
      { match: /(^|\.)forrent\.com/i, source: 'forrent', strategy: 'structured' },
      { match: /(^|\.)rentcafe\.com/i, source: 'rentcafe', strategy: 'structured' },
      { match: /(^|\.)zumper\.com/i, source: 'zumper', strategy: 'structured' },

      // International — structured
      { match: /(^|\.)rightmove\.co\.uk/i, source: 'rightmove', strategy: 'structured' },
      { match: /(^|\.)zoopla\.co\.uk/i, source: 'zoopla', strategy: 'structured' },
      { match: /(^|\.)onthemarket\.com/i, source: 'onthemarket', strategy: 'structured' },
      { match: /(^|\.)realestate\.com\.au/i, source: 'realestate.com.au', strategy: 'structured' },
      { match: /(^|\.)domain\.com\.au/i, source: 'domain', strategy: 'structured' },
      { match: /(^|\.)realtor\.ca/i, source: 'realtor.ca', strategy: 'structured' },
      { match: /(^|\.)idealista\.com/i, source: 'idealista', strategy: 'structured' },
      { match: /(^|\.)immobilienscout24\.de/i, source: 'immoscout24', strategy: 'structured' },
      { match: /(^|\.)seloger\.com/i, source: 'seloger', strategy: 'structured' },
      { match: /(^|\.)leboncoin\.fr/i, source: 'leboncoin', strategy: 'dynamic' },

      // Dynamic / JS-heavy — need waitFor
      { match: /(^|\.)airbnb\.[a-z.]+/i, source: 'airbnb', strategy: 'dynamic' },
      { match: /(^|\.)vrbo\.com/i, source: 'vrbo', strategy: 'dynamic' },
      { match: /(^|\.)booking\.com/i, source: 'booking', strategy: 'dynamic' },
      { match: /(^|\.)facebook\.com\/marketplace/i, source: 'facebook-marketplace', strategy: 'dynamic' },

      // Classifieds — text-first
      { match: /(^|\.)craigslist\.org/i, source: 'craigslist', strategy: 'classified' },
      { match: /(^|\.)kijiji\.ca/i, source: 'kijiji', strategy: 'classified' },
      { match: /(^|\.)gumtree\.com/i, source: 'gumtree', strategy: 'classified' },
      { match: /(^|\.)offerup\.com/i, source: 'offerup', strategy: 'classified' },
    ]

    const matched = sourceMap.find((s) => s.match.test(url))
    const source = matched?.source ?? 'other'
    const strategy = matched?.strategy ?? 'structured'

    // Scrape the listing page with structured JSON extraction
    // Strategy-specific extraction config
    const jsonSchema = {
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
    }

    const formats: unknown[] = ['markdown', 'screenshot', { type: 'json', schema: jsonSchema }]

    // Classifieds: also pull links (often image gallery / contact); keep full page content.
    if (strategy === 'classified') {
      formats.push('links')
    }

    const scrapePayload: Record<string, unknown> = {
      url,
      formats,
      // Classifieds bury the listing in the main body — don't trim it.
      onlyMainContent: strategy !== 'classified',
    }

    // Dynamic sites need to wait for client-side rendering before extraction.
    if (strategy === 'dynamic') {
      scrapePayload.waitFor = 3500
    }

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scrapePayload),
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
          strategy,
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
