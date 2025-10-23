import React, { useState, useEffect, useRef } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import './NotificationList.css'

const NotificationList = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasLoaded,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications
  } = useNotifications()

  // Загрузка уведомлений при открытии (только если еще не загружали)
  useEffect(() => {
    if (isOpen && !hasLoaded && !loading) {
      loadNotifications()
    }
  }, [isOpen, hasLoaded, loading, loadNotifications])

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
  }

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation()
    await clearNotification(notificationId)
  }

  const formatTime = (timestamp) => {
    // Обрабатываем как строку с сервера, так и объект Date
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Только что'
    if (minutes < 60) return `${minutes} мин. назад`
    if (hours < 24) return `${hours} ч. назад`
    if (days < 7) return `${days} д. назад`

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'warning':
        return '⚠'
      case 'error':
        return '✕'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button type="button" className="notification-btn" onClick={toggleDropdown}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Уведомления</h3>
            <div className="notification-actions">
              <button
                className="action-btn"
                onClick={() => loadNotifications(true)}
                title="Обновить уведомления"
                disabled={loading}
              >
                {loading ? '⏳' : '🔄'}
              </button>
              {unreadCount > 0 && (
                <button
                  className="action-btn"
                  onClick={async () => await markAllAsRead()}
                  title="Отметить все как прочитанные"
                >
                  ✓ Все
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="action-btn"
                  onClick={async () => await clearAllNotifications()}
                  title="Очистить все"
                >
                  Очистить
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <div className="notification-loading-spinner">⏳</div>
                <div className="notification-loading-text">
                  Загрузка уведомлений...
                </div>
              </div>
            ) : error ? (
              <div className="notification-error">
                <div className="notification-error-icon">⚠️</div>
                <div className="notification-error-text">
                  {error}
                </div>
                <button
                  className="notification-retry-btn"
                  onClick={() => loadNotifications(true)}
                >
                  Повторить
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <div className="notification-empty-icon">🔔</div>
                <div className="notification-empty-text">
                  Нет уведомлений
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`notification-icon ${notification.type}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {!notification.read && <span className="unread-dot" />}
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.created_at || notification.timestamp)}
                    </div>
                  </div>
                  <button
                    className="notification-delete"
                    onClick={(e) => handleDelete(e, notification.id)}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationList

