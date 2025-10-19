import React from 'react'
import { getPermissionDisplayName } from '../../utils/PermissionEnum'
import './PermissionsTable.css'

const PermissionsTable = ({ permissions, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название разрешения</th>
            <th>Guard</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {permissions.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                Нет данных для отображения
              </td>
            </tr>
          ) : (
            permissions.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.id}</td>
                <td>
                  <span className="permission-name">
                    {getPermissionDisplayName(permission.name)}
                  </span>
                  <br />
                  <small className="permission-code">{permission.name}</small>
                </td>
                <td>{permission.guard_name}</td>
                <td>{new Date(permission.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(permission)}
                      className="btn-icon btn-edit"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(permission.id)}
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

export default PermissionsTable

