// /routes/ticker.tsx (or wherever your route lives)
'use client'
import TickerView from '@/components/TickerView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ticker')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 items-center bg-[#00b140] min-h-screen">
      <div className="mx-auto w-full max-w-5xl">
        <TickerView />
      </div>
    </div>
  )
}
