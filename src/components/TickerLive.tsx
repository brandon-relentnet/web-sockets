import { useEffect, useState } from 'react'

type Snapshot = { lastUpdated: string | null; data: unknown }

export default function TickerLive() {
  const [snap, setSnap] = useState<Snapshot | null>(null)

  useEffect(() => {
    const es = new EventSource('http://localhost:4000/api/ticker/stream')
    es.onmessage = (e) => setSnap(JSON.parse(e.data))
    return () => es.close()
  }, [])

  if (!snap) return <div>Connecting…</div>

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify(snap.data, null, 2)}
    </pre>
  )
}
