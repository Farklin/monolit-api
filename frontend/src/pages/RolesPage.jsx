import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import RolesTable from '../components/Roles/RolesTable'
import RoleModal from '../components/Roles/RoleModal'
import ManagePermissionsModal from '../components/Roles/ManagePermissionsModal'
import { getRoles, createRole, deleteRole } from '../api/roles'
import './RolesPage.css'

const RolesPage = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const data = await getRoles()
      setRoles(data)
    } catch (error) {
      console.error('Ошибка загрузки ролей:', error)
      toast.error('Не удалось загрузить роли')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (roleData) => {
    try {
      await createRole(roleData)
      toast.success('Роль успешно создана')
      setIsModalOpen(false)
      loadRoles()
    } catch (error) {
      console.error('Ошибка создания роли:', error)
      toast.error(error.response?.data?.message || 'Не удалось создать роль')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту роль?')) {
      try {
        await deleteRole(id)
        toast.success('Роль успешно удалена')
        loadRoles()
      } catch (error) {
        console.error('Ошибка удаления роли:', error)
        toast.error(error.response?.data?.message || 'Не удалось удалить роль')
      }
    }
  }

  const handleManagePermissions = (role) => {
    setSelectedRole(role)
    setIsPermissionsModalOpen(true)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Управление ролями</h1>
          <p className="page-description">
            Создавайте и управляйте ролями пользователей
          </p>
        </div>
        <button 
          className="btn-create"
          onClick={() => setIsModalOpen(true)}
        >
          + Создать роль
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      ) : (
        <RolesTable
          roles={roles}
          onDelete={handleDelete}
          onManagePermissions={handleManagePermissions}
        />
      )}

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ManagePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => {
          setIsPermissionsModalOpen(false)
          setSelectedRole(null)
          loadRoles()
        }}
        role={selectedRole}
      />
    </div>
  )
}

export default RolesPage

