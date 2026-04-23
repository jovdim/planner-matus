# JanVeil — Svadobný plánovač

React + Vite + Tailwind CSS wedding planner for JanVeil wedding salon.

Production build: **225 KB JS / 66 KB gzipped, 19 KB CSS / 4 KB gzipped.**

## Prerequisites

- Node.js 18+ (check: `node -v`)
- npm (comes with Node)
- Vercel account (free: https://vercel.com/signup)

## Quick start

```bash
# Install dependencies (first time only)
npm install

# Run locally
npm run dev
# → opens http://localhost:5173

# Production build (optional — to test locally before deploying)
npm run build
npm run preview
```

The full `JanVeilPlanner` component is already in `src/JanVeilPlanner.jsx`.
Nothing to paste. Just install and go.

## Deploy to Vercel

### Option A: CLI (fastest, ~60 seconds)

```bash
npm install -g vercel
vercel login
vercel          # preview deploy — gives you a URL immediately
vercel --prod   # promote to production
```

When it asks:
- Set up and deploy? **Y**
- Link to existing project? **N**
- Project name? **janveil-planner** (or whatever)
- Directory? **./** (just press enter)
- Override settings? **N** — Vercel auto-detects Vite from `vercel.json`

### Option B: Git + Vercel dashboard

1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new
3. Import the repo — Vercel auto-detects everything
4. Click Deploy. Done.

### Option C: Drag & drop

```bash
npm run build          # produces /dist
```

Then drag the `dist/` folder onto https://vercel.com/new — works but you
lose CI/CD. Not recommended long-term.

## Custom domain (planovac.janveil.sk)

After first deploy:

1. Vercel dashboard → your project → **Settings** → **Domains**
2. Add `planovac.janveil.sk`
3. Vercel shows you a DNS record to add:
   - Type: `CNAME`
   - Name: `planovac`
   - Value: `cname.vercel-dns.com`
4. Add it at your DNS provider (wherever janveil.sk is registered)
5. Wait 1–10 minutes. Vercel auto-provisions HTTPS.

## Project structure

```
janveil/
├── index.html              ← HTML entry point
├── package.json            ← dependencies
├── vite.config.js          ← Vite (bundler) config
├── tailwind.config.js      ← Tailwind CSS config
├── postcss.config.js       ← PostCSS config
├── vercel.json             ← Vercel deploy config
├── public/
│   └── favicon.svg         ← tab icon
└── src/
    ├── main.jsx            ← React bootstrap
    ├── index.css           ← Tailwind directives
    └── JanVeilPlanner.jsx  ← your full 1584-line component
```

## Troubleshooting

**"Module not found: xlsx" or "lucide-react"**
Run `npm install` again — dependencies didn't install cleanly.

**Blank page in production, works in dev**
Check the browser console. Usually this means a stale `dist/` — run
`npm run build` again, or on Vercel trigger a redeploy.

**Build is slow on Vercel (first time only)**
First build installs ~140 packages and compiles Tailwind. Subsequent
builds are cached and take ~20 seconds.

**Data doesn't persist between browser sessions**
The planner stores state in React only — no localStorage, no backend.
Users need to use the Export (JSON/Excel/PDF) or Share Link features to
keep their data. This is intentional: no account system, no tracking.
