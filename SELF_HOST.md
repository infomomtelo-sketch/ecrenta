# Self-Hosting Guide

This app is designed to run anywhere — Lovable, Cloudflare Pages, Vercel, your own server. Zero vendor lock-in.

## What You Need

1. **A Supabase project** (free tier works) — https://supabase.com
2. **An Anthropic API key** — https://console.anthropic.com
3. **A hosting platform** — Cloudflare Pages (recommended), Vercel, Netlify, or any static host
4. **A Stripe account** (only if using payments) — https://stripe.com

## Migration Steps

### 1. Get the code
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
npm install
```

### 2. Set up your own Supabase
1. Create a new Supabase project at https://supabase.com
2. In the Supabase SQL Editor, run every migration under `supabase/migrations/` in order.
3. Copy the project URL + anon (publishable) key from Project Settings -> API.

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your own values:
```bash
cp .env.example .env
```

### 4. Deploy edge functions
Install the Supabase CLI (`npm install -g supabase`), then:
```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase functions deploy
```

### 5. Files to swap when leaving Lovable
- `src/integrations/supabase/client.ts` — auto-generated here; on self-host, replace with:
  ```ts
  import { createClient } from "@supabase/supabase-js";
  export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  );
  ```
- `supabase/config.toml` — delete and run `supabase init` fresh.

### 6. Deploy the frontend
**Cloudflare Pages:**
- Build command: `npm run build`
- Build output: `dist`
- Environment variables: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

**Vercel / Netlify:** same settings — they auto-detect Vite.

## What Uses What

| Feature | Provider | Key Required |
|---|---|---|
| Database, auth, storage, edge functions | Supabase (yours) | `VITE_SUPABASE_*` |
| AI chat + inspection vision | Anthropic Claude | `ANTHROPIC_API_KEY` |
| Payments | Stripe | `STRIPE_SECRET_KEY` |
| Listing scraping | Firecrawl (optional) | `FIRECRAWL_API_KEY` |
| SMS marketplace (Sprint 3) | Twilio | `TWILIO_*` |
| Email | Resend / your SMTP | `RESEND_API_KEY` |

**No Lovable services are called at runtime.** The app talks directly to Anthropic, Stripe, and your own Supabase.

## Google OAuth (your own client)

To use your own Google OAuth branding instead of the shared credentials:
1. Google Cloud Console -> APIs & Credentials -> Create OAuth Client ID (Web application)
2. Add authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. In your Supabase dashboard -> Authentication -> Providers -> Google: paste your Client ID + Secret.

## Support

Every piece of infrastructure here is standard open-source or standard SaaS. If something breaks, the fix is in the provider's docs, not in a proprietary layer.
