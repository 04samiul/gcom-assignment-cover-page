'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Assignment, Subject, Teacher } from '@/lib/types'

type SubjectWithTeacher = Subject & { teacher: Teacher }
type AssignmentFull = Assignment & { subject: SubjectWithTeacher }

interface Props {
  initialAssignments: AssignmentFull[]
  subjects: SubjectWithTeacher[]
}

const BLANK = { title: '', subject_id: '', submission_date: '' }

export function AssignmentsClient({ initialAssignments, subjects }: Props) {
  const supabase = createClient()
  const [assignments, setAssignments] = useState<AssignmentFull[]>(initialAssignments)
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState<AssignmentFull | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Auto-populate: when a subject is chosen, derive teacher + code ──────────
  const selectedSubject = subjects.find((s) => s.id === form.subject_id) ?? null

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function startEdit(a: AssignmentFull) {
    setEditing(a)
    setForm({
      title: a.title,
      subject_id: a.subject_id,
      submission_date: a.submission_date,
    })
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

    const payload = {
      title: form.title.trim(),
      subject_id: form.subject_id,
      submission_date: form.submission_date,
    }

    if (editing) {
      const { data, error: err } = await supabase
        .from('assignments')
        .update(payload)
        .eq('id', editing.id)
        .select('*, subject:subjects(*, teacher:teachers(*))')
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setAssignments((prev) => prev.map((a) => (a.id === editing.id ? data : a)))
      cancelEdit()
    } else {
      const { data, error: err } = await supabase
        .from('assignments')
        .insert(payload)
        .select('*, subject:subjects(*, teacher:teachers(*))')
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      setAssignments((prev) =>
        [...prev, data].sort(
          (a, b) => new Date(a.submission_date).getTime() - new Date(b.submission_date).getTime()
        )
      )
      setForm(BLANK)
    }

    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this assignment?')) return
    const { error: err } = await supabase.from('assignments').delete().eq('id', id)
    if (err) { alert(err.message); return }
    setAssignments((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* ── Form ─────────────────────────────────────────────────── */}
      <div className="space-y-4 lg:col-span-1">
        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-gcc-slate">
            {editing ? 'Edit Assignment' : 'New Assignment'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Title */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Assignment Title *
              </label>
              <textarea
                name="title"
                className="input resize-none"
                rows={2}
                placeholder="e.g. Communication Process and its Elements"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject selector — drives auto-populate */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Subject * <span className="text-gray-400">(teacher auto-fills)</span>
              </label>
              <select
                name="subject_id"
                className="input"
                value={form.subject_id}
                onChange={handleChange}
                required
              >
                <option value="">— Select subject —</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-populated info */}
            {selectedSubject && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs space-y-1">
                <p className="font-semibold text-blue-700">Auto-populated from Subject</p>
                <div className="text-gray-700 space-y-0.5">
                  <p>
                    <span className="text-gray-400">Code: </span>
                    <span className="font-mono font-medium">{selectedSubject.code}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Teacher: </span>
                    {selectedSubject.teacher?.name}
                  </p>
                  <p>
                    <span className="text-gray-400">Designation: </span>
                    {selectedSubject.teacher?.designation}
                  </p>
                  <p>
                    <span className="text-gray-400">Dept: </span>
                    {selectedSubject.teacher?.department}
                  </p>
                </div>
              </div>
            )}

            {/* Submission date */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Submission Date *
              </label>
              <input
                name="submission_date"
                type="date"
                className="input"
                value={form.submission_date}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="rounded bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Saving…' : editing ? 'Update' : 'Create Assignment'}
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

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Title
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Due
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-gray-400">
                    No assignments created yet.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="max-w-[180px] px-4 py-3 font-medium text-gcc-slate">
                      <span className="line-clamp-2 text-sm">{a.title}</span>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="text-sm text-gray-700">{a.subject?.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{a.subject?.code}</div>
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-gray-600">
                      {formatDate(a.submission_date)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(a)}
                          className="btn-secondary text-xs px-2.5 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="btn-danger"
                        >
                          Delete
                        </button>
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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
