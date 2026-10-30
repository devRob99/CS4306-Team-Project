// Browser client - use in Client Components (files that start with 'use client').
// Source - official Supabase docs
// https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
// https://github.com/supabase/supabase

// createBrowserClient comes from Supabase's SSR helper package. It creates a client
// that stores the login session in browser cookies (so the server can read it too).
import { createBrowserClient } from '@supabase/ssr'

// export function so any component can call
// createClient() to get a ready-to-use Supabase connection.
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    )
}