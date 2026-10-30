// Server client - use in Server Components, Server Actions, and Route Handlers.
// Source - official Supabase example
// https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
// https://github.com/supabase/supabase/blob/master/examples/auth/nextjs/lib/supabase/server.ts

// createServerClient builds a Supabase client that reads/writes the login session
// through cookies you hand it (instead of browser storage, which the server cant see).
import { createServerClient } from '@supabase/ssr'
// cookies() is Next.js way to access the incoming requests cookies on the server
import { cookies } from 'next/headers'

// async because cookies() is async in Next.js
// fresh call in each request
export async function createClient() {
    // Grab cookies for current request
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,

        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet, _headers) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {

                    }
                },
            },
        }
    )
}