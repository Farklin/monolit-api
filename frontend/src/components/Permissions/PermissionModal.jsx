import React, { useState, useEffect } from 'react'
import './PermissionModal.css'

const PermissionModal = ({ isOpen, onClose, onSubmit, permission }) => {
  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web'
  })

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || '',
        guard_name: permission.guard_name || 'web'
      })
    } else {
      setFormData({
        name: '',
        guard_name: 'web'
      })
    }
  }, [permission])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: '', guard_name: 'web' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{permission ? 'Редактировать разрешение' : 'Создать разрешение'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Название разрешения *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например: create users, edit posts"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="guard_name">Guard</label>
            <select
              id="guard_name"
              name="guard_name"
              value={formData.guard_name}
              onChange={handleChange}
            >
              <option value="web">web</option>
              <option value="api">api</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary">
              {permission ? 'Обновить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PermissionModal

