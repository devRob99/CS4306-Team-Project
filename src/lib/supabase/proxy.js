// Session refresher - runs before each request
// Source - Official Supabase example
// https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
// https://github.com/supabase/supabase/blob/master/examples/auth/nextjs/lib/supabase/proxy.ts

import {createServerClient} from '@supabase/ssr'
// NextResponse builds the response sent back to the browser
import {NextResponse} from 'next/server'

export async function updateSession(request) {
    // start with a "continue to the page as normal" response.
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Create a new client on every request (never reuse a global one)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet, headers) {
                    cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({name, value, options}) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                    Object.entries(headers).forEach(([key, value]) =>
                        supabaseResponse.headers.set(key, value)
                    )
                },
            },
        }
    )
    const {data} = await supabase.auth.getClaims()
    const user = data?.claims

    return supabaseResponse
}