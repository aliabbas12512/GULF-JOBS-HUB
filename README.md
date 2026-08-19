# Gulf Job Hub

**Find Your Next Career in the Gulf** — a premium, production-ready job portal for Saudi Arabia,
UAE, Qatar, Kuwait, Bahrain and Oman, with a full admin dashboard, bulk Excel job import, SEO/
structured data, and AdSense-ready ad slots.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL database + Row Level Security)
- **Custom session auth** (signed httpOnly cookies via `jose`, passwords hashed with `bcryptjs`)
- **SheetJS (`xlsx`)** for the bulk Excel import/export system

## Getting Started

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (Settings → API). |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service_role** key (Settings → API). Server-only, required for every write. Never expose this to the browser. |
| `SESSION_SECRET` | Random 32+ byte secret used to sign session cookies. Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`. |
| `NEXT_PUBLIC_SITE_URL` | The production URL (e.g. `https://gulfjobhub.com`), used for canonical URLs, sitemap, and structured data. |

### 2. Database

The Supabase project schema (tables, RLS policies, indexes, seed reference data, and the initial
admin account) is already applied via the migrations in `supabase/migrations/`. If you ever need to
re-apply them to a fresh Supabase project, run each file in order through the Supabase SQL editor,
or via the Supabase CLI:

```bash
supabase db push
```

### 3. Install & run

```bash
npm install
npm run dev
```

### 4. Admin login

Sign in at `/admin/login` with the administrator email address configured when the project was set
up. The password was set during initial setup and stored as a secure bcrypt hash — it is **not**
stored anywhere in this repository. **Change the password immediately after your first login** via
**Admin → Admin Account**.

## Deploying to Vercel

1. Push this repository to GitHub (already done if you're reading this from the repo).
2. In [Vercel](https://vercel.com/new), import the `aliabbas12512/GULF-JOBS-HUB` repository.
3. Set the **Root Directory** to the repository root (default).
4. Add the environment variables from the table above under **Project Settings → Environment
   Variables** (all four, for Production and Preview).
5. Deploy. Vercel auto-detects Next.js — no build command changes are needed.
6. Once live, point your domain (`gulfjobhub.com`) at the Vercel project under **Project Settings →
   Domains**, and update `NEXT_PUBLIC_SITE_URL` to match.
7. Verify `/sitemap.xml` and `/robots.txt` resolve correctly, then submit the sitemap in Google
   Search Console.

## Bulk Job Upload

Admins can import many jobs at once from **Admin → Bulk Upload**:

1. Download the official Excel template (includes an Instructions sheet and an Accepted Values
   sheet listing valid Countries, Categories, Employment Types and Statuses).
2. Fill in one row per job and upload the `.xlsx` file.
3. Review the import preview — valid rows and any rows with validation errors are shown separately,
   with a downloadable error report.
4. Confirm the import. Jobs marked `Published` go live immediately; `Draft` jobs stay hidden until
   published from **Admin → All Jobs**.

## Security Notes

- All database writes go through the `SUPABASE_SERVICE_ROLE_KEY` on the server only; Row Level
  Security policies additionally restrict writes to the service role, so the key must never be
  exposed to client-side code.
- Passwords (admin and job seeker accounts) are hashed with bcrypt (cost factor 12) — never stored
  or logged in plain text.
- Admin routes (`/admin/*` and `/api/admin/*`) require a valid signed admin session; there is no
  admin link anywhere in the public UI.
- Login, signup and job-application tracking endpoints are rate-limited per IP as a defense-in-depth
  measure against brute-force and abuse.
- Bulk Excel uploads are restricted to authenticated admins, validated by extension/MIME/size (max
  5MB, `.xlsx` only), and parsed without executing formulas or macros.

## Project Structure

```
src/
  app/                Routes (App Router) - public site, auth, admin dashboard, API routes
  components/          UI components grouped by domain (layout, jobs, home, admin, auth, ads, ui)
  lib/
    db/                 Data access layer (Supabase queries)
    auth/                Session + password helpers
    excel/               Bulk upload template generation, parsing & validation
    seo/                 JobPosting / Breadcrumb structured data builders
    utils/               Formatting, slugs, validation schemas, rate limiting
  types/                Database + domain types
supabase/migrations/    SQL migrations (schema, RLS, seed data)
```
