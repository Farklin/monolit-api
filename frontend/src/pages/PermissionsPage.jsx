import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PermissionsTable from '../components/Permissions/PermissionsTable'
import PermissionModal from '../components/Permissions/PermissionModal'
import { getPermissions, createPermission, updatePermission, deletePermission } from '../api/permissions'
import './PermissionsPage.css'

const PermissionsPage = () => {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState(null)

  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = async () => {
    try {
      setLoading(true)
      const data = await getPermissions()
      setPermissions(data)
    } catch (error) {
      console.error('Ошибка загрузки разрешений:', error)
      toast.error('Не удалось загрузить разрешения')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (permissionData) => {
    try {
      await createPermission(permissionData)
      toast.success('Разрешение успешно создано')
      setIsModalOpen(false)
      loadPermissions()
    } catch (error) {
      console.error('Ошибка создания разрешения:', error)
      toast.error(error.response?.data?.message || 'Не удалось создать разрешение')
    }
  }

  const handleUpdate = async (permissionData) => {
    try {
      await updatePermission(selectedPermission.id, permissionData)
      toast.success('Разрешение успешно обновлено')
      setIsModalOpen(false)
      setSelectedPermission(null)
      loadPermissions()
    } catch (error) {
      console.error('Ошибка обновления разрешения:', error)
      toast.error(error.response?.data?.message || 'Не удалось обновить разрешение')
    }
  }

  const handleEdit = (permission) => {
    setSelectedPermission(permission)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это разрешение?')) {
      try {
        await deletePermission(id)
        toast.success('Разрешение успешно удалено')
        loadPermissions()
      } catch (error) {
        console.error('Ошибка удаления разрешения:', error)
        toast.error(error.response?.data?.message || 'Не удалось удалить разрешение')
      }
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPermission(null)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Управление разрешениями</h1>
          <p className="page-description">
            Создавайте и управляйте разрешениями для ролей
          </p>
        </div>
        <button 
          className="btn-create"
          onClick={() => setIsModalOpen(true)}
        >
          + Создать разрешение
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      ) : (
        <PermissionsTable
          permissions={permissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PermissionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={selectedPermission ? handleUpdate : handleCreate}
        permission={selectedPermission}
      />
    </div>
  )
}

export default PermissionsPage

