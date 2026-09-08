<p align="center">
  <img src="public/og.jpg" alt="Halden — The quiet work of feeling well again" width="100%">
</p>

<h1 align="center">Halden</h1>

<p align="center">
  <strong>The quiet work of feeling well again.</strong><br>
  A private health coaching studio platform — built for the 24-client practice that refuses to scale past the quality of its attention.
</p>

<p align="center">
  <a href="https://health-coaches.vercel.app/">Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#deploy">Deploy</a>
</p>

---

## Why Halden Exists

Most health platforms are funnels. Halden is a room.

It's built for the coach who reads every check-in, who notices when a client's Tuesday starts to slip, who refuses to replace attention with automation. The platform does one thing: make that relationship sustainable — for 24 people, not 24,000.

> *"Most people do not need more information. They need a week that can hold, and someone who notices when it does not."*
> — Aria Halden, principal coach

---

## Live Demo

**[Open the Studio →](https://health-coaches.vercel.app/)**

| Portal | URL | Credentials |
|--------|-----|------------|
| Marketing site | [health-coaches.vercel.app](https://health-coaches.vercel.app/) | Public — no sign-in required |
| Client portal | [/app](https://health-coaches.vercel.app/app) | Sign in with email — seeds demo data on first access |
| Coach studio | [/studio](https://health-coaches.vercel.app/studio) | Same account — studio view seeded automatically |

---

## Features

### For the Coach

| Feature | What It Does |
|---------|-------------|
| **Client Overview** | At-risk detection, energy/sleep tracking, pending check-ins — all in one view |
| **Check-in Inbox** | Weekly client submissions with AI-drafted reply suggestions (via xAI Grok) |
| **Studio Notes** | Per-client coaching notes, private to the studio |
| **Calendar** | Appointment scheduling with consult, session, and intensive types |

### For the Client

| Feature | What It Does |
|---------|-------------|
| **Today Dashboard** | Daily habits, goals, next session, latest coach message — the day at a glance |
| **Habit Tracker** | 14-day grid view, tap-to-log, visual streaks |
| **Weekly Plan** | Day-by-day structure with toggle completion |
| **Check-ins** | Energy/sleep/mood scales + free-text weekly letter to the coach |
| **Messages** | Direct thread with the coach — no chatbot, no queue |
| **Resources** | Curated guides, audio, and notes — bookmarkable |
| **Progress** | Goal tracking, check-in history, habit heatmap |

### For the Business

| Feature | What It Does |
|---------|-------------|
| **Assessment** | 8-question lifestyle quiz → AI-personalized program recommendation |
| **Booking** | Service selection → day/time picker → instant confirmation |
| **Three Programs** | Foundation (12wk), Continuum (monthly), Private Studio (6mo) |
| **Auth** | OAuth (Google, X) via Grok broker + email/password — or disable for demo |
| **PWA** | Installable on iOS/Android with offline-ready shell |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Halden Platform                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Marketing │  │  Client  │  │ Coach Studio     │  │
│  │   Site    │  │  Portal  │  │                  │  │
│  │          │  │          │  │  ┌────────────┐  │  │
│  │ • Home   │  │ • Today  │  │  │  Clients   │  │  │
│  │ • About  │  │ • Habits │  │  │  Check-ins │  │  │
│  │ • Progs  │  │ • Plan   │  │  │  Calendar  │  │  │
│  │ • Stories│  │ • Check  │  │  │  Messages  │  │  │
│  │ • Journal│  │ • Message│  │  └────────────┘  │  │
│  │ • Book   │  │ • Resrc  │  │                  │  │
│  │ • Assess │  │ • Prog   │  │  AI Drafts (xAI) │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                  │             │
│  ┌────▼──────────────▼──────────────────▼─────────┐  │
│  │          TanStack Start (SSR + RSC)            │  │
│  │     Server Functions · React Query · Router    │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                              │
│  ┌────────────────────▼───────────────────────────┐  │
│  │              Auth Layer (Better Auth)           │  │
│  │  OAuth (Grok Broker) · Email/Password · Bearer │  │
│  │  __Host- Cookies · Session Cache · Gate Logic  │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                              │
│  ┌────────────────────▼───────────────────────────┐  │
│  │            Database (Dual-Mode Postgres)        │  │
│  │  ┌─────────┐           ┌──────────────────┐   │  │
│  │  │ PGLite  │  ←swap→   │  Neon (Vercel)   │   │  │
│  │  │ (WASM)  │           │  (Serverless PG)  │   │  │
│  │  └─────────┘           └──────────────────┘   │  │
│  │  Migrations: *.sql · Auto-applied · Tracked   │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | [TanStack Start](https://tanstack.com/start) | SSR, server functions, file-based routing — no API layer to maintain |
| **UI** | React 19 + Tailwind v4 | Server components, streaming, utility-first with custom design tokens |
| **Auth** | [Better Auth](https://www.better-auth.com/) | Self-hosted, OAuth federation, session caching, `__Host-` cookie security |
| **Database** | PGLite (dev) ↔ Neon (prod) | Zero-config local Postgres in preview; serverless in production — same schema, same queries |
| **AI** | [xAI Grok](https://docs.x.ai) | Assessment personalization + coach reply drafts — user-initiated, capped, no mock responses |
| **State** | TanStack Query + Zustand | Server state cached, client state minimal — no Redux, no context prop drilling |
| **Forms** | React Hook Form + Zod | Type-safe validation, minimal re-renders |
| **Deploy** | [Vercel](https://vercel.com) (via Nitro) | Edge functions, automatic previews, zero-config |

### Design System

Custom tokens built on Tailwind v4's `@theme` — no Tailwind config file, no design token JSON:

| Token | Value | Usage |
|-------|-------|-------|
| `paper` | `#f2ede3` | Warm off-white background |
| `sage` | `#31483e` | Primary — buttons, links, active states |
| `moss` | `#5c7266` | Secondary — labels, subtle accents |
| `ink` | `#1b1914` | Primary text |
| `surface` | `#faf7f1` | Cards, elevated containers |
| `line` | `#ddd4c4` | Borders, dividers |

Typography: **Fraunces** (display) + **Outfit** (body). Grain texture overlay. Reduced-motion support.

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install

```bash
git clone https://github.com/Ismail-Khan-Dev/health-coaches.git
cd health-coaches
npm install
```

### Run

```bash
npm run dev
```

The app starts on `http://localhost:8080`. No database configuration needed — PGLite runs in-browser via WASM.

### Auth (Optional)

By default, auth is **disabled** (dev user mode). To enable real sign-in:

1. Set `VITE_AUTH_ENABLED=true` in `.grok/app-env.json`
2. Configure `GROK_AUTH_CLIENT_ID` and `GROK_AUTH_CLIENT_SECRET` for OAuth
3. Or enable email/password in `src/lib/auth/email-password.ts`

### Database (Optional)

The app works with zero config (PGLite fallback). To use Neon:

```bash
# Set your Neon connection string
export DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/halden"
```

Migrations apply automatically on startup.

---

## Project Structure

```
health-coaches/
├── src/
│   ├── components/
│   │   ├── app/            # App shell (sidebar, mobile nav)
│   │   ├── marketing/      # Site header, footer, shell
│   │   └── ui/             # Button, Input, Badge (Radix primitives)
│   ├── lib/
│   │   ├── auth/           # Better Auth client/server, middleware, gates
│   │   ├── server/         # Server functions (client-fns, studio-fns, ai-fns)
│   │   ├── app-data/       # Platform connector data layer
│   │   └── og/             # Open Graph site config
│   ├── routes/
│   │   ├── app/            # Client portal (9 pages)
│   │   ├── studio/         # Coach workspace (6 pages)
│   │   ├── journal/        # Blog articles
│   │   ├── programs/       # Program detail pages
│   │   └── stories/        # Client testimonials
│   ├── router.tsx          # TanStack Router config
│   └── styles.css          # Tailwind + custom theme
├── migrations/
│   ├── 0001_auth.sql       # Better Auth schema
│   └── 0002_halden.sql     # App tables (12 tables)
├── scripts/                # Build tools, PWA plugin, browser QA
├── server/                 # Nitro middleware
└── public/                 # Static assets, images, favicon
```

---

## Key Decisions

### Why not Next.js?

TanStack Start gives us server functions without an API layer. No `route.ts` files, no `fetch()` calls, no serialization boundaries. A server function is just a function that runs on the server — the framework handles the transport.

### Why self-hosted auth?

Better Auth runs at `/api/auth/*` on the same origin. No third-party auth service, no webhook relay, no middleware edge function. The session cookie stays first-party. The Grok auth broker handles OAuth federation — this app only holds its own client credentials.

### Why PGLite + Neon?

Preview environments can't reach a Neon database. PGLite (Postgres compiled to WASM) gives us a real Postgres instance in the browser — same SQL dialect, same migrations, same query behavior. Set `DATABASE_URL` and it swaps to Neon with zero code changes.

### Why 24 clients?

That's not a marketing number. It's the cognitive limit for one coach who reads every check-in personally. The platform enforces it — there's no "upgrade to pro" tier. Attention is the product.

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server on `:8080` |
| `npm run build` | Production build + migration apply |
| `npm run preview` | Serve production build on `:8081` |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run test` | Run test suites |
| `npm run format` | Prettier formatting |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | No | Neon Postgres connection string (falls back to PGLite) |
| `VITE_AUTH_ENABLED` | No | `"false"` to disable auth (default: dev user mode) |
| `XAI_API_KEY` | No | xAI API key for AI assessment/reply drafts |
| `BETTER_AUTH_SECRET` | No | Session signing secret (auto-generated in preview) |
| `GROK_AUTH_CLIENT_ID` | No | OAuth client ID for Grok auth broker |
| `GROK_AUTH_CLIENT_SECRET` | No | OAuth client secret for Grok auth broker |

---

## License

Private — All rights reserved.

---

<p align="center">
  Built with care in Mill Valley, California.<br>
  <small>The work is unglamorous on purpose. Most plans die on a Tuesday.</small>
</p>
