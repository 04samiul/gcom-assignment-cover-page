import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import type { SessionData } from './types'

export type { SessionData }

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'gcc_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions)
}

export async function requireSession(role?: 'student' | 'admin') {
  const session = await getSession()
  if (!session.userId) return null
  if (role && session.role !== role) return null
  return session
}
