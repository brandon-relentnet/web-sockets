'use client'

import { useEffect, useState } from 'react'

type Snapshot = { matchId: number; lastUpdated: string | null; data: unknown }

export default function TickerLive() {
  const [matchId, setMatchId] = useState<number>(8859)
  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 1) Open a single SSE connection to the global ticker stream
  useEffect(() => {
    const es = new EventSource('http://localhost:4000/api/ticker')
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
  }, [])

  // 2) Submit handler to change the global match on the server
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const next = Number(fd.get('matchId'))
    if (Number.isNaN(next)) return

    try {
      const res = await fetch('http://localhost:4000/api/ticker/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ match_id: next }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setMatchId(next)
    } catch (err: any) {
      setError(err.message || 'update failed')
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 box">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          name="matchId"
          type="number"
          defaultValue={matchId}
          className="px-2 py-1 border rounded"
        />
        <button className="px-3 py-1 border rounded">Load match</button>
      </form>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {!snap ? (
        <div>Connecting…</div>
      ) : (
        <>
          <div className="opacity-70 text-sm">
            Match {snap.matchId} • Last updated: {snap.lastUpdated ?? '—'}
          </div>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(snap.data, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}
