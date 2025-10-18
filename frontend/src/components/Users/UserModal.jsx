import React, { useState, useEffect } from 'react'
import './UserModal.css'

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }

    // Проверяем пароль только для нового пользователя или если пароль заполнен
    if (!user || formData.password) {
      if (!formData.password) {
        if (!user) {
          newErrors.password = 'Пароль обязателен'
        }
      } else if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать минимум 6 символов'
      }

      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Пароли не совпадают'
      }
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
      // Подготавливаем данные для отправки
      const dataToSend = {
        name: formData.name,
        email: formData.email
      }

      // Добавляем пароль только если он указан
      if (formData.password) {
        dataToSend.password = formData.password
        dataToSend.password_confirmation = formData.password_confirmation
      }

      await onSave(dataToSend)
      onClose()
    } catch (error) {
      console.error('Error saving user:', error)
      
      // Обработка ошибок валидации с сервера
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message })
      } else {
        setErrors({ general: 'Произошла ошибка при сохранении' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getUserInitial = () => {
    if (formData.name) {
      return formData.name.charAt(0).toUpperCase()
    }
    if (formData.email) {
      return formData.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{user ? 'Редактировать пользователя' : 'Добавить пользователя'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}

          {/* Аватар превью */}
          <div className="user-avatar-preview">
            <div className="user-avatar-large">
              {getUserInitial()}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">
              Имя <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите имя пользователя"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                Пароль {!user && <span className="required">*</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={user ? 'Оставьте пустым для сохранения текущего' : 'Минимум 6 символов'}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation">
                Подтверждение пароля {!user && <span className="required">*</span>}
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Повторите пароль"
                className={errors.password_confirmation ? 'error' : ''}
              />
              {errors.password_confirmation && (
                <span className="error-message">{errors.password_confirmation}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : user ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal

