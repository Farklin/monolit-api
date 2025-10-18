import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#667eea'
      }}>
        Загрузка...
      </div>
    )
  }

  // Если не авторизован, перенаправляем на страницу логина
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Если авторизован, показываем защищенный контент
  return children
}

export default ProtectedRoute

