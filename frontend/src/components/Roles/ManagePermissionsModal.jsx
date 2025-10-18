import React, { useState, useEffect } from 'react'
import { getPermissions } from '../../api/permissions'
import { addPermissionToRole, removePermissionFromRole } from '../../api/roles'
import { toast } from 'react-toastify'
import PermissionSearchSelector from '../common/PermissionSearchSelector'
import './ManagePermissionsModal.css'

const ManagePermissionsModal = ({ isOpen, onClose, role }) => {
  const [allPermissions, setAllPermissions] = useState([])
  const [rolePermissions, setRolePermissions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && role) {
      loadPermissions()
    }
  }, [isOpen, role])

  const loadPermissions = async () => {
    try {
      setLoading(true)
      const permissions = await getPermissions()
      setAllPermissions(permissions)

      // Получаем разрешения роли (если они есть в модели)
      if (role.permissions) {
        setRolePermissions(role.permissions.map(p => p.id))
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
      const hasPermission = rolePermissions.includes(permissionId)

      if (hasPermission) {
        await removePermissionFromRole(role.id, permissionId)
        setRolePermissions(prev => prev.filter(id => id !== permissionId))
        toast.success('Разрешение удалено из роли')
      } else {
        await addPermissionToRole(role.id, permissionId)
        setRolePermissions(prev => [...prev, permissionId])
        toast.success('Разрешение добавлено к роли')
      }
    } catch (error) {
      console.error('Ошибка управления разрешением:', error)
      toast.error('Ошибка при изменении разрешения')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content manage-permissions-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Управление разрешениями: {role?.name}</h2>
            <p className="permissions-count">
              Выбрано: {rolePermissions.length} из {allPermissions.length}
            </p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <PermissionSearchSelector
            allPermissions={allPermissions}
            selectedPermissions={rolePermissions}
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

export default ManagePermissionsModal

