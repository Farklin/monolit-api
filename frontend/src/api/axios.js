import axios from 'axios'

// Создаем экземпляр axios с базовой конфигурацией
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor для добавления project_id и context_id в заголовки
axiosInstance.interceptors.request.use(
  (config) => {
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

// Interceptor для обработки ответов (опционально)
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Здесь можно обработать глобальные ошибки
    if (error.response?.status === 401) {
      console.error('Unauthorized')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

