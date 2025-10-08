# Supabase Setup Notes (Frontend)

Env (.env at restaurant_frontend root):
REACT_APP_SUPABASE_URL=<project-url>
REACT_APP_SUPABASE_KEY=<anon-key>

Data access:
- Menu page reads from table/view "public.menu" (a view that maps to "public.menu_items")
- Orders are inserted/read from "public.orders"

RLS (demo policies):
- menu_items: select for anon
- orders: insert/select for anon
- order_items: insert/select for anon

If you switch to production:
- Restrict anon policies
- Consider authenticated users with email OTP or OAuth and policies using auth.uid()

After setting env vars:
- Restart dev server
- Confirm footer shows "Data mode: Supabase"
- Place a test order
