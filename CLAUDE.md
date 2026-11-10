@AGENTS.md
# Yard Sail: rules for AI assistants

4-person undergraduate CS 4306 project. I (Tabitha) work on the frontend on branch `tabitha-dev`. Roberto and Juan own backend, database and algorithms. Sam is the other frontend developer.

## Stack
Next.js App Router (JavaScript), CSS Modules, Supabase. Read README.md and TABITHA_NOTES.md first.

## Hard rules
- Plan first. Tell me the plan and the files you'll touch, then WAIT for my approval before editing.
- Never edit: src/lib/supabase/*, src/proxy.js, .env*, database table/column names, or the html/ css/ prototype.
- Never commit, push, or switch branches unless I ask. Never touch main.
- Never print or copy real keys. .env.example must keep placeholders only.
- No new dependencies without asking.
- Keep it simple and readable. I'm learning, so explain what you changed and why in plain language.
- Don't fake features that have no data (photos, map, distance, routes, favorites, auth).
- Work in small phases. Stop after each one so I can test it.

## Code comments (important: teammates and I need to follow along)
- Put a short comment at the top of every new file saying what it is for and where it is used (e.g. "Card for one sale on the Browse page").
- Comment each function and component: what it does, what it takes in, and what it returns or shows.
- Comment any block that isn't obvious: why it exists, not just what the line says. Examples: filtering logic, date/time formatting, how data flows from the server page into a client component.
- Mark where the backend connects with a "BACKEND:" comment and where a feature is waiting on data with a "LATER:" comment (e.g. "LATER: replace the date badge with a photo when photos exist").
- In CSS, add a one-line comment above each group of rules saying what part of the page it styles, and a comment next to each CSS variable in globals.css saying where it is used.
- Use plain, beginner-friendly language. No jargon without a short explanation.
- Don't comment the obvious (e.g. "// increases i by 1"). Keep comments short and accurate, and update them when the code changes.
- Don't add comments to files you aren't otherwise editing.

## Done means
npm run lint passes, create -> browse -> detail still works, and it looks right at desktop and phone width.
