import React, { useState, useEffect } from 'react'
import { useProject } from '../../context/ProjectContext'
import './ContextModal.css'

const ContextModal = ({ context, projects, onClose, onSave }) => {
  const { selectedProject } = useProject()
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    project_id: '',
    status: true,
    priority: 2
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (context) {
      setFormData({
        name: context.name || '',
        key: context.key || '',
        description: context.description || '',
        project_id: context.project_id || '',
        status: context.status ?? true,
        priority: context.priority || 2
      })
    } else if (selectedProject) {
      // Автоматически подставляем выбранный проект при создании
      setFormData(prev => ({
        ...prev,
        project_id: selectedProject.id
      }))
    }
  }, [context, selectedProject])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно'
    }

    if (!formData.key.trim()) {
      newErrors.key = 'Ключ обязателен'
    } else if (!/^[a-z0-9-]+$/.test(formData.key)) {
      newErrors.key = 'Ключ может содержать только строчные буквы, цифры и дефисы'
    }

    if (!formData.project_id) {
      newErrors.project_id = 'Выберите проект'
    }

    if (!formData.priority || formData.priority < 1) {
      newErrors.priority = 'Выберите приоритет'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSaving(true)
    try {
      await onSave({
        ...formData,
        project_id: parseInt(formData.project_id),
        priority: parseInt(formData.priority)
      })
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        alert('Произошла ошибка при сохранении контекста')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{context ? 'Редактировать контекст' : 'Добавить контекст'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">
              Название <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Введите название контекста"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="key">
              Ключ <span className="required">*</span>
            </label>
            <input
              type="text"
              id="key"
              name="key"
              value={formData.key}
              onChange={handleChange}
              className={errors.key ? 'error' : ''}
              placeholder="context-key"
            />
            <small className="form-hint">
              Уникальный идентификатор (только строчные буквы, цифры и дефисы)
            </small>
            {errors.key && <span className="error-message">{errors.key}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="project_id">
              Проект <span className="required">*</span>
            </label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className={errors.project_id ? 'error' : ''}
              disabled={!!selectedProject && !context}
            >
              <option value="">Выберите проект</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {selectedProject && !context && (
              <small className="form-hint">
                Выбран проект из шапки: <strong>{selectedProject.name}</strong>
              </small>
            )}
            {errors.project_id && <span className="error-message">{errors.project_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Введите описание контекста (необязательно)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">
                Приоритет <span className="required">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={errors.priority ? 'error' : ''}
              >
                <option value="">Выберите приоритет</option>
                <option value="1">Высокий</option>
                <option value="2">Средний</option>
                <option value="3">Низкий</option>
              </select>
              {errors.priority && <span className="error-message">{errors.priority}</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <span>Активен</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : (context ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContextModal

