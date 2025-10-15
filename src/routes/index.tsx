import { createFileRoute } from '@tanstack/react-router'
import FAB from '@/components/FAB'
import MatchSelector from '@/components/MatchSelector'
import TickerStream from '@/components/TickerStream'
import TickerView from '@/components/TickerView'

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
      <div className="flex-1 bg-base-200 shadow-md py-5 pl-15 card">
        <div className="mb-12 pl-20">
          <TickerView />
        </div>
        <TickerStream />
      </div>
      <FAB />
    </div>
  )
}
