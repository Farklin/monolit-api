import axios from 'axios'
import { toast } from 'react-toastify'

// Создаем экземпляр axios с базовой конфигурацией
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor для добавления токена, project_id и context_id в заголовки
axiosInstance.interceptors.request.use(
  (config) => {
    // Получаем токен авторизации из localStorage
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // Получаем project_id из localStorage
    const selectedProjectId = localStorage.getItem('selectedProjectId')
    if (selectedProjectId) {
      config.headers['X-Project-Id'] = selectedProjectId
    }

    // Получаем context_id из localStorage
    const selectedContextId = localStorage.getItem('selectedContextId')
    if (selectedContextId) {
      config.headers['X-Context-Id'] = selectedContextId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor для обработки ответов
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Обработка глобальных ошибок
    if (error.response?.status === 401) {
      console.error('Unauthorized - redirecting to login')
      // Удаляем токен и данные пользователя
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Перенаправляем на страницу логина
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 403) {
      // Обработка 403 - Доступ запрещен (недостаточно прав)
      const message = error.response?.data?.message || 'У вас недостаточно прав для выполнения этого действия'
      toast.error(message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: '🚫'
      })
      console.error('Forbidden:', message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

