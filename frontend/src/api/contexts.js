import axios from './axios'

export const contextsAPI = {
  // Получить все контексты
  getAll: async () => {
    const response = await axios.get('/contexts')
    return response.data
  },

  // Получить контекст по ID
  getById: async (id) => {
    const response = await axios.get(`/contexts/${id}`)
    return response.data
  },

  // Создать новый контекст
  create: async (contextData) => {
    const response = await axios.post('/contexts', contextData)
    return response.data
  },

  // Обновить контекст
  update: async (id, contextData) => {
    const response = await axios.put(`/contexts/${id}`, contextData)
    return response.data
  },

  // Удалить контекст
  delete: async (id) => {
    const response = await axios.delete(`/contexts/${id}`)
    return response.data
  }
}

