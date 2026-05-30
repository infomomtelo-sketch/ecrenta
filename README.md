# ecrenta

Rental marketplace built with Lovable.

Cloudflare Pages uses the Vite `dist` output. The build script also copies
`dist/index.html` to `dist/404.html` so direct links like `/auth` and
`/dashboard` load the React app instead of returning a platform 404.
