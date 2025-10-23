import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { bannersApi } from '../../api/banners'
import BannerSelector from '../common/BannerSelector'
import './BannerModal.css'

const BannerModal = ({ banner, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    images: [],
    type: 'default',
    banner_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])
  const [selectedParentBanner, setSelectedParentBanner] = useState(null)

  const bannerTypes = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'mobile', label: 'Мобильный' },
    { value: 'tablet', label: 'Планшет' },
    { value: 'desktop', label: 'Десктоп' },
    { value: 'all', label: 'Все устройства' }
  ]

  useEffect(() => {
    if (banner) {
      setFormData({
        images: [],
        type: banner.type || 'default',
        banner_id: banner.parent_id || ''
      })
      if (banner.image) {
        setPreviewUrls([`/storage/${banner.image}`])
      }
      // Загружаем информацию о родительском баннере
      if (banner.parent_id) {
        setSelectedParentBanner({ id: banner.parent_id })
      }
    }
  }, [banner])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validFiles = []
    const newPreviewUrls = []

    files.forEach((file, index) => {
      // Проверяем размер файла (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Файл "${file.name}" превышает максимальный размер 2MB`)
        return
      }

      // Проверяем тип файла
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Файл "${file.name}" имеет неподдерживаемый формат`)
        return
      }

      validFiles.push(file)

      // Создаем превью
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviewUrls[index] = e.target.result
        setPreviewUrls([...newPreviewUrls])
      }
      reader.readAsDataURL(file)
    })

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: validFiles
      }))
    }
  }

  const handleParentBannerSelect = (parentBanner) => {
    setSelectedParentBanner(parentBanner)
    setFormData(prev => ({
      ...prev,
      banner_id: parentBanner.id
    }))
  }

  const handleParentBannerClear = () => {
    setSelectedParentBanner(null)
    setFormData(prev => ({
      ...prev,
      banner_id: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.images.length === 0 && !banner) {
      toast.error('Пожалуйста, выберите изображения')
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()

      if (banner) {
        // Обновление существующего баннера (только один файл)
        if (formData.images.length > 0) {
          submitData.append('image', formData.images[0])
        }
        submitData.append('type', formData.type)

        if (formData.banner_id) {
          submitData.append('banner_id', formData.banner_id)
        }

        await bannersApi.updateBanner(banner.id, submitData)
        toast.success('Баннер успешно обновлен')
      } else {
        // Создание новых баннеров (множественная загрузка)
        formData.images.forEach(file => {
          submitData.append('banners[]', file)
        })
        submitData.append('type', formData.type)

        if (formData.banner_id) {
          submitData.append('banner_id', formData.banner_id)
        }

        await bannersApi.uploadBanners(submitData)
        toast.success(`Успешно загружено ${formData.images.length} баннеров`)
      }

      onSuccess()
    } catch (error) {
      console.error('Ошибка при сохранении баннера:', error)
      const errorMessage = error.response?.data?.message || 'Ошибка при сохранении баннера'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      images: [],
      type: 'default',
      banner_id: ''
    })
    setPreviewUrls([])
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{banner ? 'Редактировать баннер' : 'Добавить баннер'}</h3>
          <button type="button" className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="image">Изображение баннера *</label>
            <div className="file-input-container">
              <input
                type="file"
                id="image"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-input-label">
                {formData.images.length > 0 ? `Выбрано файлов: ${formData.images.length}` : 'Выберите файлы'}
              </label>
            </div>
            {previewUrls.length > 0 && (
              <div className="image-preview">
                {previewUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Превью ${index + 1}`} />
                ))}
              </div>
            )}
            <small className="form-help">
              Поддерживаемые форматы: JPEG, PNG, JPG, GIF, SVG. Максимальный размер: 2MB
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="type">Тип баннера *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              {bannerTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="banner_id">Родительский баннер</label>
            <BannerSelector
              selectedBanner={selectedParentBanner}
              onSelect={handleParentBannerSelect}
              onClear={handleParentBannerClear}
              excludeId={banner?.id}
            />
            {selectedParentBanner && (
              <small className="form-help">
                Выбранный родительский баннер: ID {selectedParentBanner.id}
              </small>
            )}
            <small className="form-help">
              Выберите родительский баннер, если это дочерний баннер
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
              {loading ? 'Сохранение...' : (banner ? 'Обновить' : 'Загрузить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BannerModal
