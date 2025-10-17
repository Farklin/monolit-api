import React from 'react'
import './WarehousesTable.css'

const WarehousesTable = ({ warehouses, contexts, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка складов...</p>
      </div>
    )
  }

  if (warehouses.length === 0) {
    return (
      <div className="empty-state">
        <p>Склады не найдены</p>
      </div>
    )
  }

  const getContextName = (contextId) => {
    const context = contexts.find(c => c.id === contextId)
    return context ? context.name : `#${contextId}`
  }

  const getStatusBadge = (status) => {
    return status ? (
      <span className="status-badge active">Активен</span>
    ) : (
      <span className="status-badge inactive">Неактивен</span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityLabels = {
      1: 'Высокий',
      2: 'Средний',
      3: 'Низкий'
    }
    const priorityClasses = {
      1: 'high',
      2: 'medium',
      3: 'low'
    }
    return (
      <span className={`priority-badge ${priorityClasses[priority] || 'medium'}`}>
        {priorityLabels[priority] || priority}
      </span>
    )
  }

  return (
    <div className="table-container">
      <table className="warehouses-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" className="table-checkbox" />
            </th>
            <th>ID</th>
            <th>Название</th>
            <th>Контекст</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <td>
                <input type="checkbox" className="table-checkbox" />
              </td>
              <td>{warehouse.id}</td>
              <td className="warehouse-name">{warehouse.name}</td>
              <td className="context-name">{getContextName(warehouse.context_id)}</td>
              <td className="warehouse-description">
                {warehouse.description || 'Нет описания'}
              </td>
              <td>{getStatusBadge(warehouse.status)}</td>
              <td>{getPriorityBadge(warehouse.priority)}</td>
              <td>{new Date(warehouse.created_at).toLocaleDateString('ru-RU')}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(warehouse)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(warehouse.id)}
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
          Показано от 1 до {warehouses.length} из {warehouses.length}
        </div>
        <div className="pagination">
          <button className="pagination-btn" disabled>‹</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn" disabled>›</button>
        </div>
      </div>
    </div>
  )
}

export default WarehousesTable

