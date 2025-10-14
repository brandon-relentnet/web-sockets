import { socket } from '@/socket'
import { useState, useEffect } from 'react'

export default function Ticker() {
  const [game, setGame] = useState('No game data yet...')
  const matchId = import.meta.env.VITE_DEFAULT_MATCH_ID || 8859
  const apiKey = import.meta.env.VITE_API_KEY || 'password'
  const apiUrl = import.meta.env.VITE_API_URL || 'url'

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/get-games/?key=${apiKey}&match_id=${matchId}`,
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setGame(JSON.stringify(await res.json(), null, 2))
      } catch (err) {
        console.error(err)
        setGame('Failed to load game data')
      }
    })()
  }, [])

  socket.on('updateGames', (updatedGamesInfo) => {
    setGame(JSON.stringify(updatedGamesInfo, null, 2))
  })

  return (
    <div className="bg-gray-100 p-4">
      <pre className="mt-4 text-sm text-gray-600">
        <code>{game}</code>
      </pre>
    </div>
  )
}
