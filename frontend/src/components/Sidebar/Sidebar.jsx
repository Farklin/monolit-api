import React, { useState, useMemo } from 'react'

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'
import { PermissionEnum } from '../../utils/PermissionEnum'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const { hasAnyPermission } = useAuth()
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

  const allMenuItems = [
    {
      id: 'projects',
      name: 'Проекты',
      icon: '🎯',
      path: '/projects',
      permissions: [PermissionEnum.READ_PROJECT]
    },
    {
      id: 'contexts',
      name: 'Контексты',
      icon: '📋',
      path: '/contexts',
      permissions: [PermissionEnum.READ_CONTEXT]
    },
    {
      id: 'warehouses',
      name: 'Склады',
      icon: '🏭',
      permissions: [PermissionEnum.READ_WAREHOUSE, PermissionEnum.READ_WAREHOUSE_STOCK],
      submenu: [
        {
          id: 'warehouses-list',
          name: 'Склады',
          path: '/warehouses',
          permissions: [PermissionEnum.READ_WAREHOUSE]
        },
        {
          id: 'warehouse-stocks',
          name: 'Остатки по складам',
          path: '/warehouse-stocks',
          permissions: [PermissionEnum.READ_WAREHOUSE_STOCK]
        }
      ]
    },
    {
      id: 'users',
      name: 'Пользователи',
      icon: '👥',
      path: '/users',
      permissions: [PermissionEnum.READ_USER]
    },
    {
      id: 'access',
      name: 'Доступы',
      icon: '🔐',
      permissions: [PermissionEnum.READ_ROLE, PermissionEnum.READ_PERMISSION],
      submenu: [
        {
          id: 'roles',
          name: 'Роли',
          path: '/roles',
          permissions: [PermissionEnum.READ_ROLE]
        },
        {
          id: 'permissions',
          name: 'Разрешения',
          path: '/permissions',
          permissions: [PermissionEnum.READ_PERMISSION]
        }
      ]
    },
  ]

  // Фильтруем пункты меню на основе разрешений пользователя
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => {
      // Если у пользователя есть хотя бы одно из требуемых разрешений
      if (!item.permissions || hasAnyPermission(item.permissions)) {
        // Если есть подменю, фильтруем его тоже
        if (item.submenu) {
          const filteredSubmenu = item.submenu.filter(subItem =>
            !subItem.permissions || hasAnyPermission(subItem.permissions)
          )
          // Показываем пункт только если есть доступные подпункты
          if (filteredSubmenu.length > 0) {
            return { ...item, submenu: filteredSubmenu }
          }
          return false
        }
        return true
      }
      return false
    }).map(item => {
      // Фильтруем подменю для каждого пункта
      if (item.submenu) {
        return {
          ...item,
          submenu: item.submenu.filter(subItem =>
            !subItem.permissions || hasAnyPermission(subItem.permissions)
          )
        }
      }
      return item
    })
  }, [hasAnyPermission])

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
