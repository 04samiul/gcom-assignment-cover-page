'use client'

import { useState } from 'react'
import type { Assignment } from '@/lib/types'
import { DownloadPDFButton } from '@/components/pdf/DownloadPDFButton'

interface Props {
  assignments: Assignment[]
  student: { name: string; roll: string; regNo: string }
}

export function AssignmentTable({ assignments, student }: Props) {
  const [search, setSearch] = useState('')

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="input pl-9"
          placeholder="Search assignments or subjects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400">
        Showing {filtered.length} of {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
      </p>

      {/* ── Desktop table ── */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gcc-green text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Assignment Title</th>
              <th className="px-4 py-3 text-left font-semibold">Subject</th>
              <th className="px-4 py-3 text-left font-semibold">Teacher</th>
              <th className="px-4 py-3 text-left font-semibold">Submission Date</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No assignments match your search.
                </td>
              </tr>
            ) : (
              filtered.map((a, i) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gcc-slate max-w-[220px]">
                    <span className="line-clamp-2">{a.title}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="font-medium">{a.subject?.name}</span>
                    <span className="ml-1.5 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-500">
                      {a.subject?.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{a.subject?.teacher?.name}</div>
                    <div className="text-xs text-gray-400">{a.subject?.teacher?.designation}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 tabular-nums">
                    {formatDate(a.submission_date)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DownloadPDFButton
                      fileName={`cover-${slugify(a.title)}.pdf`}
                      assignment={{ title: a.title, submissionDate: a.submission_date }}
                      subject={{ name: a.subject!.name, code: a.subject!.code }}
                      teacher={{
                        name: a.subject!.teacher!.name,
                        designation: a.subject!.teacher!.designation,
                        department: a.subject!.teacher!.department,
                      }}
                      student={student}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No assignments match your search.
          </p>
        ) : (
          filtered.map((a) => (
            <div key={a.id} className="card space-y-3">
              <div>
                <p className="font-semibold text-gcc-slate">{a.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {a.subject?.name}{' '}
                  <span className="font-mono text-xs text-gray-400">({a.subject?.code})</span>
                </p>
              </div>
              <div className="flex items-start justify-between gap-3 text-xs text-gray-500">
                <div>
                  <p className="font-medium text-gray-700">{a.subject?.teacher?.name}</p>
                  <p>{a.subject?.teacher?.designation}</p>
                  <p className="mt-1">
                    Due: <span className="font-medium">{formatDate(a.submission_date)}</span>
                  </p>
                </div>
                <DownloadPDFButton
                  fileName={`cover-${slugify(a.title)}.pdf`}
                  assignment={{ title: a.title, submissionDate: a.submission_date }}
                  subject={{ name: a.subject!.name, code: a.subject!.code }}
                  teacher={{
                    name: a.subject!.teacher!.name,
                    designation: a.subject!.teacher!.designation,
                    department: a.subject!.teacher!.department,
                  }}
                  student={student}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50)
}
