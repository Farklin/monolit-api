import axios from './axios'

// Получить все роли
export const getRoles = async () => {
  const response = await axios.get('/roles')
  return response.data
}

// Получить роль по ID
export const getRole = async (id) => {
  const response = await axios.get(`/roles/${id}`)
  return response.data
}

// Создать роль
export const createRole = async (roleData) => {
  const response = await axios.post('/roles', roleData)
  return response.data
}

// Удалить роль
export const deleteRole = async (id) => {
  const response = await axios.delete(`/roles/${id}`)
  return response.data
}

// Добавить разрешение к роли
export const addPermissionToRole = async (roleId, permissionId) => {
  const response = await axios.post('/roles/permissions/add', {
    role_id: roleId,
    permission_id: permissionId
  })
  return response.data
}

// Удалить разрешение из роли
export const removePermissionFromRole = async (roleId, permissionId) => {
  const response = await axios.delete('/roles/permissions/remove', {
    data: {
      role_id: roleId,
      permission_id: permissionId
    }
  })
  return response.data
}

