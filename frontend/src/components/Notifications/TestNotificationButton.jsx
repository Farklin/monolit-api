import { useState, useRef, useEffect } from 'react'
import axiosInstance from '../../api/axios'

const TestNotificationButton = () => {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const notificationTypes = [
    { type: 'info', label: 'Info', icon: 'ℹ️', color: '#3b82f6' },
    { type: 'success', label: 'Success', icon: '✓', color: '#10b981' },
    { type: 'warning', label: 'Warning', icon: '⚠️', color: '#f59e0b' },
    { type: 'error', label: 'Error', icon: '✕', color: '#ef4444' }
  ]

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

  const sendTestNotification = async (type) => {
    setLoading(true)
    setIsOpen(false)

    const messages = {
      info: {
        title: 'Информация',
        message: `Это информационное уведомление, отправленное в ${new Date().toLocaleTimeString()}`
      },
      success: {
        title: 'Успешно!',
        message: 'Операция выполнена успешно'
      },
      warning: {
        title: 'Внимание!',
        message: 'Требуется ваше внимание к этому вопросу'
      },
      error: {
        title: 'Ошибка!',
        message: 'Произошла критическая ошибка в системе'
      }
    }

    try {
      await axiosInstance.post('/notifications/send', {
        ...messages[type],
        type
      })
      console.log('Notification sent successfully')
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Ошибка отправки уведомления: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#45a049')}
        onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#4CAF50')}
      >
        {loading ? '⏳ Отправка...' : '🔔 Тест'}
      </button> */}

      {isOpen && !loading && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          minWidth: '160px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {notificationTypes.map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => sendTestNotification(type)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span style={{ color: color, fontWeight: '500' }}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TestNotificationButton

