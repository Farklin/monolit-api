import React from 'react'
import './ContextsTable.css'

const ContextsTable = ({ contexts, projects, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка контекстов...</p>
      </div>
    )
  }

  if (contexts.length === 0) {
    return (
      <div className="empty-state">
        <p>Контексты не найдены</p>
      </div>
    )
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : `#${projectId}`
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
      <table className="contexts-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" className="table-checkbox" />
            </th>
            <th>ID</th>
            <th>Название</th>
            <th>Ключ</th>
            <th>Проект</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {contexts.map((context) => (
            <tr key={context.id}>
              <td>
                <input type="checkbox" className="table-checkbox" />
              </td>
              <td>{context.id}</td>
              <td className="context-name">{context.name}</td>
              <td className="context-key">{context.key}</td>
              <td className="project-name">{getProjectName(context.project_id)}</td>
              <td className="context-description">
                {context.description || 'Нет описания'}
              </td>
              <td>{getStatusBadge(context.status)}</td>
              <td>{getPriorityBadge(context.priority)}</td>
              <td>{new Date(context.created_at).toLocaleDateString('ru-RU')}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(context)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(context.id)}
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
          Показано от 1 до {contexts.length} из {contexts.length}
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

export default ContextsTable

