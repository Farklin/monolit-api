import axios from './axios'

export const projectsAPI = {
  // Получить все проекты
  getAll: async () => {
    const response = await axios.get('/projects')
    return response.data
  },

  // Получить проект по ID
  getById: async (id) => {
    const response = await axios.get(`/projects/${id}`)
    return response.data
  },

  // Создать новый проект
  create: async (projectData) => {
    const response = await axios.post('/projects', projectData)
    return response.data
  },

  // Обновить проект
  update: async (id, projectData) => {
    const response = await axios.put(`/projects/${id}`, projectData)
    return response.data
  },

  // Удалить проект
  delete: async (id) => {
    const response = await axios.delete(`/projects/${id}`)
    return response.data
  },

  // Получить контексты проекта
  getContexts: async (projectId) => {
    const response = await axios.get(`/projects/${projectId}/contexts`)
    return response.data
  }
}

