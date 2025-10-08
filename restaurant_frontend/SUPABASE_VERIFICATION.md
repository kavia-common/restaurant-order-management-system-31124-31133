# Supabase Verification Guide

Use this quick checklist to confirm the app is using live Supabase (not mock) and to troubleshoot common issues.

Environment
- Ensure a .env file exists in the project root (restaurant_frontend):
  REACT_APP_SUPABASE_URL=<your-supabase-url>
  REACT_APP_SUPABASE_KEY=<your-supabase-anon-key>
- After changes to .env, stop and restart the dev server (npm start).

In-app indicators
- Footer badge shows current mode:
  - "Data mode: Supabase" = live Supabase is in use.
  - "Data mode: Mock" = env vars missing or client failed to init.
- Menu page:
  - Live Supabase: items come from your menu table (can be empty).
  - Mock: predefined items like "Grilled Chicken", "Pasta Primavera" will appear.

Console and Network
- Console:
  - Mock mode shows: [Supabase] REACT_APP_SUPABASE_URL/KEY not set. Running in mock mode.
  - If Supabase init failed, you may see: [Supabase] Failed to initialize, falling back to mock.
- Network:
  - Menu page triggers GET .../rest/v1/menu?select=*
  - Checkout triggers POST .../rest/v1/orders
  - If these are missing, app is in mock mode.

Common issues and fixes
- Missing/incorrect env vars:
  - Fix: set both REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY, restart.
- Wrong key type:
  - Use the anon public key for frontend (not service_role).
- URL issues:
  - Use https://<project-ref>.supabase.co (no trailing slash).
- RLS blocking access (401/403):
  - Create policies for anon role on menu (select) and orders (insert/select), or temporarily disable RLS for testing.
- Empty tables:
  - Seed menu rows in Supabase SQL editor to see data on Menu page.
- CORS/domain mismatch:
  - Ensure your dev URL is allowed in Supabase settings if applicable.

Minimal steps
1) Set .env with URL + anon key
2) Restart dev server
3) Confirm footer shows "Data mode: Supabase"
4) Verify Network calls to /rest/v1/menu and /rest/v1/orders
5) Place a test order and confirm it appears in Supabase

