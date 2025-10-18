import React from 'react'
import './RolesTable.css'

const RolesTable = ({ roles, onEdit, onDelete, onManagePermissions }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название роли</th>
            <th>Guard</th>
            <th>Разрешения</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                Нет данных для отображения
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>
                  <span className="role-name">{role.name}</span>
                </td>
                <td>{role.guard_name}</td>
                <td>
                  <span className="permissions-badge">
                    {role.permissions?.length || 0}
                  </span>
                </td>
                <td>{new Date(role.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onManagePermissions(role)}
                      className="btn-icon btn-permissions"
                      title="Управление разрешениями"
                    >
                      🔑
                    </button>
                    <button
                      onClick={() => onDelete(role.id)}
                      className="btn-icon btn-delete"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RolesTable

