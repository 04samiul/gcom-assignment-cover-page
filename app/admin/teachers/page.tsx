import { createServiceClient } from '@/lib/supabase/server'
import { TeachersClient } from './TeachersClient'

export default async function TeachersPage() {
  const supabase = createServiceClient()
  const { data: teachers } = await supabase
    .from('teachers')
    .select('*')
    .order('name')

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gcc-slate">Teachers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage teaching staff.
          </p>
        </div>
      </div>
      <TeachersClient initialTeachers={teachers ?? []} />
    </div>
  )
}
