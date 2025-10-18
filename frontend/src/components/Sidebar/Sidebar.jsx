import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const [openDropdowns, setOpenDropdowns] = useState(new Set(['warehouses']))

  const toggleDropdown = (id) => {
    const newSet = new Set(openDropdowns)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setOpenDropdowns(newSet)
  }

  const menuItems = [
    { id: 'projects', name: 'Проекты', icon: '🎯', path: '/projects' },
    { id: 'contexts', name: 'Контексты', icon: '📋', path: '/contexts' },
    {
      id: 'warehouses',
      name: 'Склады',
      icon: '🏭',
      submenu: [
        { id: 'warehouses-list', name: 'Склады', path: '/warehouses' },
        { id: 'warehouse-stocks', name: 'Остатки по складам', path: '/warehouse-stocks' }
      ]
    },
    { id: 'users', name: 'Пользователи', icon: '👥', path: '/users' },
  ]

  const isActive = (path) => location.pathname === path
  const isSubmenuActive = (submenu) => {
    return submenu && submenu.some(item => location.pathname === item.path)
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">BM</span>
          {isOpen && <span className="logo-text">Monolit CRM</span>}
        </div>
      </div>

      <div className="sidebar-search">
        {isOpen && (
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          item.submenu ? (
            <div key={item.id} className="nav-item-group">
              <button
                className={`nav-item ${isSubmenuActive(item.submenu) ? 'active' : ''}`}
                onClick={() => toggleDropdown(item.id)}
                title={!isOpen ? item.name : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && (
                  <>
                    <span className="nav-text">{item.name}</span>
                    <span className={`dropdown-arrow ${openDropdowns.has(item.id) ? 'open' : ''}`}>
                      ▼
                    </span>
                  </>
                )}
              </button>
              {isOpen && openDropdowns.has(item.id) && (
                <div className="submenu">
                  {item.submenu.map(subItem => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={!isOpen ? item.name : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span className="nav-text">{item.name}</span>}
            </Link>
          )
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
