import React from 'react'
import { useLocation } from 'react-router-dom'
import ProjectSelector from './ProjectSelector'
import ContextSelector from './ContextSelector'
import './Header.css'

const Header = ({ toggleSidebar }) => {
  const location = useLocation()

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
      default:
        return 'Дашборд'
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      <div className="header-center">
        <ProjectSelector />
        <ContextSelector />
      </div>
      <div className="header-right">
        <button className="notification-btn">
          🔔
        </button>
        <div className="user-profile">
          <span className="user-name">Администратор</span>
          <div className="user-avatar">А</div>
        </div>
      </div>
    </header>
  )
}

export default Header

