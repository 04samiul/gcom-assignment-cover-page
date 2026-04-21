import { redirect } from 'next/navigation'
import { requireSession } from '@/lib/session'
import { createServiceClient } from '@/lib/supabase/server'
import { AssignmentTable } from './AssignmentTable'
import { LogoutButton } from '@/components/LogoutButton'
import type { Assignment } from '@/lib/types'

export default async function DashboardPage() {
  const session = await requireSession('student')
  if (!session) redirect('/login')

  const supabase = createServiceClient()

  const { data: assignments, error } = await supabase
    .from('assignments')
    .select(`
      id,
      title,
      submission_date,
      created_at,
      subject:subjects (
        id,
        name,
        code,
        teacher:teachers (
          id,
          name,
          designation,
          department
        )
      )
    `)
    .order('submission_date', { ascending: true })

  if (error) {
    console.error('Dashboard fetch error:', error)
  }

  return (
    <div className="min-h-screen bg-gcc-cream">
      {/* ── Top nav ── */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gcc-green text-sm font-bold text-white">
              GCC
            </div>
            <div>
              <p className="text-sm font-semibold text-gcc-slate leading-tight">
                Assignment Portal
              </p>
              <p className="text-xs text-gray-400 leading-tight">
                Govt. College of Commerce, Chattogram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gcc-slate">{session.name}</p>
              <p className="text-xs text-gray-400">Roll: {session.roll} · {session.regNo}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gcc-slate">My Assignments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Download cover pages for any assignment below.
          </p>
        </div>

        {/* Mobile student info card */}
        <div className="mb-6 card sm:hidden">
          <p className="text-sm font-semibold text-gcc-slate">{session.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Roll: {session.roll} · Reg: {session.regNo}
          </p>
        </div>

        {/* Assignments */}
        {assignments && assignments.length > 0 ? (
          <AssignmentTable
            assignments={assignments as unknown as Assignment[]}
            student={{
              name: session.name,
              roll: session.roll,
              regNo: session.regNo,
            }}
          />
        ) : (
          <div className="card flex flex-col items-center py-16 text-center">
            <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 font-medium">No assignments yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Assignments created by the admin will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
