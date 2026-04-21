import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function RootPage() {
  const session = await getSession()

  if (session.userId) {
    if (session.role === 'admin') redirect('/admin')
    redirect('/dashboard')
  }

  redirect('/login')
}
