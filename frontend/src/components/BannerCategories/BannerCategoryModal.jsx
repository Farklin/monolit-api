import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { bannerCategoriesApi } from '../../api/banners'
import { useProject } from '../../context/ProjectContext'
import BannerSelector from '../common/BannerSelector'
import ContextSelector from '../Header/ContextSelector'
import './BannerCategoryModal.css'

const BannerCategoryModal = ({ category, onClose, onSuccess }) => {
  const { selectedContext } = useProject()
  const [formData, setFormData] = useState({
    name: '',
    banner_id: '',
    type: 'catalog',
    category_id: '',
    priority: 1
  })
  const [loading, setLoading] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)

  const categoryTypes = [
    { value: 'catalog', label: 'Каталог' },
    { value: 'promo', label: 'Промо' }
  ]

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        banner_id: category.banner_id || '',
        type: category.type || 'catalog',
        category_id: category.category_id || '',
        priority: category.priority || 1
      })
      // Загружаем информацию о выбранном баннере
      if (category.banner_id) {
        setSelectedBanner({ id: category.banner_id })
      }
    }
  }, [category])


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBannerSelect = (banner) => {
    setSelectedBanner(banner)
    setFormData(prev => ({
      ...prev,
      banner_id: banner.id
    }))
  }

  const handleBannerClear = () => {
    setSelectedBanner(null)
    setFormData(prev => ({
      ...prev,
      banner_id: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Валидация
    if (!formData.name.trim()) {
      toast.error('Пожалуйста, введите название категории')
      return
    }

    if (!selectedContext) {
      toast.error('Пожалуйста, выберите контекст')
      return
    }

    if (!formData.banner_id) {
      toast.error('Пожалуйста, введите ID баннера')
      return
    }

    if (!formData.category_id) {
      toast.error('Пожалуйста, введите ID категории')
      return
    }

    if (!formData.priority || formData.priority < 1) {
      toast.error('Приоритет должен быть больше 0')
      return
    }

    setLoading(true)

    try {
      const submitData = {
        name: formData.name.trim(),
        context_id: selectedContext.id,
        banner_id: parseInt(formData.banner_id),
        type: formData.type,
        category_id: parseInt(formData.category_id),
        priority: parseInt(formData.priority)
      }

      if (category) {
        // Обновление существующей категории
        await bannerCategoriesApi.updateBannerCategory(category.id, submitData)
        toast.success('Категория баннера успешно обновлена')
      } else {
        // Создание новой категории
        await bannerCategoriesApi.createBannerCategory(submitData)
        toast.success('Категория баннера успешно создана')
      }

      onSuccess()
    } catch (error) {
      console.error('Ошибка при сохранении категории баннера:', error)
      const errorMessage = error.response?.data?.message || 'Ошибка при сохранении категории баннера'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      banner_id: '',
      type: 'catalog',
      category_id: '',
      priority: 1
    })
    setSelectedBanner(null)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{category ? 'Редактировать категорию баннера' : 'Добавить категорию баннера'}</h3>
          <button type="button" className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Название категории *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Введите название категории"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="context_id">Контекст *</label>
              <ContextSelector />
              {selectedContext && (
                <small className="form-help">
                  Выбранный контекст: {selectedContext.name} (ID: {selectedContext.id})
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="banner_id">Баннер *</label>
              <BannerSelector
                selectedBanner={selectedBanner}
                onSelect={handleBannerSelect}
                onClear={handleBannerClear}
                excludeId={category?.id}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Тип категории *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {categoryTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category_id">ID категории *</label>
              <input
                type="number"
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="ID категории"
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Приоритет *</label>
            <input
              type="number"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Приоритет отображения"
              required
              min="1"
            />
            <small className="form-help">
              Чем меньше число, тем выше приоритет отображения
            </small>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : (category ? 'Обновить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BannerCategoryModal
