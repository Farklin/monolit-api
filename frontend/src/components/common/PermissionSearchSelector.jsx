import React, { useState, useEffect } from 'react'
import './PermissionSearchSelector.css'

const PermissionSearchSelector = ({ 
  allPermissions, 
  selectedPermissions, 
  onToggle, 
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPermissions, setFilteredPermissions] = useState([])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPermissions(allPermissions)
    } else {
      const filtered = allPermissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPermissions(filtered)
    }
  }, [searchTerm, allPermissions])

  const isSelected = (permissionId) => {
    return selectedPermissions.includes(permissionId)
  }

  if (loading) {
    return <div className="loading">Загрузка разрешений...</div>
  }

  return (
    <div className="permission-search-selector">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Поиск разрешений..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => setSearchTerm('')}
            title="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>

      <div className="permissions-count">
        Найдено: {filteredPermissions.length} из {allPermissions.length} | 
        Выбрано: {selectedPermissions.length}
      </div>

      <div className="permissions-list">
        {filteredPermissions.length === 0 ? (
          <p className="no-results">
            {searchTerm ? 'Ничего не найдено' : 'Нет доступных разрешений'}
          </p>
        ) : (
          filteredPermissions.map(permission => (
            <div 
              key={permission.id} 
              className={`permission-item ${isSelected(permission.id) ? 'selected' : ''}`}
            >
              <label className="permission-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected(permission.id)}
                  onChange={() => onToggle(permission.id)}
                />
                <span className="permission-name">{permission.name}</span>
                <span className="permission-guard">{permission.guard_name}</span>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PermissionSearchSelector

