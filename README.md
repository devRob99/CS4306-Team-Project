# Yard Sail

A web app for discovering local yard sales and planning an efficient route between them.

Yard sales are currently announced through social media groups, which have no map, no filtering, and no way to plan a
Saturday morning route. Yard Sail lets sellers post sales with optional item listings, and lets buyers find nearby sales
and generate an optimized route between the ones they pick.

Built for CS 4306 Software Engineering at Angelo State University.

## Team

| Name | Role                            |
|---|---------------------------------|
|Roberto C. | Backend & Database & Algorithms |
| Juan A. | Backend & Database & Algorithms |
| Sam G. | Frontend                        |
| Tabitha O. | Frontend                        |

## Tech Stack

- **Framework:** Next.js (App Router, JavaScript)
- **Styling:** CSS Modules
- **Database:** Supabase

## Getting Started

**Requirements:** Node.js 22 or higher

```bash
git clone <https://github.com/devRob99/CS4306-Team-Project.git>
cd CS4306-Team-Project
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your own values:

```bash
cp .env.example .env.local
```

Never commit `.env.local` - it is gitignored for a reason.

## Using Supabase

The Supabase clients live in `src/lib/supabase/`. Import the one that matches where your code runs.

| File | Use in | How to create it |
|---|---|---|
| `server.js` | Server Components, Server Actions, Route Handlers | `const supabase = await createClient()` |
| `client.js` | Client Components (files starting with `'use client'`) | `const supabase = createClient()` |
| `proxy.js` | Already wired up in `src/proxy.js`. It refreshes the login session on every request, so you don't need to touch it. | — |

**Server Component example** (the default in `src/app`):

```js
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: sales, error } = await supabase.from('sales').select('*')

  if (error) return <p>Could not load sales.</p>

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>{sale.title}</li>
      ))}
    </ul>
  )
}
```

**Client Component example** (for interactive things like forms and buttons):

```js
'use client'

import { createClient } from '@/lib/supabase/client'

export default function AddSaleButton() {
  async function handleClick() {
    const supabase = createClient()
    const { error } = await supabase.from('sales').insert({ title: 'New sale' })
    if (error) console.error(error)
  }

  return <button onClick={handleClick}>Add sale</button>
}
```

> `sales` and `title` are example names. Swap in the real table and column names from the Supabase dashboard (Table Editor).

## Sale Pages (for frontend)

The sale pages work with real Supabase data but have almost no styling. The data loading is done, so you only need to change the JSX and CSS.

| Page | File | What it shows |
|---|---|---|
| `/create` | `src/components/CreateSaleForm.js` (styles: `CreateSaleForm.module.css`) | Form that saves a sale and its items |
| `/browse` | `src/app/browse/page.js` | List of all sales, linking to each sale's detail page |
| `/sales/[id]` | `src/app/sales/[id]/page.js` | One sale with its items |

Both `browse` and `sales/[id]` use `src/styles/page.module.css` for layout.

**To restyle:** edit the JSX inside `return ( ... )` and add classes to the CSS module. Leave the Supabase query at the top of each page alone unless you need another field.

**Data you can use:**

- `sales`: `id`, `title`, `address`, `sale_date`, `start_time`, `end_time`, `description`, `tags` (array of strings)
- `sale_items`: `id`, `sale_id`, `name`

> Database columns use snake_case (`sale_date`), not the camelCase names in the form (`date`).

> `browse` and `sales/[id]` are Server Components, so `useState` and `onClick` don't work in them. For anything interactive (filters, buttons), make a separate component in `src/components/` that starts with `'use client'` and import it.

## Project Structure

```
src/
  app/                  Pages (each folder with a page.js is a route)
    page.js             / (home)
    layout.js           Shared layout wrapped around every page
    globals.css         Global styles
    browse/             /browse - list of sales
    create/             /create - create a sale
    login/              /login
    sales/[id]/         /sales/<id> - one sale and its items
  components/           Shared UI (AppHeader, AppNav, CreateSaleForm) + their CSS modules
  lib/supabase/         Supabase clients (see "Using Supabase")
  styles/               Shared page layout styles (page.module.css)
  proxy.js              Runs before each request to refresh the Supabase session

html/, css/, slideshow.js   Static HTML prototype (not part of the Next.js app)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build locally |
| `npm run lint` | Check for code issues |

## Contributing
- Branch off `main`: `git checkout -b feature/your-feature`
- One pull request per feature, reviewed by a teammate before merging
- Commit `package-lock.json` when you add a dependency
- Keep `main` working - it should be demoable at any time

## Workflow

Never commit directly to `main` . For each new piece of work:

```bash
git checkout main
git pull
git checkout -b feature/your-feature

# make changes
git add .
git commit -m "Describe what you did"
git push -u origin feature/your-feature
```

Then open a Pull Request on Github and have a teammate review it before merging