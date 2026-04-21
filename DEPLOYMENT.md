# Deployment Guide — Railway + Supabase (IPv6 / Supavisor)

## Overview

Railway runs on IPv6-only infrastructure. Supabase's **direct** connection
(port 5432) is IPv4-only and will time out on Railway. You must use the
**Supavisor connection pooler** on port **6543** instead.

---

## Step 1 — Supabase: Run the Schema

1. Go to **Supabase Dashboard → SQL Editor**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run**
4. Verify in **Table Editor** that these tables exist:
   - `teachers`, `subjects`, `assignments`, `students`, `admins`
5. Confirm the `admins` table has one row (your secret admin key)

> ⚠️ **Change the admin key** before running the schema in production.
> Open `supabase/schema.sql`, find `ADMIN-GCC-SECRET-2024` and replace it.

---

## Step 2 — Supabase: Collect Your Credentials

From **Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (e.g. `https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (keep secret) |

---

## Step 3 — Supabase: Get the Supavisor (IPv6) Connection String

This is the critical step for Railway compatibility.

1. Go to **Project Settings → Database**
2. Scroll to **Connection string**
3. Select the **Supavisor** tab (not "Direct connection")
4. Choose **Session mode** (port **6543**)
5. Copy the full URI — it looks like:

```
postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

> The Supavisor pooler hostname resolves over both IPv4 **and** IPv6.
> This is what makes it work on Railway's IPv6-only network.

---

## Step 4 — Railway: Create the Project

```bash
# Install Railway CLI (if not already installed)
npm install -g @railway/cli

# Login
railway login

# In your project directory
railway init
railway link   # link to your new project
```

Or use the **Railway Dashboard → New Project → Deploy from GitHub repo**.

---

## Step 5 — Railway: Set Environment Variables

In **Railway Dashboard → Your Service → Variables**, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Generate with: openssl rand -hex 32
SESSION_SECRET=your_64_char_random_hex_string_here

NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
```

> **Never** commit `.env.local` to Git. The `.gitignore` already excludes it.

---

## Step 6 — Deploy

```bash
# If using CLI:
railway up

# If using GitHub integration:
git push origin main   # Railway auto-deploys on push
```

Railway reads `railway.toml` and runs:
```
npm install && npm run build
npm run start
```

---

## Step 7 — Verify

1. Visit `https://your-app.up.railway.app/api/health` — should return `{"status":"ok"}`
2. Visit `/admin/login` → enter your admin key → check the dashboard loads
3. Visit `/signup` → create a student account → verify it appears in Supabase
4. Visit `/dashboard` → confirm assignments load and PDF downloads work

---

## Troubleshooting

### `ECONNREFUSED` or connection timeout
- You are using the **direct** connection (port 5432). Switch to Supavisor (port 6543).
- Double-check the pooler hostname contains `.pooler.supabase.com`.

### `prepared statement already exists`
- Add `?pgbouncer=true` to the end of the Supavisor connection string.
- The `createServiceClient()` already sends `x-supabase-no-prepare: true` header
  which prevents this on the API layer.

### `SSL SYSCALL error: EOF detected`
- Ensure your Supavisor URI starts with `postgresql://` not `postgres://`.
- Try appending `?sslmode=require` to the connection string.

### `Invalid admin credentials`
- Confirm the `admins` table has a row. Run in SQL Editor:
  ```sql
  SELECT * FROM public.admins;
  ```
- The value in `reg_no` column must match exactly what you type at `/admin/login`.

### PDF not generating / blank download
- `@react-pdf/renderer` requires client-side rendering. Confirm the
  `DownloadPDFButton` component has `'use client'` at the top.
- Check the browser console for font loading errors.

---

## Local Development

```bash
# Clone and install
npm install

# Copy and fill in environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run dev server
npm run dev
# → http://localhost:3000
```

---

## File Structure Reference

```
gcc-assignment-generator/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Root redirect
│   ├── globals.css                 # Tailwind + component styles
│   ├── login/page.tsx              # Student login
│   ├── signup/page.tsx             # Student sign-up (prefix: 242232)
│   ├── dashboard/
│   │   ├── page.tsx                # Student dashboard (Server Component)
│   │   └── AssignmentTable.tsx     # Assignment list + PDF buttons
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout (auth guard)
│   │   ├── page.tsx                # Admin dashboard stats
│   │   ├── login/page.tsx          # Admin login
│   │   ├── teachers/
│   │   │   ├── page.tsx
│   │   │   └── TeachersClient.tsx  # CRUD
│   │   ├── subjects/
│   │   │   ├── page.tsx
│   │   │   └── SubjectsClient.tsx  # CRUD + teacher auto-populate
│   │   └── assignments/
│   │       ├── page.tsx
│   │       └── AssignmentsClient.tsx # CRUD + subject→teacher auto-populate
│   └── api/
│       ├── health/route.ts
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── signup/route.ts
│       │   └── logout/route.ts
│       └── admin/
│           └── login/route.ts
├── components/
│   ├── LogoutButton.tsx
│   ├── pdf/
│   │   ├── CoverPageDocument.tsx   # A4 react-pdf layout
│   │   └── DownloadPDFButton.tsx   # Dynamic import wrapper
│   └── admin/
│       └── AdminSidebar.tsx
├── lib/
│   ├── types.ts                    # Shared TypeScript interfaces
│   ├── session.ts                  # iron-session config
│   └── supabase/
│       ├── client.ts               # Browser client (anon)
│       └── server.ts               # Server clients (anon + service-role)
├── supabase/
│   └── schema.sql                  # Full schema + RLS — paste into Supabase
├── middleware.ts                   # Route protection
├── railway.toml                    # Railway build + deploy config
├── next.config.ts
├── tailwind.config.ts
└── .env.local.example              # Copy → .env.local and fill in
```
