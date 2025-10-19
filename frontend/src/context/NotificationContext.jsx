import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  getNotifications,
  markNotificationAsRead as markAsReadAPI,
  markAllNotificationsAsRead as markAllAsReadAPI,
  deleteNotification as deleteNotificationAPI,
  clearAllNotifications as clearAllNotificationsAPI
} from '../api/notifications'



const NotificationContext = createContext(null)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Загрузка уведомлений с сервера
  const loadNotifications = useCallback(async (forceReload = false) => {
    // Если уже загружали и не принудительная перезагрузка - не загружаем снова
    if (hasLoaded && !forceReload) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getNotifications()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
      setHasLoaded(true)
    } catch (err) {
      setError('Ошибка при загрузке уведомлений')
      console.error('Ошибка загрузки уведомлений:', err)
    } finally {
      setLoading(false)
    }
  }, [hasLoaded])

  // Добавление нового уведомления (для real-time)
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      read: false,
      timestamp: new Date()
    }

    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
    // Сбрасываем флаг загрузки, чтобы можно было обновить список
    setHasLoaded(false)
  }, [])

  const markAsRead = useCallback(async (id) => {
    try {
      await markAsReadAPI(id)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Ошибка при отметке уведомления как прочитанного:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadAPI()
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      )
      setUnreadCount(0)
    } catch (err) {
      console.error('Ошибка при отметке всех уведомлений как прочитанных:', err)
    }
  }, [])

  const clearNotification = useCallback(async (id) => {
    try {
      await deleteNotificationAPI(id)
      setNotifications(prev => {
        const notification = prev.find(n => n.id === id)
        if (notification && !notification.read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1))
        }
        return prev.filter(notif => notif.id !== id)
      })
    } catch (err) {
      console.error('Ошибка при удалении уведомления:', err)
    }
  }, [])

  const clearAllNotifications = useCallback(async () => {
    try {
      await clearAllNotificationsAPI()
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      console.error('Ошибка при очистке всех уведомлений:', err)
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        hasLoaded,
        loadNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

