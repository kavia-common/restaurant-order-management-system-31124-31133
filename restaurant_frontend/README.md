# Restaurant Frontend (Corporate Navy Classic)

Customer-facing React application for browsing menus, managing cart, checking out, and viewing orders.

## Highlights

- Corporate Navy Classic theme (Navy blue with gold accents)
- Client-side routing: `/`, `/menu`, `/cart`, `/checkout`, `/orders`
- Cart persisted to localStorage and hydrated on load
- Supabase integration with automatic mock fallback when env vars are missing
- API abstraction services (menu, orders) for Supabase/mock
- Accessible and responsive UI

## Environment Variables

Create a `.env` file in the project root with:

```
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-supabase-anon-key>
```

If these are not provided, the app will automatically run in mock mode and log a console warning:
```
[Supabase] REACT_APP_SUPABASE_URL/KEY not set. Running in mock mode.
```

## Scripts

- npm start - start dev server
- npm test - run tests
- npm run build - production build

## Architecture Overview

- src/services/supabaseClient.js
  - Initializes Supabase client from env, or falls back to mock mode
- src/services/menuService.js
  - getMenu(): pulls from Supabase table `menu` or mock
- src/services/orderService.js
  - createOrder(), listOrders(): uses Supabase `orders` table or mock
- src/services/paymentService.js
  - Simulates a lightweight payment flow
- src/store/cartContext.js
  - React Context with localStorage persistence (key: cart:v1)
- src/pages/*
  - Home, Menu, Cart, Checkout, Orders, NotFound
- src/components/*
  - Navbar, MenuCard, QuantityStepper, StatusBadge, Loader, ErrorState

## Supabase Tables (if using Supabase)

- menu: id (int), name (text), description (text), price (float)
- orders: id (int/uuid), created_at (timestamp), items (json), total (float), status (text), customer_name (text), customer_email (text), address (text)

## Accessibility

- Focus-visible styles for interactive elements
- aria-labels for controls
- role and aria-live used for status messages and nav

## Styling

- CSS variables defined in src/index.css (Corporate Navy palette)
- Utility classes for surfaces, buttons, grids

## Mock Data

- Defined in src/mock/mockData.js
- Mock API in src/mock/mockApi.js simulates latency and stores orders in-memory

## Notes

- The preview system will handle running the app. No script changes required.
- Mock mode is meant for development and demos. For production, configure Supabase env vars.
