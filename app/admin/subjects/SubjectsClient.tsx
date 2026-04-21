'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Subject, Teacher } from '@/lib/types'

interface Props {
  initialSubjects: (Subject & { teacher: Teacher })[]
  teachers: Teacher[]
}

const BLANK = { name: '', code: '', teacher_id: '' }

export function SubjectsClient({ initialSubjects, teachers }: Props) {
  const supabase = createClient()
  const [subjects, setSubjects] = useState(initialSubjects)
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-populate teacher info preview
  const selectedTeacher = teachers.find((t) => t.id === form.teacher_id) ?? null

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function startEdit(s: Subject & { teacher: Teacher }) {
    setEditing(s)
    setForm({ name: s.name, code: s.code, teacher_id: s.teacher_id })
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
        .from('subjects')
        .update(form)
        .eq('id', editing.id)
        .select('*, teacher:teachers(*)')
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setSubjects((prev) => prev.map((s) => (s.id === editing.id ? data : s)))
      cancelEdit()
    } else {
      const { data, error: err } = await supabase
        .from('subjects')
        .insert(form)
        .select('*, teacher:teachers(*)')
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setSubjects((prev) => [...prev, data])
      setForm(BLANK)
    }

    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this subject? Assignments linked to it cannot be deleted.')) return
    const { error: err } = await supabase.from('subjects').delete().eq('id', id)
    if (err) { alert(err.message); return }
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="space-y-4 lg:col-span-1">
        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-gcc-slate">
            {editing ? 'Edit Subject' : 'Add Subject'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Subject Name *</label>
              <input name="name" className="input" placeholder="e.g. Microeconomics"
                value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Subject Code *</label>
              <input name="code" className="input" placeholder="e.g. 212213"
                value={form.code} onChange={handleChange} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Teacher *</label>
              <select name="teacher_id" className="input" value={form.teacher_id}
                onChange={handleChange} required>
                <option value="">— Select teacher —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Auto-populated preview */}
            {selectedTeacher && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-xs space-y-0.5">
                <p className="font-semibold text-gcc-green">Auto-populated Teacher Info</p>
                <p className="text-gray-600">{selectedTeacher.designation}</p>
                <p className="text-gray-600">Dept. of {selectedTeacher.department}</p>
              </div>
            )}

            {error && (
              <p className="rounded bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Saving…' : editing ? 'Update' : 'Add Subject'}
              </button>
              {editing && (
                <button type="button" onClick={cancelEdit} className="btn-secondary px-3">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Code</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">Teacher</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjects.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-sm text-gray-400">No subjects added yet.</td></tr>
              ) : (
                subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gcc-slate">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-500">{s.code}</td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                      <div>{s.teacher?.name}</div>
                      <div className="text-xs text-gray-400">{s.teacher?.designation}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(s)} className="btn-secondary text-xs px-2.5 py-1">Edit</button>
                        <button onClick={() => handleDelete(s.id)} className="btn-danger">Delete</button>
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
