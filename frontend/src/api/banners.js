import axiosInstance from './axios'

// API для работы с баннерами
export const bannersApi = {
  // Получить список баннеров
  getBanners: (params = {}) => {
    return axiosInstance.get('/banners', { params })
  },

  // Получить баннер по ID
  getBanner: (id) => {
    return axiosInstance.get(`/banners/${id}`)
  },

  // Загрузить баннеры
  uploadBanners: (formData) => {
    return axiosInstance.post('/banners/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Обновить баннер
  updateBanner: (id, formData) => {
    return axiosInstance.put(`/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Удалить баннер
  deleteBanner: (id) => {
    return axiosInstance.delete(`/banners/${id}`)
  }
}

// API для работы с категориями баннеров
export const bannerCategoriesApi = {
  // Получить список категорий баннеров
  getBannerCategories: (params = {}) => {
    return axiosInstance.get('/banner-categories', { params })
  },

  // Создать категорию баннера
  createBannerCategory: (data) => {
    return axiosInstance.post('/banner-categories', data)
  },

  // Обновить категорию баннера
  updateBannerCategory: (id, data) => {
    return axiosInstance.put(`/banner-categories/${id}`, data)
  },

  // Удалить категорию баннера
  deleteBannerCategory: (id) => {
    return axiosInstance.delete(`/banner-categories/${id}`)
  }
}
