'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const REG_PREFIX = '242232'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', roll: '', regSuffix: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const regNo = REG_PREFIX + form.regSuffix

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, roll: form.roll, regNo }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Sign-up failed.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gcc-green text-white text-2xl font-bold">
            GCC
          </div>
          <h1 className="text-2xl font-bold text-gcc-slate">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Government College of Commerce, Chattogram
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                className="input"
                placeholder="e.g. Md. Rahim Uddin"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            {/* Roll */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <input
                name="roll"
                type="text"
                className="input"
                placeholder="e.g. 124501"
                value={form.roll}
                onChange={handleChange}
                required
              />
            </div>

            {/* Registration Number with fixed prefix */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3 text-sm text-gray-600 font-mono select-none">
                  {REG_PREFIX}
                </span>
                <input
                  name="regSuffix"
                  type="text"
                  className="input rounded-l-none"
                  placeholder="00101"
                  value={form.regSuffix}
                  onChange={handleChange}
                  required
                  maxLength={10}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Full reg. no: <span className="font-mono">{REG_PREFIX}{form.regSuffix || '…'}</span>
              </p>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already registered?{' '}
            <Link href="/login" className="font-medium text-gcc-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
