import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import UsersTable from '../components/Users/UsersTable'
import UserModal from '../components/Users/UserModal'
import { getUsers, createUser, updateUser, deleteUser } from '../api/users'
import './UsersPage.css'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Ошибка при загрузке пользователей', {
        position: 'top-right'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, userData)
        toast.success('Пользователь обновлен успешно!', {
          position: 'top-right',
          autoClose: 3000
        })
      } else {
        await createUser(userData)
        toast.success('Пользователь создан успешно!', {
          position: 'top-right',
          autoClose: 3000
        })
      }

      fetchUsers()
      setShowModal(false)
    } catch (error) {
      console.error('Error saving user:', error)
      throw error
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return
    }

    try {
      await deleteUser(id)
      toast.success('Пользователь удален успешно!', {
        position: 'top-right',
        autoClose: 3000
      })
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Ошибка при удалении пользователя', {
        position: 'top-right'
      })
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Пользователи</h2>
          <button className="btn-primary" onClick={handleCreate}>
            + Добавить пользователя
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">Фильтры</h3>
          <button className="filters-toggle">▼</button>
        </div>
        <div className="search-wrapper">
          <label className="search-label">
            Поиск
            <span className="search-count">{filteredUsers.length}</span>
          </label>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <UsersTable
        users={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default UsersPage

