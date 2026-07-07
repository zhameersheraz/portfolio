# Deploy

## Vercel (recommended)

1. Push to GitHub
2. Import repo on [vercel.com/new](https://vercel.com/new)
3. Set environment variables:
   - `RESEND_API_KEY` (optional)
   - `CONTACT_FROM_EMAIL` (optional)
   - `CONTACT_TO_EMAIL` (optional)
   - `GITHUB_TOKEN` (optional, improves rate limits)
4. Deploy.

That's it. The contact form, GitHub stats, view counter, and 3D scene all work out of the box.

## Custom domain

In Vercel → Project → Settings → Domains, add your domain and follow the DNS instructions.
Then set `NEXT_PUBLIC_SITE_URL` to the production URL so OG images and sitemap use it.

## GitHub Pages (static-only fallback)

The contact form, view counter, and live GitHub stats won't work on pure static hosting,
but you can still deploy the static export:

```bash
# in next.config.ts, add:
#   output: "export"
#   images: { unoptimized: true }

npm run build
# Upload the contents of ./out to your gh-pages branch
```

For full functionality, use Vercel.

## Self-host with Docker (advanced)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env.local portfolio
```