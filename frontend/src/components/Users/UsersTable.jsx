import React from 'react'
import './UsersTable.css'

const UsersTable = ({ users, loading, onEdit, onDelete, onManageRoles, onManagePermissions, onLogout }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка пользователей...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>Пользователи не найдены</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th><input type="checkbox" className="table-checkbox" /></th>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роли</th>
            <th>Разрешения</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input type="checkbox" className="table-checkbox" />
              </td>
              <td>{user.id}</td>
              <td>
                <span className="user-name">{user.name}</span>
              </td>
              <td>
                <span className="user-email">{user.email}</span>
              </td>
              <td>
                <span className="badge roles-badge">
                  {user.roles?.length || 0}
                </span>
              </td>
              <td>
                <span className="badge permissions-badge">
                  {user.permissions?.length || 0}
                </span>
              </td>
              <td>{formatDate(user.created_at)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action roles"
                    onClick={() => onManageRoles(user)}
                    title="Управление ролями"
                  >
                    👥
                  </button>
                  <button
                    className="btn-action permissions"
                    onClick={() => onManagePermissions(user)}
                    title="Управление разрешениями"
                  >
                    🔑
                  </button>
                  <button
                    className="btn-action logout"
                    onClick={() => onLogout(user.id)}
                    title="Разлогинить пользователя"
                  >
                    🔓
                  </button>
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(user)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(user.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <div className="table-info">
          Показано от 1 до {users.length} из {users.length}
        </div>
        <div className="pagination">
          <button className="pagination-btn active">1</button>
        </div>
      </div>
    </div>
  )
}

export default UsersTable

