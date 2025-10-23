import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import ProjectSelector from './ProjectSelector'
import ContextSelector from './ContextSelector'
import TestNotificationButton from '../Notifications/TestNotificationButton'
import NotificationList from '../Notifications/NotificationList'
import './Header.css'

const Header = ({ toggleSidebar }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/projects':
        return 'Проекты'
      case '/contexts':
        return 'Контексты'
      case '/warehouses':
        return 'Склады'
      case '/warehouse-stocks':
        return 'Остатки по складам'
      case '/users':
        return 'Пользователи'
      default:
        return 'Дашборд'
    }
  }

  const handleLogout = () => {
    logout()
    toast.info('Вы вышли из системы', {
      position: 'top-right',
      autoClose: 2000
    })
    navigate('/login')
  }

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const getUserDisplayName = () => {
    return user?.name || user?.email || 'Пользователь'
  }

  return (
    <header className="header">
      <div className="header-left">
        <button type="button" className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      <div className="header-center">
        <ProjectSelector />
        <ContextSelector />
      </div>
      <div className="header-right">
        <TestNotificationButton />
        <NotificationList />
        <div className="user-menu-container" ref={userMenuRef}>
          <div
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="user-name">{getUserDisplayName()}</span>
            <div className="user-avatar">{getUserInitial()}</div>
          </div>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-dropdown-avatar">{getUserInitial()}</div>
                <div className="user-dropdown-info">
                  <div className="user-dropdown-name">{user?.name || 'Пользователь'}</div>
                  <div className="user-dropdown-email">{user?.email}</div>
                </div>
              </div>
              <div className="user-dropdown-divider"></div>
              <button type="button" className="user-dropdown-item" onClick={handleLogout}>
                <span className="user-dropdown-icon">🚪</span>
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

