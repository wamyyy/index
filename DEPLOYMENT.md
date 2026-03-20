# 🚀 Vercel Deployment Guide — Ayoub Elwamy Portfolio

## Project Structure (Final)

```
/
├── index.html          ← EN homepage
├── index_ar.html       ← AR homepage
├── index_fr.html       ← FR homepage
├── admin.html          ← Admin panel
├── login.html          ← Admin login
├── script.js           ← Frontend logic (ES Module)
├── admin.js            ← Admin logic (ES Module)
├── supabase-config.js  ← Supabase client (ES Module)
├── style.css           ← Unchanged
├── admin.css           ← Unchanged
├── vercel.json         ← CORS headers (keep as-is)
└── assets/
    └── img/
        └── ayoub.jpg   ← Default profile photo
```

---

## Step 1 — Supabase Database Setup

1. Go to **https://supabase.com/dashboard/project/udxsycnidkhagvsnmvkk**
2. Click **SQL Editor** in the left sidebar
3. Paste the entire contents of **`supabase_schema.sql`**
4. Click **Run** (▶)

This creates all 6 tables with Row Level Security policies.

---

## Step 2 — Enable Google OAuth in Supabase

1. Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Add your Google OAuth credentials (from Google Cloud Console)
4. Set **Redirect URL** to:
   ```
   https://your-vercel-domain.vercel.app/admin.html
   ```
   *(Update this after Vercel deploy)*

---

## Step 3 — Deploy to Vercel

### Option A — Vercel CLI (Recommended)
```bash
npm install -g vercel
cd your-project-folder
vercel
```
Follow the prompts. Choose **Other** as framework, keep defaults.

### Option B — GitHub Integration
1. Push your code to a GitHub repo
2. Go to **https://vercel.com/new**
3. Import your repo → Deploy

---

## Step 4 — Environment Variables (Optional)

The Supabase credentials are embedded in `supabase-config.js` for simplicity
(the anon key is safe to be public — Supabase's RLS policies protect your data).

If you prefer environment variables for added security, do this:

### In Vercel Dashboard → Settings → Environment Variables:

| Name                      | Value                                                                 |
|---------------------------|-----------------------------------------------------------------------|
| `SUPABASE_URL`            | `https://udxsycnidkhagvsnmvkk.supabase.co`                           |
| `SUPABASE_ANON_KEY`       | `eyJhbGci...` *(your full anon key)*                                 |

Then update `supabase-config.js` to read them:
```js
// Only works with a build step (Vite/Next.js). For plain HTML, keep keys inline.
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

> ⚠️ **Note:** Since this is a plain HTML/JS project (no build step), the current
> approach of inlining the anon key in `supabase-config.js` is the standard Supabase
> pattern. The anon key is designed to be public. Your data is protected by RLS policies.

---

## Step 5 — Update Supabase Auth Redirect

After Vercel gives you your domain (e.g. `ayoub-portfolio.vercel.app`):

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://ayoub-portfolio.vercel.app`
3. Add to **Redirect URLs**:
   ```
   https://ayoub-portfolio.vercel.app/admin.html
   ```

---

## Admin Login Methods

### Method 1 — Classic Credentials (always works)
- Username: `ayoubelwamy`
- Password: `ayoub101219642006`

### Method 2 — Google OAuth (requires Supabase Auth config above)
- Click **Continue with Google** on the login page

---

## Vercel.json (keep as-is)

Your existing `vercel.json` already has the correct CORS headers. No changes needed.

---

## Quick Checklist

- [ ] SQL schema pasted and run in Supabase SQL Editor
- [ ] All 6 tables visible in Supabase Table Editor
- [ ] Files deployed to Vercel
- [ ] Google OAuth redirect URL updated in Supabase
- [ ] Test login at `/login.html`
- [ ] Test admin panel at `/admin.html`
- [ ] Test portfolio at `/index.html`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot use import statement outside a module` | Make sure all `<script>` tags loading `script.js` / `admin.js` have `type="module"` |
| Projects not loading | Check Supabase → Table Editor → `projects` table has rows; check RLS policies |
| Google login fails | Verify redirect URL in Supabase Auth settings matches your Vercel domain exactly |
| Photo not saving | The `settings` table must exist; re-run the SQL schema |
| Admin redirects to login | Clear browser cache/sessionStorage and log in again |
