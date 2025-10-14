import { io } from 'socket.io-client'

const matchId = import.meta.env.VITE_DEFAULT_MATCH_ID || 8859
const apiKey = import.meta.env.VITE_API_KEY || 'password'
const apiUrl = import.meta.env.VITE_API_URL || 'url'

export const socket = io(apiUrl, {
  transports: ['polling', 'websocket'],
  query: { key: apiKey },
})

socket.on('connect', () => {
  console.log('Connected:', socket.id)
  socket.emit('subscribeToGameUpdates', matchId)
})

socket.on('connect_error', (e) =>
  console.error('connect_error:', e?.message || e),
)
socket.on('disconnect', (r) => console.log('Disconnected:', r))
