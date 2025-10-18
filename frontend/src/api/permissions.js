import axios from './axios'

// Получить все разрешения
export const getPermissions = async () => {
  const response = await axios.get('/permissions')
  return response.data
}

// Получить разрешение по ID
export const getPermission = async (id) => {
  const response = await axios.get(`/permissions/${id}`)
  return response.data
}

// Создать разрешение
export const createPermission = async (permissionData) => {
  const response = await axios.post('/permissions', permissionData)
  return response.data
}

// Обновить разрешение
export const updatePermission = async (id, permissionData) => {
  const response = await axios.put(`/permissions/${id}`, permissionData)
  return response.data
}

// Удалить разрешение
export const deletePermission = async (id) => {
  const response = await axios.delete(`/permissions/${id}`)
  return response.data
}

