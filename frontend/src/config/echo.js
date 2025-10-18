import Echo from 'laravel-echo'
import Pusher from 'pusher-js'


// Делаем Pusher доступным глобально для Laravel Echo
window.Pusher = Pusher
const token = localStorage.getItem('token')

// Конфигурация для подключения к Laravel Reverb
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'local-app-key',
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,

    authorizer: (channel, options) => {
        return {
          authorize: async (socketId, callback) => {
            try {
              const response = await fetch('/api/broadcasting/auth', {
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name,
                }),
              })

              if (!response.ok) {
                const text = await response.text()
                console.error('Auth failed:', text)
                return callback(true, text)
              }

              const data = await response.json()
              callback(false, data)
            } catch (error) {
              console.error('Auth error:', error)
              callback(true, error)
            }
          },
        }
      },
})

export default echo

