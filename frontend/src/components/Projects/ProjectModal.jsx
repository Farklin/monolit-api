import React, { useState, useEffect } from 'react'
import './ProjectModal.css'

const ProjectModal = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    status: true,
    priority: 2
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        key: project.key || '',
        description: project.description || '',
        status: project.status ?? true,
        priority: project.priority || 2
      })
    }
  }, [project])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Очищаем ошибку для этого поля
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
        priority: parseInt(formData.priority)
      })
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        alert('Произошла ошибка при сохранении проекта')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{project ? 'Редактировать проект' : 'Добавить проект'}</h2>
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
              placeholder="Введите название проекта"
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
              placeholder="project-key"
              disabled={!!project}
            />
            <small className="form-hint">
              Уникальный идентификатор (только строчные буквы, цифры и дефисы)
            </small>
            {errors.key && <span className="error-message">{errors.key}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Введите описание проекта (необязательно)"
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
              {saving ? 'Сохранение...' : (project ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectModal

