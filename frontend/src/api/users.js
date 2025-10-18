import axiosInstance from './axios'

// Получить всех пользователей
export const getUsers = async () => {
  const response = await axiosInstance.get('/users')
  return response.data
}

// Получить пользователя по ID
export const getUser = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`)
  return response.data
}

// Создать пользователя
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData)
  return response.data
}

// Обновить пользователя
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/users/${id}`, userData)
  return response.data
}

// Удалить пользователя
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`)
  return response.data
}

