import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем токен при загрузке
    if (token) {
      // Можно добавить проверку токена на сервере
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (e) {
          console.error('Error parsing user data:', e)
          logout()
        }
      }
    }
    setLoading(false)
  }, [token])

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  // Проверка наличия разрешения у пользователя
  const hasPermission = (permissionName) => {
    if (!user) return false

    // Если есть прямые разрешения у пользователя
    if (user.permissions && user.permissions.some(p => p.name === permissionName)) {
      return true
    }

    // Проверяем разрешения через роли
    if (user.roles) {
      return user.roles.some(role =>
        role.permissions && role.permissions.some(p => p.name === permissionName)
      )
    }

    return false
  }

  // Проверка наличия хотя бы одного из разрешений
  const hasAnyPermission = (permissionNames) => {
    if (!Array.isArray(permissionNames)) return false
    return permissionNames.some(permission => hasPermission(permission))
  }

  // Проверка наличия роли у пользователя
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false
    return user.roles.some(role => role.name === roleName)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        hasPermission,
        hasAnyPermission,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

