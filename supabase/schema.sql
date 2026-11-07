-- Yard Sail database schema (snapshot)
--
-- Documents the `sales` and `sale_items` tables as they exist in Supabase
-- today. Copied from the Supabase dashboard (Table Editor -> Definition view)
-- on 2026-11-06.
--
-- This is NOT a migration. Do not run it against the live Supabase project;
-- the tables already exist there. It is for reference, or for setting up an
-- empty test database.
--
-- If you change a table in the dashboard, update this file in the same PR.
--
-- Not included: Row Level Security (RLS) policies, extra indexes, grants.
-- Tables are listed in dependency order: `sales` first, because
-- `sale_items.sale_id` references it.


-- ---------------------------------------------------------------------------
-- sales: one row per yard sale
-- ---------------------------------------------------------------------------
create table public.sales (
  id          uuid                     not null default gen_random_uuid(),
  user_id     uuid                     null,
  title       text                     not null,
  address     text                     not null,
  sale_date   date                     not null,
  start_time  time without time zone   not null,
  end_time    time without time zone   not null,
  description text                     null,
  tags        text[]                   null default '{}'::text[],
  created_at  timestamp with time zone null default now(),
  latitude    double precision         null,
  longitude   double precision         null,

  constraint sales_pkey primary key (id),
  constraint sales_user_id_fkey foreign key (user_id)
    references auth.users (id) on delete cascade
);


-- ---------------------------------------------------------------------------
-- sale_items: items listed for a sale (many items per sale)
-- ---------------------------------------------------------------------------
create table public.sale_items (
  id         uuid                     not null default gen_random_uuid(),
  sale_id    uuid                     not null,
  name       text                     not null,
  created_at timestamp with time zone null default now(),

  constraint sale_items_pkey primary key (id),
  constraint sale_items_sale_id_fkey foreign key (sale_id)
    references public.sales (id) on delete cascade
);
