import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

const PUBLIC_PATHS = ['/login', '/signup', '/admin/login', '/api/auth', '/api/health']

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  // Read session from request cookies
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req.cookies as any, sessionOptions)

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!session.userId || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return res
  }

  // ── Student routes (dashboard) ────────────────────────────────────────────
  if (!session.userId) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|fonts).*)',
  ],
}
