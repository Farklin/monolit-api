import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../api/auth'
import { toast } from 'react-toastify'
import './LoginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await loginApi(formData.email, formData.password)

      if (response.status) {
        // Успешный вход - сохраняем данные пользователя
        // Примечание: имя пользователя не приходит в ответе, поэтому используем email
        login({ email: formData.email, name: formData.email.split('@')[0] }, response.token)
        toast.success('Вход выполнен успешно!', {
          position: 'top-right',
          autoClose: 3000
        })
        navigate('/')
      } else {
        toast.error(response.message || 'Ошибка входа', {
          position: 'top-right'
        })
      }
    } catch (error) {
      console.error('Login error:', error)

      if (error.response?.data?.errors) {
        // Ошибки валидации
        setErrors(error.response.data.errors)
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          position: 'top-right'
        })
      } else {
        toast.error('Произошла ошибка при входе', {
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
          <h1>Вход</h1>
          <p>Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            />
            {errors.password && (
              <span className="error-message">{errors.password[0]}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-link">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

