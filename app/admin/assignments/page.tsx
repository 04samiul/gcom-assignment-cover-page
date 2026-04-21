import { createServiceClient } from '@/lib/supabase/server'
import { AssignmentsClient } from './AssignmentsClient'

export default async function AssignmentsPage() {
  const supabase = createServiceClient()

  const [{ data: assignments }, { data: subjects }] = await Promise.all([
    supabase
      .from('assignments')
      .select('*, subject:subjects(*, teacher:teachers(*))')
      .order('submission_date', { ascending: true }),
    supabase
      .from('subjects')
      .select('*, teacher:teachers(*)')
      .order('name'),
  ])

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gcc-slate">Assignments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create assignments. Selecting a subject auto-fills its teacher and code.
        </p>
      </div>
      <AssignmentsClient initialAssignments={assignments ?? []} subjects={subjects ?? []} />
    </div>
  )
}
