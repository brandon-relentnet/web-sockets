import { createFileRoute } from '@tanstack/react-router'
import { ConnectionState } from '@/components/ConnectionState'
import { MyForm } from '@/components/MyForm'
//import Ticker from '@/components/Ticker'
import TickerLive from '@/components/TickerLive'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="App">
      <ConnectionState />
      <MyForm />
      {/* <Ticker /> */}
      <TickerLive />
    </div>
  )
}
