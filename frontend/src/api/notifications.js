import axiosInstance from './axios'

// Получить список уведомлений для текущего пользователя
export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get('/notifications')
    return response.data
  } catch (error) {
    console.error('Ошибка при получении уведомлений:', error)
    throw error
  }
}

// Отметить уведомление как прочитанное
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`)
    return response.data
  } catch (error) {
    console.error('Ошибка при отметке уведомления как прочитанного:', error)
    throw error
  }
}

// Отметить все уведомления как прочитанные
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.put('/notifications/mark-all-read')
    return response.data
  } catch (error) {
    console.error('Ошибка при отметке всех уведомлений как прочитанных:', error)
    throw error
  }
}

// Удалить уведомление
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`)
    return response.data
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error)
    throw error
  }
}

// Очистить все уведомления
export const clearAllNotifications = async () => {
  try {
    const response = await axiosInstance.delete('/notifications/clear-all')
    return response.data
  } catch (error) {
    console.error('Ошибка при очистке всех уведомлений:', error)
    throw error
  }
}

// Отправить системное уведомление (только для админов)
export const sendSystemNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post('/notifications/send', notificationData)
    return response.data
  } catch (error) {
    console.error('Ошибка при отправке системного уведомления:', error)
    throw error
  }
}

// Отправить уведомление конкретному пользователю (только для админов)
export const sendUserNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post('/notifications/send-to-user', notificationData)
    return response.data
  } catch (error) {
    console.error('Ошибка при отправке уведомления пользователю:', error)
    throw error
  }
}
