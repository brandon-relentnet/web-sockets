// /routes/ticker.tsx (or wherever your route lives)
'use client'
import { useEffect, useMemo, useState } from 'react'

type TeamData = {
  name: string
  players: [string, string]
  logoUrl: string
  score: number
}

type TickerData = {
  associationName: string
  eventName: string
  eventPhase: string
  eventFormat: string
  team1: TeamData
  team2: TeamData
  matchStatus: string
  // backend may also send currentGame; it is safe to ignore if unused
  currentGame?: number
}

type Snapshot = {
  matchId: number
  lastUpdated: string | null
  data: TickerData
}

/** Small hook: opens the SSE and keeps the latest snapshot. */
function useTickerSSE() {
  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Prefer Vite env (e.g., http://localhost:4000), else same-origin
  const apiBase = useMemo(
    () => (import.meta.env.VITE_TICKER_API_BASE as string) || '',
    [],
  )

  useEffect(() => {
    const url = `${apiBase}/api/ticker`
    const es = new EventSource(url)

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data) as Snapshot
        setSnap(parsed)
        setError(null)
      } catch (err: any) {
        setError(err?.message || 'parse error')
      }
    }

    es.onerror = () => setError('stream error')
    return () => es.close()
  }, [apiBase])

  return { snap, error }
}

// Optional: a tiny fallback for initial paint before SSE arrives
const fallbackData: TickerData = {
  associationName: 'NCPA',
  eventName: '—',
  eventPhase: '—',
  eventFormat: '—',
  team1: {
    name: '—',
    players: ['—', '—'],
    logoUrl: '/logos/team1.png',
    score: 0,
  },
  team2: {
    name: '—',
    players: ['—', '—'],
    logoUrl: '/logos/team2.png',
    score: 0,
  },
  matchStatus: '—',
}

export default function TickerView() {
  const { snap } = useTickerSSE()
  // If not connected yet, use the minimal placeholder; once connected, render live data.
  const data = snap?.data ?? fallbackData

  return (
    <div className="relative mx-auto px-4 max-w-[1200px]">
      <div className="inline-grid relative grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] pt-10 pl-28 align-top">
        {/* Association logo */}
        <img
          src={`/${data.associationName}-Logo.png`}
          alt={data.associationName}
          className="-bottom-4 -left-15 z-10 absolute w-75 h-auto pointer-events-none select-none"
        />

        {/* Header bar */}
        <div className="col-span-2 col-start-1 bg-[#001b3f] px-4 py-1 font-bold text-white text-sm text-end truncate">
          {data.associationName} - {data.eventName}
          {/* Optional live status at the far left if you want:
                 <span className="float-left opacity-80">{snap ? `Match ${snap.matchId}` : 'Connecting…'}</span> */}
        </div>

        {/* Match body */}
        <div className="grid grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] col-span-3 col-start-1 w-full">
          {/* Left band */}
          <div className="bg-white h-full aspect-square" />

          {/* Teams */}
          <div className="flex flex-col divide-y divide-[#001b3f] min-w-0">
            {/* Team 1 */}
            <div className="flex bg-white text-black">
              <div className="flex justify-center items-center bg-white ml-18 border-[#001b3f] border-r h-15 aspect-square shrink-0">
                <img
                  src={data.team1.logoUrl}
                  alt={`${data.team1.name} logo`}
                  className="p-1 h-full object-contain"
                />
              </div>
              <div className="flex flex-col flex-1 justify-center pr-6 pl-2 min-w-0">
                <span className="font-bold">{data.team1.name}</span>
                <span className="font-bold truncate">
                  {data.team1.players.join(' & ')}
                </span>
              </div>
              <div className="flex justify-center items-center bg-[#78bce3] border-[#001b3f] border-x h-15 aspect-square font-bold text-4xl shrink-0">
                {data.team1.score}
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex bg-white text-black">
              <div className="flex justify-center items-center bg-white ml-18 border-[#001b3f] border-r h-15 aspect-square shrink-0">
                <img
                  src={data.team2.logoUrl}
                  alt={`${data.team2.name} logo`}
                  className="p-1 h-full object-contain"
                />
              </div>
              <div className="flex flex-col flex-1 justify-center pr-6 pl-2 min-w-0">
                <span className="font-bold">{data.team2.name}</span>
                <span className="font-bold truncate">
                  {data.team2.players.join(' & ')}
                </span>
              </div>
              <div className="flex justify-center items-center bg-[#78bce3] border-[#001b3f] border-x h-15 aspect-square font-bold text-4xl shrink-0">
                {data.team2.score}
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="col-span-2 col-start-1 bg-[#001b3f] px-4 py-1 font-bold text-white text-sm text-end truncate">
            {data.eventPhase} - {data.eventFormat} - {data.matchStatus}
          </div>
        </div>
      </div>
    </div>
  )
}
