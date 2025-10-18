import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import echo from '../../config/echo'
import { useNotifications } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'

const NotificationListener = () => {
  const { addNotification } = useNotifications()
  const { user } = useAuth()
  const isInitialized = useRef(false)
  const channelsRef = useRef([])

  // Функция для отображения уведомления
  const showNotification = (event) => {
    console.log('✓ Notification event received:', event)

    const { title, message, type = 'info', time } = event

    // Всегда добавляем уведомление в список
    addNotification({
      title,
      message,
      type,
      time
    })

    // Универсальная конфигурация для toast
    const toastConfig = {
      position: 'top-right',
      autoClose: 5000,
    }

    // Контент для toast
    const toastContent = (
      <div>
        <strong>{title}</strong>
        {message && <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{message}</p>}
      </div>
    )

    // Показываем toast с правильным типом и иконкой
    switch (type) {
      case 'success':
        toast.success(toastContent, toastConfig)
        break
      case 'warning':
        toast.warning(toastContent, toastConfig)
        break
      case 'error':
        toast.error(toastContent, { ...toastConfig, autoClose: 7000 })
        break
      case 'info':
      default:
        toast.info(toastContent, { ...toastConfig, autoClose: 3000 })
        break
    }
  }

  useEffect(() => {
    // Защита от двойной инициализации в React.StrictMode
    if (isInitialized.current) {
      console.log('NotificationListener already initialized, skipping...')
      return
    }

    console.log('Initializing NotificationListener...')
    isInitialized.current = true

    // Массив каналов для подписки
    const channels = []

    // 1. Публичный канал для системных уведомлений
    const systemChannel = echo.channel('system-notifications')
    channels.push({ name: 'system-notifications', channel: systemChannel, type: 'public' })

    systemChannel.subscribed(() => {
      console.log('✓ Successfully connected to system-notifications channel')
    })

    systemChannel.error((error) => {
      console.error('✗ Error connecting to system-notifications channel:', error)
    })

    // Слушаем событие MessageSent на системном канале
    systemChannel.listen('.MessageSent', showNotification)

    // 2. Приватный канал для конкретного пользователя (если авторизован)
    if (user && user.id) {
      const userChannelName = `user.${user.id}`
      const userChannel = echo.private(userChannelName)
      channels.push({ name: userChannelName, channel: userChannel, type: 'private' })

      userChannel.subscribed(() => {
        console.log(`✓ Successfully connected to ${userChannelName} channel`)
      })

      userChannel.error((error) => {
        console.error(`✗ Error connecting to ${userChannelName} channel:`, error)
      })

      // Слушаем событие UserNotification на персональном канале
      userChannel.listen('.UserNotification', showNotification)
      // Также слушаем MessageSent на персональном канале
      userChannel.listen('.MessageSent', showNotification)
    }

    // Сохраняем каналы для отписки
    channelsRef.current = channels

    // Слушаем общие события Echo для отладки
    echo.connector.pusher.connection.bind('state_change', (states) => {
      console.log('Connection state changed:', states.current)
    })

    echo.connector.pusher.connection.bind('connected', () => {
      console.log('✓ Pusher connected')
    })

    echo.connector.pusher.connection.bind('error', (error) => {
      console.error('✗ Pusher error:', error)
    })

    // Отписываемся при размонтировании компонента
    return () => {
      console.log('Leaving all notification channels...')
      isInitialized.current = false

      // Отписываемся от всех каналов
      channelsRef.current.forEach(({ name, type }) => {
        console.log(`Leaving ${type} channel: ${name}`)
        if (type === 'private') {
          echo.leave(name)
        } else {
          echo.leaveChannel(name)
        }
      })

      channelsRef.current = []
    }
  }, [addNotification, user])

  // Компонент не рендерит ничего
  return null
}

export default NotificationListener

