# portfolio

My personal site. Notes, writeups, and the small things I build while I'm
learning security.

Live: [zham-ctf-portfolio-luqr5fnfv.vercel.app](https://zham-ctf-portfolio-luqr5fnfv.vercel.app)

## What's on it

- Home page with a typing role animation and a small 3D wireframe scene
- About page at `/about` with my photo and what I'm focused on right now
- Project cards that pull live star, fork, and last-push stats from the GitHub API
- Writeups section linking out to my CTF repos on picoCTF, TryHackMe, and CyberTalents
- Contact form that sends to my email when an API key is configured, and just logs to stdout otherwise

## Stack

Next.js 15 (App Router) and TypeScript. Tailwind for styling. React Three Fiber
for the hero scene. The contact form, GitHub stats, and view counter all live
in Next.js Route Handlers, so the backend is in the same project.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in any keys you want to use
npm run dev
```

Open http://localhost:3000.

## Environment variables

All optional. The site works without any of them.

| Variable | What it does |
| --- | --- |
| `GITHUB_TOKEN` | Bumps GitHub API rate limit from 60 to 5000 req/hr |
| `RESEND_API_KEY` | Turns on real email sending for the contact form |
| `CONTACT_FROM_EMAIL` | Sender shown in the email |
| `CONTACT_TO_EMAIL` | Where contact-form messages land (default: owner email) |
| `NEXT_PUBLIC_SITE_URL` | Used for OG image and sitemap absolute URLs |

## API routes

| Method | Path | What it does |
| --- | --- | --- |
| POST | `/api/contact` | Validate + forward contact form to email |
| GET  | `/api/github?repo=` | Repo stats (stars, forks, language, pushed_at) |
| GET  | `/api/github?user=` | List public repos for a user |
| GET  | `/api/stats` | Aggregated GitHub stats for the owner |
| GET  | `/api/views?slug=` | Read view counter for a project slug |
| POST | `/api/views` | Increment view counter for a project slug |

All routes are rate-limited per IP.

## Deploy

Pushed to `main` -> Vercel builds and deploys automatically. No extra config.

## License

MIT. See [LICENSE](./LICENSE).