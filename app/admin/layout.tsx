import { redirect } from 'next/navigation'
import { requireSession } from '@/lib/session'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession('admin')
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
