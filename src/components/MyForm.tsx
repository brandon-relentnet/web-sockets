import { useState } from 'react'
import { socket } from '../socket'

export function MyForm() {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault()
    setIsLoading(true)

    socket.timeout(5000).emit('subscribeToGameUpdates', value, () => {
      setIsLoading(false)
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        className="bg-yellow-500"
        onChange={(e) => setValue(e.target.value)}
      />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  )
}
