'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Teacher } from '@/lib/types'

interface Props {
  initialTeachers: Teacher[]
}

const BLANK = { name: '', designation: '', department: '' }

export function TeachersClient({ initialTeachers }: Props) {
  const supabase = createClient()
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers)
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function startEdit(t: Teacher) {
    setEditing(t)
    setForm({ name: t.name, designation: t.designation, department: t.department })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditing(null)
    setForm(BLANK)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (editing) {
      const { data, error: err } = await supabase
        .from('teachers')
        .update(form)
        .eq('id', editing.id)
        .select()
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setTeachers((prev) => prev.map((t) => (t.id === editing.id ? data : t)))
      cancelEdit()
    } else {
      const { data, error: err } = await supabase
        .from('teachers')
        .insert(form)
        .select()
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setTeachers((prev) => [...prev, data])
      setForm(BLANK)
    }

    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this teacher? This cannot be undone if subjects reference them.')) return
    const { error: err } = await supabase.from('teachers').delete().eq('id', id)
    if (err) { alert(err.message); return }
    setTeachers((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="card lg:col-span-1">
        <h2 className="mb-4 text-base font-semibold text-gcc-slate">
          {editing ? 'Edit Teacher' : 'Add Teacher'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Full Name *</label>
            <input name="name" className="input" placeholder="e.g. Dr. Md. Kamal Hossain"
              value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Designation *</label>
            <input name="designation" className="input" placeholder="e.g. Associate Professor"
              value={form.designation} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Department *</label>
            <input name="department" className="input" placeholder="e.g. Economics"
              value={form.department} onChange={handleChange} required />
          </div>

          {error && (
            <p className="rounded bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving…' : editing ? 'Update' : 'Add Teacher'}
            </button>
            {editing && (
              <button type="button" onClick={cancelEdit} className="btn-secondary px-3">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Designation</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">Dept.</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-sm text-gray-400">No teachers added yet.</td></tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gcc-slate">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600">{t.designation}</td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{t.department}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(t)} className="btn-secondary text-xs px-2.5 py-1">Edit</button>
                        <button onClick={() => handleDelete(t.id)} className="btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
