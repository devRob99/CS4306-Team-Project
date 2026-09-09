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

**Requirements:** Node.js 20.9 or higher

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

## Project Structure

```
src/
  app/          Pages and API routes
    api/        Backend endpoints
  components/   Shared UI components
  lib/          Database access and utilities
public/         Static assets
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