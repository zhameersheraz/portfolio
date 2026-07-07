# Portfolio

Personal portfolio site for **Zhameer Sheraz U. Tampugao**.

Built with Next.js 15, TypeScript, Tailwind CSS, React Three Fiber.
Backend runs on Next.js API routes — contact form (Resend), live GitHub
stats, and a view counter, all in the same project.

## Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS, CSS variables, system fonts
- **3D:** React Three Fiber + drei (wireframe icosahedron + particle field)
- **Forms:** react-hook-form + zod
- **Backend:** Next.js Route Handlers (Node runtime)
- **Email:** Resend (optional; logs to stdout in dev)

## Quickstart

```bash
npm install
cp .env.example .env.local   # then fill in keys (optional)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable                | Required | Purpose                                            |
| ----------------------- | -------- | -------------------------------------------------- |
| `GITHUB_TOKEN`          | No       | Bumps GitHub API rate limit from 60 → 5000 req/hr  |
| `RESEND_API_KEY`        | No       | Enables real email send on the contact form        |
| `CONTACT_FROM_EMAIL`    | No       | Sender shown in the email                          |
| `CONTACT_TO_EMAIL`      | No       | Where messages land (default: owner email)        |
| `NEXT_PUBLIC_SITE_URL`  | No       | Used for OG / sitemap absolute URLs                |

Everything works in dev without keys — contact form logs to stdout, GitHub
data uses the public unauthenticated API.

## API

| Method | Path                | Purpose                                             |
| ------ | ------------------- | --------------------------------------------------- |
| POST   | `/api/contact`      | Validate + forward contact form to email            |
| GET    | `/api/github?repo=` | Repo stats (stars, forks, language, pushed_at)      |
| GET    | `/api/github?user=` | List of public repos for a user                     |
| GET    | `/api/stats`        | Aggregated GitHub stats for the portfolio owner     |
| GET    | `/api/views?slug=`  | Read view counter for a project slug                |
| POST   | `/api/views`        | Increment view counter for a project slug           |

All routes are rate-limited per IP.

## Deploy

See [DEPLOY.md](./DEPLOY.md) for a one-click Vercel deploy + GitHub Pages fallback.

## License

MIT — see [LICENSE](./LICENSE).