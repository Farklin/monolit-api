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

// Добавить роль пользователю
export const addRoleToUser = async (userId, roleId) => {
  const response = await axiosInstance.post('/users/roles/add', {
    user_id: userId,
    role_id: roleId
  })
  return response.data
}

// Удалить роль у пользователя
export const removeRoleFromUser = async (userId, roleId) => {
  const response = await axiosInstance.delete('/users/roles/remove', {
    data: {
      user_id: userId,
      role_id: roleId
    }
  })
  return response.data
}

// Добавить разрешение пользователю
export const addPermissionToUser = async (userId, permissionId) => {
  const response = await axiosInstance.post('/users/permissions/add', {
    user_id: userId,
    permission_id: permissionId
  })
  return response.data
}

// Удалить разрешение у пользователя
export const removePermissionFromUser = async (userId, permissionId) => {
  const response = await axiosInstance.delete('/users/permissions/remove', {
    data: {
      user_id: userId,
      permission_id: permissionId
    }
  })
  return response.data
}

// Разлогинить пользователя (удалить все его токены)
export const logoutUser = async (userId) => {
  const response = await axiosInstance.post(`/users/${userId}/logout`)
  return response.data
}
