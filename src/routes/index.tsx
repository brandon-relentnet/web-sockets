import { createFileRoute } from '@tanstack/react-router'
import TickerLive from '@/components/TickerLive'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="bg-zinc-900 p-8 min-h-screen text-zinc-100">
      <TickerLive />
    </div>
  )
}
