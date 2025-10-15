import { createFileRoute } from '@tanstack/react-router'
import FAB from '@/components/FAB'
import MatchSelector from '@/components/MatchSelector'
import TickerStream from '@/components/TickerStream'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex justify-center items-start gap-4 p-8 min-h-screen text-zinc-100">
      <div className="relative w-100">
        <div className="fixed w-100">
          <MatchSelector />
        </div>
      </div>
      <div className="flex-1 bg-base-200 shadow-md card">
        <TickerStream />
      </div>
      <FAB />
    </div>
  )
}
