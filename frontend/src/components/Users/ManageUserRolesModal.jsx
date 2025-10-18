import React, { useState, useEffect } from 'react'
import { getRoles } from '../../api/roles'
import { addRoleToUser, removeRoleFromUser } from '../../api/users'
import { toast } from 'react-toastify'
import './ManageUserRolesModal.css'

const ManageUserRolesModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [allRoles, setAllRoles] = useState([])
  const [userRoles, setUserRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen && user) {
      loadRoles()
    }
  }, [isOpen, user])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const roles = await getRoles()
      setAllRoles(roles)

      // Получаем роли пользователя
      if (user.roles) {
        setUserRoles(user.roles.map(r => r.id))
      }
    } catch (error) {
      console.error('Ошибка загрузки ролей:', error)
      toast.error('Ошибка загрузки ролей')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (roleId) => {
    try {
      const hasRole = userRoles.includes(roleId)

      if (hasRole) {
        await removeRoleFromUser(user.id, roleId)
        setUserRoles(prev => prev.filter(id => id !== roleId))
        toast.success('Роль удалена у пользователя')
      } else {
        await addRoleToUser(user.id, roleId)
        setUserRoles(prev => [...prev, roleId])
        toast.success('Роль назначена пользователю')
      }
      
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Ошибка управления ролью:', error)
      toast.error('Ошибка при изменении роли')
    }
  }

  const filteredRoles = allRoles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content manage-user-roles-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Управление ролями: {user?.name}</h2>
            <p className="user-email">{user?.email}</p>
            <p className="roles-count">
              Назначено ролей: {userRoles.length} из {allRoles.length}
            </p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Поиск ролей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="roles-list">
                {filteredRoles.length === 0 ? (
                  <p className="no-data">
                    {searchTerm ? 'Ничего не найдено' : 'Нет доступных ролей'}
                  </p>
                ) : (
                  filteredRoles.map(role => (
                    <div 
                      key={role.id} 
                      className={`role-item ${userRoles.includes(role.id) ? 'selected' : ''}`}
                    >
                      <label className="role-checkbox">
                        <input
                          type="checkbox"
                          checked={userRoles.includes(role.id)}
                          onChange={() => handleToggleRole(role.id)}
                        />
                        <div className="role-info">
                          <span className="role-name">{role.name}</span>
                          {role.permissions && (
                            <span className="permissions-badge">
                              {role.permissions.length} разрешений
                            </span>
                          )}
                        </div>
                        <span className="role-guard">{role.guard_name}</span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageUserRolesModal

