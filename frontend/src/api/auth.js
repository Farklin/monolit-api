import axiosInstance from './axios'

// Регистрация пользователя
export const register = async (name, email, password) => {
  const response = await axiosInstance.post('/auth/register', {
    name,
    email,
    password
  })
  return response.data
}

// Вход пользователя
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password
  })
  return response.data
}

// Выход (если нужен endpoint на сервере)
export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Получение данных текущего пользователя
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/user')
  return response.data
}

