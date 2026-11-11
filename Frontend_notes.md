# Frontend Notes

Yard Sail: a web app for finding local yard sales and planning a route between them.

CS 4306 team: Roberto / Juan (backend, database, algorithms), Sam / Tabitha (frontend).
Tabitha's branch: `tabitha-dev`.

**MVP:** Create Sale → Store Sale → Browse Sales → Filter/Search → Map → Route Planning.
Login is a placeholder on purpose; auth is outside the current MVP.

---

## 1. Where things stand

| Page | URL | Status |
|---|---|---|
| Home | `/` | ✅ Hero, "How it works" steps, preview of the next 3 upcoming sales |
| Browse | `/browse` | ✅ Filter bar (search, date, tag), removable filter chips, sale cards |
| Sale detail | `/sales/[id]` | ✅ Where/When boxes, description, tags, items |
| Create | `/create` | ✅ Saves to Supabase. 3 sections, live tag preview, clear errors, success box |
| Plan your stops | `/route` | ✅ Pick upcoming sales; stops grouped by day, sorted by start time |
| Log in | `/login` | Placeholder only (on purpose) |
| Map | — | ⏳ Waiting on backend (coordinates) |
| Route optimization | — | ⏳ Waiting on backend (algorithm) |

### Restyle (all 7 phases done)

1. Colors, fonts, header/nav, shared buttons
2. Browse as cards (`SaleCard`) + sale detail layout + empty/error boxes
3. Home page: hero, steps, upcoming sales
4. Browse filter bar and chips
5. Create form
6. Route page
7. Mobile polish

### Other fixes along the way

