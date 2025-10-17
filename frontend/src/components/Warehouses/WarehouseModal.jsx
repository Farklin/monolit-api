import React, { useState, useEffect } from 'react'
import { useProject } from '../../context/ProjectContext'
import './WarehouseModal.css'

const WarehouseModal = ({ warehouse, contexts, onClose, onSave }) => {
  const { selectedContext } = useProject()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    context_id: '',
    status: true,
    priority: 2
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || '',
        description: warehouse.description || '',
        content: warehouse.content || '',
        context_id: warehouse.context_id || '',
        status: warehouse.status ?? true,
        priority: warehouse.priority || 2
      })
    } else if (selectedContext) {
      // Автоматически подставляем выбранный контекст при создании
      setFormData(prev => ({
        ...prev,
        context_id: selectedContext.id
      }))
    }
  }, [warehouse, selectedContext])

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

    if (!formData.context_id) {
      newErrors.context_id = 'Выберите контекст'
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
        context_id: parseInt(formData.context_id),
        priority: parseInt(formData.priority)
      })
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        alert('Произошла ошибка при сохранении склада')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{warehouse ? 'Редактировать склад' : 'Добавить склад'}</h2>
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
              placeholder="Введите название склада"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="context_id">
              Контекст <span className="required">*</span>
            </label>
            <select
              id="context_id"
              name="context_id"
              value={formData.context_id}
              onChange={handleChange}
              className={errors.context_id ? 'error' : ''}
              disabled={!!selectedContext && !warehouse}
            >
              <option value="">Выберите контекст</option>
              {contexts.map(context => (
                <option key={context.id} value={context.id}>
                  {context.name}
                </option>
              ))}
            </select>
            {selectedContext && !warehouse && (
              <small className="form-hint">
                Выбран контекст из шапки: <strong>{selectedContext.name}</strong>
              </small>
            )}
            {errors.context_id && <span className="error-message">{errors.context_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Введите описание склада (необязательно)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Содержимое</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              placeholder="Введите содержимое склада (необязательно)"
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
              {saving ? 'Сохранение...' : (warehouse ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WarehouseModal

