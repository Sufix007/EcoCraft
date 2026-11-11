# EcoCraft V5 — accounts and shared leaderboard

This version adds real **email/password signup, login, logout, automatic session persistence, private journals/photo uploads, and a shared leaderboard** using Supabase. The V4 waste-material and project-selection experience remains in place.

## Run locally

1. Install Node.js, unzip this folder, and open `ecocraft-v5` (the folder containing `package.json`) in VS Code.
2. Create a free Supabase project at https://supabase.com/dashboard.
3. In Supabase **SQL Editor**, paste and run the complete `supabase-setup.sql` file in this folder. This creates tables, Row Level Security policies, a leaderboard function, and a private photo-storage bucket.
4. Under **Authentication → Providers → Email**, enable email/password login. If email confirmation is enabled (recommended), verify the address after signup. For local testing, add `http://localhost:5173` to Authentication → URL Configuration's redirect URLs (and set Site URL appropriately).
5. In Supabase's project settings, copy the **Project URL** and **publishable key** (or legacy `anon` key). **Never use a secret or `service_role` key in this frontend.**
6. Copy `.env.example` to a file named `.env` and replace the placeholders:

   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
   ```

   `.env` is gitignored. The publishable key is intended for browser use; data security comes from Row Level Security.
7. In the VS Code terminal run:

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

8. Open the Vite address (usually http://localhost:5173), click **Login / Sign up**, create an account, confirm email if requested, and log in.
9. Pick a waste material, open a DIY product, and save a completed project. It appears in **My creations** and increases your count in the **shared leaderboard**. Sign out and sign in again to see it persist.

## Important notes

- Your **V4 browser-local journal and creator profiles are not automatically imported** into Supabase. Old files remain unchanged. Account data begins fresh with V5. Don't clear the old browser data if you want to retain it for a future migration.
- A project can be browsed without an account. Saving one opens the login dialog.
- Every completed project belongs to its authenticated owner; the leaderboard exposes display names and aggregate counts, not photos or private notes.
- Counts are self-reported, not independently verified. Spam/rate limiting and moderation would be needed before public launch.
- Project images are uploaded to a **private bucket**; display links are temporary signed URLs. The page refreshes image links when loading the journal.
- `.env` changes require restarting `npm.cmd run dev`.
- This project does not include deployment or build verification steps.
