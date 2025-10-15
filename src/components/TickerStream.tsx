'use client'
import { useEffect, useMemo, useState } from 'react'

export default function TickerStream() {
  type Snapshot = { matchId: number; lastUpdated: string | null; data: unknown }

  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Resolve API base: prefer Vite env (e.g., http://localhost:4000), otherwise same-origin
  const apiBase = useMemo(
    () => (import.meta.env.VITE_TICKER_API_BASE as string) || '',
    [],
  )

  useEffect(() => {
    const url = `${apiBase}/api/ticker`
    const es = new EventSource(url)

    es.onmessage = (e) => {
      try {
        setSnap(JSON.parse(e.data))
        setError(null)
      } catch (err: any) {
        setError(err.message || 'parse error')
      }
    }

    es.onerror = () => setError('stream error')
    return () => es.close()
  }, [apiBase])

  if (error && !snap)
    return <div className="opacity-70 text-sm">Connecting… ({error})</div>
  if (!snap) return <div className="opacity-70 text-sm">Connecting…</div>

  return (
    <div className="card-body">
      <div className="card-title">
        Match {snap.matchId} • Last updated: {snap.lastUpdated ?? '—'}
      </div>
      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(snap.data, null, 2)}
      </pre>
    </div>
  )
}
