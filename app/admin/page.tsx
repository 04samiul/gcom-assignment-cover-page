import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = createServiceClient()

  const [
    { count: teacherCount },
    { count: subjectCount },
    { count: assignmentCount },
    { count: studentCount },
  ] = await Promise.all([
    supabase.from('teachers').select('*', { count: 'exact', head: true }),
    supabase.from('subjects').select('*', { count: 'exact', head: true }),
    supabase.from('assignments').select('*', { count: 'exact', head: true }),
    supabase.from('students').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Teachers', value: teacherCount ?? 0, href: '/admin/teachers', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Subjects', value: subjectCount ?? 0, href: '/admin/subjects', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Assignments', value: assignmentCount ?? 0, href: '/admin/assignments', color: 'bg-gcc-green/10 text-gcc-green border-gcc-green/20' },
    { label: 'Students', value: studentCount ?? 0, href: '#', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ]

  return (
    <div className="p-6 pt-8 md:pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gcc-slate">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage teachers, subjects, and assignments.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${s.color}`}
          >
            <p className="text-3xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm font-medium">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="mb-4 text-base font-semibold text-gcc-slate">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/teachers" className="btn-primary">
            + Add Teacher
          </Link>
          <Link href="/admin/subjects" className="btn-secondary">
            + Add Subject
          </Link>
          <Link href="/admin/assignments" className="btn-secondary">
            + Create Assignment
          </Link>
        </div>
      </div>
    </div>
  )
}
