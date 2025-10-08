# Frontend Supabase Quick Start

1) Create a .env file in restaurant_frontend:
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-anon-key>

2) In Supabase SQL Editor, run assets/supabase_setup.sql (or copy from assets/supabase.md).

3) Restart the dev server. The footer badge should show:
- Data mode: Supabase

Endpoints used:
- GET public.menu (view over menu_items)
- POST/GET public.orders

RLS (demo):
- anon can select menu_items (via view), insert/select orders.
Tighten for production.
