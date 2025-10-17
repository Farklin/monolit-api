import React from 'react'
import './ProjectsTable.css'

const ProjectsTable = ({ projects, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка проектов...</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>Проекты не найдены</p>
      </div>
    )
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
      <table className="projects-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" className="table-checkbox" />
            </th>
            <th>ID</th>
            <th>Название</th>
            <th>Ключ</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>
                <input type="checkbox" className="table-checkbox" />
              </td>
              <td>{project.id}</td>
              <td className="project-name">{project.name}</td>
              <td className="project-key">{project.key}</td>
              <td className="project-description">
                {project.description || 'Нет описания'}
              </td>
              <td>{getStatusBadge(project.status)}</td>
              <td>{getPriorityBadge(project.priority)}</td>
              <td>{new Date(project.created_at).toLocaleDateString('ru-RU')}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(project)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(project.id)}
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
          Показано от 1 до {projects.length} из {projects.length}
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

export default ProjectsTable

