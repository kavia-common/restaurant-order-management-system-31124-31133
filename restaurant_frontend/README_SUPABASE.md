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

Notes:
- The frontend normalizes menu rows and expects snake_case columns from Supabase.
- The service maps image_url -> imageUrl and is_featured -> isFeatured in JavaScript.
- Image URLs:
  - If you store a full public URL (e.g., https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>), it will be used directly.
  - If you store just the storage path (e.g., my-bucket/images/bbq-ribs.jpg) or a console/authenticated URL, the frontend will attempt to derive a usable public URL via supabase.storage.getPublicUrl(), or a signed URL if the bucket is private.
  - Prefer making the bucket public for stable URLs; otherwise, signed URLs are generated at runtime and will expire.
- Example select used by the app:
  select('id,name,description,price,category,image_url,is_featured,created_at')
