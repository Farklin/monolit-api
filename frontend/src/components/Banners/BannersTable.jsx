import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { bannersApi } from '../../api/banners'
import { useAuth } from '../../context/AuthContext'
import { PermissionEnum } from '../../utils/PermissionEnum'
import BannerModal from './BannerModal'
import './BannersTable.css'

const BannersTable = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [filterType, setFilterType] = useState('')
  const { hasPermission } = useAuth()

  const bannerTypes = [
    { value: '', label: 'Все типы' },
    { value: 'default', label: 'По умолчанию' },
    { value: 'mobile', label: 'Мобильный' },
    { value: 'tablet', label: 'Планшет' },
    { value: 'desktop', label: 'Десктоп' },
    { value: 'all', label: 'Все устройства' }
  ]

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const params = filterType ? { type: filterType } : {}
      const response = await bannersApi.getBanners(params)
      setBanners(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке баннеров:', error)
      toast.error('Ошибка при загрузке баннеров')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [filterType])

  const handleCreate = () => {
    setEditingBanner(null)
    setIsModalOpen(true)
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setIsModalOpen(true)
  }

  const handleDelete = async (banner) => {
    if (window.confirm('Вы уверены, что хотите удалить этот баннер?')) {
      try {
        await bannersApi.deleteBanner(banner.id)
        toast.success('Баннер успешно удален')
        fetchBanners()
      } catch (error) {
        console.error('Ошибка при удалении баннера:', error)
        toast.error('Ошибка при удалении баннера')
      }
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingBanner(null)
  }

  const handleModalSuccess = () => {
    fetchBanners()
    handleModalClose()
  }

  const getBannerTypeLabel = (type) => {
    const typeObj = bannerTypes.find(t => t.value === type)
    return typeObj ? typeObj.label : type
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-banner.png'
    return `/storage/${imagePath}`
  }

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <div>Загрузка баннеров...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="banners-header">
        <h2>Баннеры</h2>
        <div className="banners-controls">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            {bannerTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {hasPermission(PermissionEnum.CREATE_BANNER) && (
            <button type="button" onClick={handleCreate} className="btn btn-primary">
              Добавить баннер
            </button>
          )}
        </div>
      </div>

      <div className="banners-table-wrapper">
        <table className="banners-table">
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Тип</th>
              <th>Родительский баннер</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  Баннеры не найдены
                </td>
              </tr>
            ) : (
              banners.map(banner => (
                <tr key={banner.id}>
                  <td>
                    <div className="banner-image">
                      <img
                        src={getImageUrl(banner.image)}
                        alt={`Баннер ${banner.id}`}
                        onError={(e) => {
                          e.target.src = '/placeholder-banner.png'
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span className={`banner-type type-${banner.type}`}>
                      {getBannerTypeLabel(banner.type)}
                    </span>
                  </td>
                  <td>
                    {banner.banner_id ? (
                      <span className="parent-banner">ID: {banner.banner_id}</span>
                    ) : (
                      <span className="no-parent">Основной</span>
                    )}
                  </td>
                  <td>
                    {new Date(banner.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {hasPermission(PermissionEnum.UPDATE_BANNER) && (
                        <button
                          onClick={() => handleEdit(banner)}
                          className="btn-action edit"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                      )}
                      {hasPermission(PermissionEnum.DELETE_BANNER) && (
                        <button
                          onClick={() => handleDelete(banner)}
                          className="btn-action delete"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <BannerModal
          banner={editingBanner}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}

export default BannersTable
