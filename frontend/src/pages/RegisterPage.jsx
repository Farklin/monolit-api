import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerApi } from '../api/auth'
import { toast } from 'react-toastify'
import './LoginPage.css'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = ['Пароли не совпадают']
    }

    if (formData.password.length < 6) {
      newErrors.password = ['Пароль должен содержать минимум 6 символов']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await registerApi(
        formData.name,
        formData.email,
        formData.password
      )

      if (response.status) {
        // Успешная регистрация
        login({ name: formData.name, email: formData.email }, response.token)
        toast.success('Регистрация успешна!', {
          position: 'top-right',
          autoClose: 3000
        })
        navigate('/')
      } else {
        toast.error(response.message || 'Ошибка регистрации', {
          position: 'top-right'
        })
      }
    } catch (error) {
      console.error('Register error:', error)

      if (error.response?.data?.errors) {
        // Ошибки валидации
        setErrors(error.response.data.errors)
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          position: 'top-right'
        })
      } else {
        toast.error('Произошла ошибка при регистрации', {
          position: 'top-right'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Регистрация</h1>
          <p>Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ваше имя"
              required
            />
            {errors.name && (
              <span className="error-message">{errors.name[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="your@email.com"
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
              required
              minLength={6}
            />
            {errors.password && (
              <span className="error-message">{errors.password[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Подтвердите пароль</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation ? 'error' : ''}
              placeholder="••••••••"
              required
            />
            {errors.password_confirmation && (
              <span className="error-message">{errors.password_confirmation[0]}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Уже есть аккаунт?{' '}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

