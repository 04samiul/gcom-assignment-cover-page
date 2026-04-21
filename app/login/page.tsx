'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [regNo, setRegNo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regNo }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Login failed.')
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
          <h1 className="text-2xl font-bold text-gcc-slate">Student Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Government College of Commerce, Chattogram
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 24223200101"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            No account?{' '}
            <Link href="/signup" className="font-medium text-gcc-green hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
