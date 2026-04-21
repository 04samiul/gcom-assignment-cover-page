'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [regNo, setRegNo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regNo }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Authentication failed.')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gcc-green px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gcc-gold text-white text-2xl font-bold">
            A
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="mt-1 text-sm text-green-200">
            Government College of Commerce, Chattogram
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Admin Key
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter admin key"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-400">
                This is the admin registration number set in the database.
              </p>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Authenticating…' : 'Access Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
