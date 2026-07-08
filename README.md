# BuildStack

**Plan. Build. Track. Release.** — A project management platform built for software developers.
React + Vite + Tailwind + Supabase + Groq AI + Resend + Recharts. 100% frontend, no custom backend.

---

## 1. Prerequisites

- **Node.js 18+** — https://nodejs.org
- A free **Supabase** account — https://supabase.com
- A free **Groq** API key — https://console.groq.com/keys
- (Optional) A free **Resend** account for real email — https://resend.com

## 2. Install & run

Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

If you prefer `pnpm` or `yarn`, that works too (`pnpm install && pnpm dev`).

## 3. Configure your API keys

1. Copy `env.example` to a new file called `.env` in the project root.
2. Open `.env` and fill in each value:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_GROQ_API_KEY=gsk_your_groq_api_key
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Where each key goes:**

| Key | Where to get it | Where it's used |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → *Project URL* | `src/lib/supabase.js` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → *anon public* key | `src/lib/supabase.js` |
| `VITE_GROQ_API_KEY` | https://console.groq.com/keys | `src/api/groq.js` (AI Tools, Bug Explainer, Feature Writer) |
| `RESEND_API_KEY` | https://resend.com/api-keys | `api/resend/emails.js` (invitations) |

> ⚠️ `VITE_*` variables are exposed to the browser. For a real production app, put Groq / Resend calls behind a serverless function. For a college project this is fine.

Restart `npm run dev` after editing `.env`.

## 4. Set up the Supabase database

1. Go to https://app.supabase.com and create a new project (free tier is fine).
2. When it's ready, click **SQL Editor → New query**.
3. Open `database.sql` from this project, copy the whole file, paste it into the SQL editor, and click **Run**.
4. That creates all tables (`projects`, `bugs`, `features`, `milestones`, `releases`, `docs`, `team_members`, `profiles`) with Row-Level Security policies so each user only sees their own data.

**Enable email auth** (should be on by default):
Supabase → Authentication → Providers → Email → Enable.
Turn OFF "Confirm email" while testing, or use a real email you can access.

## 5. Sending real invitation emails (optional)

The team-invite feature calls `/api/resend/emails`. When you run `npm run dev` locally, that endpoint doesn't exist and the app will simulate the invite (it still saves the member to the DB, just doesn't hit Resend).

To actually send emails you have two options:

- **Deploy to Vercel** (free): `npm i -g vercel && vercel`. Vercel automatically turns `api/resend/emails.js` into a serverless function. Add `RESEND_API_KEY` in the Vercel dashboard under *Settings → Environment Variables*.
- **Or run `vercel dev`** locally instead of `npm run dev` — same behavior, running at http://localhost:3000.

## 6. Feature checklist

- ✅ Landing page (Hero / Features / Testimonials / Pricing / FAQ / Footer)
- ✅ Sign up, Login, Forgot password, Reset password, Logout (Supabase Auth)
- ✅ Protected routes (unauthenticated users are redirected to `/login`)
- ✅ Dashboard with stat cards + charts (Recharts)
- ✅ CRUD: Projects, Roadmap/Milestones, Features, Bugs, Documentation, Releases, Team
- ✅ Groq AI: Bug Explainer, Feature Writer, README Generator, Commit Message Generator
- ✅ Resend email invitations (via serverless function)
- ✅ Analytics page with Bar / Pie / Line / Area charts + progress bars

## 7. Project structure

```
BuildStack/
├── api/resend/emails.js     ← Resend serverless function (Vercel/Netlify)
├── database.sql             ← Supabase schema (run once in SQL editor)
├── env.example              ← Copy to .env and fill in keys
├── index.html
├── package.json
├── public/logo.svg
└── src/
    ├── App.jsx              ← Routes
    ├── main.jsx
    ├── index.css            ← Tailwind + utility classes
    ├── lib/supabase.js
    ├── context/AuthContext.jsx
    ├── components/
    │   ├── ProtectedRoute.jsx
    │   ├── layout/{AppLayout,Sidebar,Topbar}.jsx
    │   └── ui/{Modal,Badge,EmptyState}.jsx
    ├── api/
    │   ├── crud.js          ← Generic Supabase CRUD wrapper
    │   ├── groq.js          ← Groq AI helpers
    │   └── email.js         ← Resend caller
    └── pages/
        ├── LandingPage.jsx
        ├── auth/{Login,Signup,ForgotPassword,ResetPassword}Page.jsx
        ├── DashboardPage.jsx
        ├── ProjectsPage.jsx
        ├── ProjectDetailPage.jsx
        ├── RoadmapPage.jsx
        ├── BugsPage.jsx
        ├── FeaturesPage.jsx
        ├── DocumentationPage.jsx
        ├── ReleasesPage.jsx
        ├── TeamPage.jsx
        ├── AnalyticsPage.jsx
        ├── AIToolsPage.jsx
        └── SettingsPage.jsx
```

## 8. Commands quick-reference

```bash
npm install         # install packages
npm run dev         # start dev server → http://localhost:5173
npm run build       # production build in dist/
npm run preview     # preview the production build locally
```

## 9. Common issues

- **Blank page + "Missing Supabase env vars"** in console → your `.env` isn't set or you didn't restart `npm run dev`.
- **`row-level security` errors** when creating data → you're not logged in, or you didn't run `database.sql`.
- **Groq 401 error** → wrong / missing `VITE_GROQ_API_KEY`.
- **Invitations "simulated"** → normal in `npm run dev`. Deploy to Vercel or run `vercel dev` for real emails.

Happy shipping 🚀
