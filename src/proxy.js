// Next.js runs this before every matching request
// Source - official supabase example
// https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
// https://github.com/supabase/supabase/blob/master/examples/auth/nextjs/proxy.ts

import { updateSession } from '@/lib/supabase/proxy'

// Next.js looks for a function named "proxy" exported from this file
export async function proxy(request) {
    return await updateSession(request)
}

// Controls which requests run the proxy
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|mp4|webp)$).*)',
    ],
}