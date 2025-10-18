import React, { useState, useEffect } from 'react'
import { getPermissions } from '../../api/permissions'
import { addPermissionToUser, removePermissionFromUser } from '../../api/users'
import { toast } from 'react-toastify'
import PermissionSearchSelector from '../common/PermissionSearchSelector'
import './ManageUserPermissionsModal.css'

const ManageUserPermissionsModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [allPermissions, setAllPermissions] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      loadPermissions()
    }
  }, [isOpen, user])

  const loadPermissions = async () => {
    try {
      setLoading(true)
      const permissions = await getPermissions()
      setAllPermissions(permissions)

      // Получаем разрешения пользователя
      if (user.permissions) {
        setUserPermissions(user.permissions.map(p => p.id))
      }
    } catch (error) {
      console.error('Ошибка загрузки разрешений:', error)
      toast.error('Ошибка загрузки разрешений')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePermission = async (permissionId) => {
    try {
      const hasPermission = userPermissions.includes(permissionId)

      if (hasPermission) {
        await removePermissionFromUser(user.id, permissionId)
        setUserPermissions(prev => prev.filter(id => id !== permissionId))
        toast.success('Разрешение удалено у пользователя')
      } else {
        await addPermissionToUser(user.id, permissionId)
        setUserPermissions(prev => [...prev, permissionId])
        toast.success('Разрешение назначено пользователю')
      }
      
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Ошибка управления разрешением:', error)
      toast.error('Ошибка при изменении разрешения')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content manage-user-permissions-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Управление разрешениями: {user?.name}</h2>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <PermissionSearchSelector
            allPermissions={allPermissions}
            selectedPermissions={userPermissions}
            onToggle={handleTogglePermission}
            loading={loading}
          />
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

export default ManageUserPermissionsModal

