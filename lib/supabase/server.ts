import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Use in Server Components & Route Handlers.
 * Respects RLS — operates as the anon/authenticated role.
 */
export function createServerAnonClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookie mutation ignored
          }
        },
      },
    }
  )
}

/**
 * Use ONLY in Server Actions / Route Handlers for privileged operations.
 * Bypasses RLS. NEVER import this in client components.
 *
 * Configured for Supabase Supavisor (IPv6 / port 6543) pooling on Railway.
 * Set DATABASE_URL in Railway to the Supavisor pooler connection string.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          // Supavisor requires this for IPv6 pooling
          'x-supabase-no-prepare': 'true',
        },
      },
    }
  )
}