- Tags are lowercased and de-duplicated when saved and when shown (fixed React's duplicate key warning)
- No "Saturday" wording: the route page is "Plan your stops" and works for any day
- Dates no longer show a day early (time zone bug), times show as "9:00 AM"

---

## 2. How the app works

### Pages and routing

- A folder in `src/app/` with a `page.js` is a URL (e.g. `src/app/browse/page.js` → `/browse`)
- `src/app/layout.js` wraps every page with the header and nav

### Server pages vs client components

- **Server pages** (`page.js` files) load data from Supabase before the page is sent. They can't use `useState` or `onClick`.
- **Client components** (files starting with `"use client"` in `src/components/`) handle anything interactive: forms, filters, checkboxes.
- Pattern used everywhere: the server page loads the data, then passes it into a client component as a prop.

### Data

- `sales`: `id`, `title`, `address`, `sale_date`, `start_time`, `end_time`, `description`, `tags` (array), plus `user_id`, `created_at`, `latitude`, `longitude` (these last ones aren't used by the frontend yet)
- `sale_items`: `id`, `sale_id`, `name`
- Form fields are camelCase (`startTime`); database columns are snake_case (`start_time`). `CreateSaleForm.js` maps between them.
- Full schema: `supabase/schema.sql` (reference only, don't run it)
- Env vars go in `.env.local` (never commit): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `GEOAPIFY_API_KEY`

### Key files

| What | File |
|---|---|
| Colors, fonts, spacing (change here, updates everywhere) | `src/app/globals.css` |
| Shared page layout, hero, panels, empty/error boxes | `src/styles/page.module.css` |
| Shared buttons (`.button` + `.primary` / `.secondary`) | `src/styles/buttons.module.css` |
| Date/time/tag helpers (`formatSaleDate`, `formatTimeRange`, `uniqueTags`, ...) | `src/lib/formatSale.js` |
| One sale card (Home + Browse) | `src/components/SaleCard.js` |
| Browse filters + card grid | `src/components/BrowseSalesList.js` |
| Create form | `src/components/CreateSaleForm.js` |
| Route picker + stop list | `src/components/RoutePlanner.js` |
| Header + nav | `src/components/AppHeader.js`, `AppNav.js` |
| Supabase clients (**don't edit**) | `src/lib/supabase/` |
| Old HTML prototype (**don't edit**) | `html/`, `css/` |

### Code conventions

- Comment at the top of every file, on every function/component, and on any non-obvious block
- `BACKEND:` marks where the frontend talks to Supabase; `LATER:` marks features waiting on data
- Every CSS group has a one-line comment; every color variable in `globals.css` says where it's used
- Done means: `npm run lint` passes, create → browse → detail works, looks right on desktop and phone

---

## 3. Next plan: what we can do now (no backend needed)

Ordered by value for the demo. Each phase is small and can be tested on its own.

### Phase A: Loading, 404 and page titles (quick polish)

**Why:** The sale detail page can take ~2 seconds to load and shows nothing while it waits. A bad sale link shows Next.js's plain default 404. Every sale's browser tab just says "Sale details".

1. `loading.js` for Browse, detail, Route and Home: simple placeholder cards that show while Supabase loads
2. `src/app/not-found.js` (and one for `/sales/[id]`): friendly "This sale doesn't exist" page with Browse link
3. `generateMetadata` on `/sales/[id]` so the tab shows the sale's title (also helps when sharing links)
4. Login page: replace the "static prototype" wording with a friendly "Accounts are coming soon" message

### Phase B: "Get directions" with the address we already have

**Why:** This gives buyers real directions **today**, without coordinates or a map library. It's not fake: it opens Google Maps with the sale's real address, and Google works out the route.

1. Detail page: "Get directions" button → `https://www.google.com/maps/dir/?api=1&destination=<address>`
2. Route page: "Open route in Google Maps" button that sends all picked stops, in our order, as one trip (Google's link supports up to about 9 stops)
3. No API key, no new dependency, it's just a link

### Phase C: Add to route from anywhere

**Why:** Right now you can only pick stops on the Route page, and refreshing the page loses your picks. Buyers find sales on Browse and detail, so that's where "Add to route" belongs.

1. Save picked sale ids in the browser (`localStorage`) so picks survive a refresh and moving between pages
2. "Add to route" / "Added ✓" button on each `SaleCard` and on the detail page
3. Small count in the nav, e.g. "Route (3)"
4. Route page reads the same saved picks

### Phase D: Smarter stop list

**Why:** Sorting by start time is a good start, but it doesn't warn you about problems.

1. Warn when a stop closes before an earlier stop opens (you can't get there in time)
2. Warn when a picked sale is today and already over
3. Show the total time window for each day (e.g. "8:00 AM – 2:00 PM")

### Phase E: Better Browse

**Why:** As more sales are added, buyers need quicker ways to narrow the list.

1. Quick date chips: "Today", "This weekend", "Next 7 days"
2. Hide past sales by default, with a "Show past sales" toggle
3. Sort dropdown: soonest first / newest posted

### Phase F: Create form safety

**Why:** Stop easy mistakes before they're saved.

1. Don't allow dates in the past (`min` on the date field + a validation message)
2. Character limits on title and description, with a counter
3. Warn before leaving the page with unsaved typing

### Phase G: Sharing and calendar (optional extras)

1. "Share" button on the detail page (copies the link, or opens the phone's share menu)
2. "Add to calendar" button that downloads an `.ics` file with the date, time and address

### Phase H: Tidy-up and docs

1. Remove unused CSS classes in `page.module.css` (`.grid`, `.list`, `.placeholder`)
2. Update `README.md`: the "Sale Pages" section still says pages have "almost no styling", and the project structure is missing `route/`, `SaleCard`, `formatSale.js`
3. Small tests for `formatSale.js` using Node's built-in test runner (`node --test`, no new dependency)

---

## 4. Needs a team decision

Bring these to the next team meeting.

| Topic | Question | Why it matters |
|---|---|---|
| Geocoding | Should the Create form turn the address into `latitude`/`longitude` when a sale is saved (Geoapify key is already in `.env.example`)? Who owns that code, frontend or backend? | This is what unblocks the map. Without it every sale has empty coordinates. |
| Map library | Which one? (e.g. Leaflet + OpenStreetMap is free; Geoapify has map tiles too) | Frontend can't start the map until this is picked. New dependency, so the team should agree. |
| Route algorithm | What goes in and what comes out? (e.g. sale ids in → ordered ids + travel times out) | Frontend already has the picker and stop list. `compareStops` in `RoutePlanner.js` is marked as the spot to swap in. |
| Security (RLS) | Is Row Level Security on for `sales` and `sale_items`? | Right now anyone with the public key may be able to insert or delete rows. |
| Editing/deleting sales | Do sellers need to fix or remove a sale? | Needs auth (`user_id` is already in the table) or some other way to prove ownership. |
| Photos | Are sale photos in scope? | Would need a Supabase Storage bucket. `SaleCard` has a `LATER:` spot for a photo. |
| Demo data | Can backend add 10–15 realistic sample sales over the next few weeks? | Makes the demo look real and tests filters, Route grouping and the Home preview. |
| Sam / Tabitha split | Who takes which phase? | Avoids two people editing the same file. |

---

## 5. Blocked on backend (frontend steps, ready to go)

### Map (after coordinates + library are decided)

1. Map section on Browse (or a `/map` page) as a client component
2. One pin per sale that has coordinates; clicking a pin opens `/sales/[id]`
3. Small map on the detail page (spot marked `LATER:`)
4. Never invent pins for sales without coordinates

### Route optimization (after the algorithm is ready)

1. Send the picked sale ids to the route function
2. Replace `compareStops` order with the optimized order
3. Show travel time between stops and the path on the map

---

## 6. Git

- Work on `tabitha-dev`. Never commit to `main` directly.
- `git status` → `git add -A` → `git commit -m "..."` → `git push`
- When a set of phases is done, open a Pull Request from `tabitha-dev` into `main` and have a teammate review it.

---

## Next session (start here)

1. Commit and push Phase 7 (mobile polish) if not done yet
2. Open a Pull Request: `tabitha-dev` → `main` so the team sees the restyle
3. Bring section 4 ("Needs a team decision") to the team
4. Start Phase A (loading, 404, page titles)
