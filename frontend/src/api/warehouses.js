import axios from './axios'

export const warehousesAPI = {
  // Получить все склады
  getAll: async () => {
    const response = await axios.get('/warehouses')
    return response.data
  },

  // Получить склад по ID
  getById: async (id) => {
    const response = await axios.get(`/warehouses/${id}`)
    return response.data
  },

  // Создать новый склад
  create: async (warehouseData) => {
    const response = await axios.post('/warehouses', warehouseData)
    return response.data
  },

  // Обновить склад
  update: async (id, warehouseData) => {
    const response = await axios.put(`/warehouses/${id}`, warehouseData)
    return response.data
  },

  // Удалить склад
  delete: async (id) => {
    const response = await axios.delete(`/warehouses/${id}`)
    return response.data
  },

  // Получить остатки на складах для категории
  getStocksForCategory: async (contextId, categoryId, strategy = 'base') => {
    const response = await axios.post('/warehouses/stocks', {
      context_id: contextId,
      category_id: categoryId,
      strategy: strategy
    })
    return response.data
  }
}

export const warehouseStocksAPI = {
  // Получить все остатки
  getAll: async () => {
    const response = await axios.get('/warehouse-stocks')
    return response.data
  },

  // Получить остаток по ID
  getById: async (id) => {
    const response = await axios.get(`/warehouse-stocks/${id}`)
    return response.data
  },

  // Создать остаток на складе
  create: async (stockData) => {
    const response = await axios.post('/warehouse-stocks', stockData)
    return response.data
  },

  // Обновить остаток
  update: async (id, stockData) => {
    const response = await axios.put(`/warehouse-stocks/${id}`, stockData)
    return response.data
  },

  // Удалить остаток
  delete: async (id) => {
    const response = await axios.delete(`/warehouse-stocks/${id}`)
    return response.data
  }
}

