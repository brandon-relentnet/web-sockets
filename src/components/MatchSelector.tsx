'use client'
import { useMemo, useState } from 'react'
import { Hash } from 'lucide-react'

export default function MatchSelector() {
  const [pending, setPending] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const apiBase = useMemo(
    () => (import.meta.env.VITE_TICKER_API_BASE as string) || '',
    [],
  )
  const adminToken = useMemo(
    () => (import.meta.env.VITE_ADMIN_TOKEN as string) || '',
    [],
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const next = Number(fd.get('matchId'))
    if (Number.isNaN(next)) return

    setPending(true)
    setErr(null)
    try {
      const res = await fetch(`${apiBase}/api/ticker/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'x-admin-token': adminToken } : {}),
        },
        body: JSON.stringify({ match_id: next }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // SSE will broadcast the change; no extra work here.
    } catch (e: any) {
      setErr(e.message || 'update failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label className="input">
        <Hash className="inline size-6 text-base-content/50" />
        <input
          name="matchId"
          type="number"
          className="grow"
          placeholder="match_id (e.g. 8859)"
        />
      </label>
      <button className="btn" disabled={pending}>
        Load
      </button>
      {err && <div className="text-red-600 text-sm">{err}</div>}
    </form>
  )
}
