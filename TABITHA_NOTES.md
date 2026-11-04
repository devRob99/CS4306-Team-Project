# TABITHA NOTES

## Project

Yard Sail

A web application for discovering local yard sales and planning efficient routes between multiple sales.

CS 4306 team: Roberto / Juan (backend, database, algorithms), Sam / Tabitha (frontend).

---

## MVP

Create Sale → Store Sale → Browse Sales → Filter/Search → Map → Route Planning

Login is a placeholder on purpose. Auth is outside the current MVP.

---

## Current Status

### Done

- Next.js app running locally
- Shared layout, header, and nav
- Create Sale form validates and **saves to Supabase** (`sales`, then `sale_items`)
- Browse lists sales from Supabase and links to detail
- Sale detail loads one sale plus its items
- Supabase clients exist: `src/lib/supabase/client.js` (browser), `server.js` (server pages), `proxy.js` (session refresh)

### Not done

- Filter / search
- Map
- Route planning
- Browse and detail pages are functional but barely styled
- Login page is a stub (keep it that way unless the team changes MVP)

### Stale vs reality

- Create Sale is **not** preview-only anymore. Preview was replaced by a real insert.
- Home still says Supabase is deferred. That is outdated.
- Next.js only treats a file named `page.js` as a route. Current files `create_page.js`, `browse_page.js`, `sales_page.js`, and `login_page.js` will **not** show at `/create`, `/browse`, `/sales/[id]`, or `/login` until they are named `page.js` again (or you add a `page.js` that re-exports them).

### My Branch

tabitha-dev

---

## How the app works (quick)

### Routing

- `src/app/layout.js` wraps every page (header + nav)
- `src/app/page.js` is `/` (home)
- A folder with `page.js` is a URL. Extra names like `create_page.js` are just modules; they are not routes.

### Data

Tables already used:

- `sales`: `id`, `title`, `address`, `sale_date`, `start_time`, `end_time`, `description`, `tags` (array of strings)
- `sale_items`: `id`, `sale_id`, `name`

Form fields are camelCase (`date`, `startTime`). Database columns are snake_case (`sale_date`, `start_time`). `CreateSaleForm.js` maps between them.

No latitude/longitude yet. Map and routing need backend schema work first.

Env (`.env.local`, never commit):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Frontend ↔ Supabase

- Client Components (`'use client'`, forms, filters): `createClient()` from `src/lib/supabase/client.js`
- Server Components (browse, detail): `await createClient()` from `src/lib/supabase/server.js`
- Do not put `useState` / `onClick` in Server Component pages. Put interactivity in a `'use client'` child under `src/components/`.

### Key files

- Create: `src/app/create/` + `src/components/CreateSaleForm.js` + `CreateSaleForm.module.css`
- Browse: `src/app/browse/`
- Detail: `src/app/sales/[id]/`
- Login stub: `src/app/login/`
- Shared layout styles: `src/styles/page.module.css`
- Old HTML mockup (`html/`, `css/`): not the running app; do not edit those for new features

---

## Work plan (frontend-first)

Stay on UI until Roberto/Juan add coordinates and a route approach. Map without lat/lng would be fake. Auth is deferred.

---

### Phase 0 — Restore routes

**Why:** Next.js App Router only serves `page.js`. Renamed files break those URLs.

Steps:

1. Confirm which files exist under `src/app/create`, `browse`, `sales/[id]`, and `login`.
2. For each route, have a `page.js` (rename back, or keep the extra file and make `page.js` re-export it).
3. Run `npm run dev` and open `/`, `/create`, `/browse`, `/login`.
4. Create a sale, then open `/browse` and click through to `/sales/<id>`.
5. Do not start styling until those four routes load.

---

### Phase 1 — Restyle browse and sale detail

**Why:** Data loading already works. The UI is still a raw list. Highest demo value, lowest risk. Do not change the Supabase queries unless a field is missing.

Steps:

1. Read `browse` page and `sales/[id]` page. Note fields already on screen: title, address, date, times, tags, description, items.
2. Restyle `/browse` into cards or a clean list (use `page.module.css` and/or a new CSS module). Keep the link to `/sales/[id]`.
3. Handle empty list (`No sales yet`) and load error in the same layout.
4. Restyle `/sales/[id]`: header, address/date/time block, tags, description, item list, back link.
5. Check desktop and a narrow mobile width.
6. Confirm home, create, and nav still look consistent (shared header/colors).

---

### Phase 2 — Filter / search on browse

**Why:** Next MVP step after browse. Browse is a Server Component, so filters must live in a client child.

Steps:

1. Create something like `src/components/BrowseSalesList.js` with `'use client'`.
2. Pass the `sales` array from the server page into that component. Keep the `select` on the server page.
3. Add a text search over title and address.
4. Add optional filters: date, and tags if they exist on the sale.
5. Show a “no matches” state when filters hide everything.
6. If the list stays small, client-side filter is enough. Ask backend later if they want SQL `ilike` / tag overlap.

---

### Phase 3 — Create Sale UX polish

**Why:** Save already works. The old live preview was removed. Buyers/sellers should see a clear success path.

Steps:

1. After a successful insert, show a success message that links to `/sales/<new id>`.
2. Optionally restore a small live preview next to the form (not instead of saving).
3. Keep validation as-is unless a field is confusing (address hint, tag/item format).
4. Do not change table/column names without team agreement.

---

### Phase 4 — Map (blocked on backend)

**Why:** Addresses are plain text. Pins need coordinates.

Wait for Roberto/Juan:

- lat/lng (or geocoding) on `sales`
- which map library the team wants

Then frontend steps:

1. Add a `/map` (or map section on browse) as a client component.
2. Plot sales that have coordinates.
3. Clicking a pin should go to `/sales/[id]`.
4. Do not invent fake pins.

---

### Phase 5 — Route planning (blocked on backend)

**Why:** This is the algorithms piece. Frontend only selects stops and displays the result.

Wait for Roberto/Juan:

- how a route is computed (API, server action, or library)
- input/output shape (ordered sale ids, travel time, etc.)

Then frontend steps:

1. Let the buyer pick several sales (“add to route”) from browse or map.
2. Send those ids (and locations) to the route function.
3. Show ordered stops and a simple path on the map.
4. Handle fewer than two selected sales.

---

### Phase 6 — Leave login alone

**Why:** Session refresh is already in `src/proxy.js`. The login page says auth is outside MVP.

Steps:

1. Keep `/login` as a short placeholder.
2. Only build real sign-in if the team adds it to MVP.

---

## Git (when you are ready to save work)

- Stay on `tabitha-dev` (or a `feature/...` branch off `main`). Do not commit to `main`.
- `git status` → `git add` → `git commit` → `git push`
- One pull request per feature, teammate review before merge.

---

## Next session (start here)

1. Phase 0: restore `page.js` routes and click through create → browse → detail.
2. Phase 1: restyle browse, then sale detail.
3. Then Phase 2 filters.

---
