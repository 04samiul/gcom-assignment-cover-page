import { createServiceClient } from '@/lib/supabase/server'
import { SubjectsClient } from './SubjectsClient'

export default async function SubjectsPage() {
  const supabase = createServiceClient()

  const [{ data: subjects }, { data: teachers }] = await Promise.all([
    supabase
      .from('subjects')
      .select('*, teacher:teachers(*)')
      .order('name'),
    supabase
      .from('teachers')
      .select('id, name, designation, department')
      .order('name'),
  ])

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gcc-slate">Subjects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Link each subject to its teacher. The teacher populates automatically.
        </p>
      </div>
      <SubjectsClient initialSubjects={subjects ?? []} teachers={teachers ?? []} />
    </div>
  )
}
