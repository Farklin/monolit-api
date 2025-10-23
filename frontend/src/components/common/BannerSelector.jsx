import React, { useState, useEffect, useRef } from 'react'
import { bannersApi } from '../../api/banners'
import './BannerSelector.css'

const BannerSelector = ({ selectedBanner, onSelect, onClear, disabled = false, excludeId = null }) => {
  const [banners, setBanners] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBanners, setFilteredBanners] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    loadBanners()
  }, [])

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Фильтрация баннеров при изменении поиска
  useEffect(() => {
    let filtered = banners

    // Исключаем баннер с excludeId
    if (excludeId) {
      filtered = filtered.filter(banner => banner.id !== excludeId)
    }

    if (searchTerm.trim() === '') {
      setFilteredBanners(filtered)
    } else {
      const searchFiltered = filtered.filter(banner => {
        const typeMatch = banner.type.toLowerCase().includes(searchTerm.toLowerCase())
        const idMatch = banner.id.toString().includes(searchTerm)
        return typeMatch || idMatch
      })
      setFilteredBanners(searchFiltered)
    }
  }, [searchTerm, banners, excludeId])

  const loadBanners = async () => {
    try {
      setLoading(true)
      const response = await bannersApi.getBanners()
      setBanners(response.data)
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBanner = (banner) => {
    onSelect(banner)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClearBanner = () => {
    onClear()
    setIsOpen(false)
    setSearchTerm('')
  }

  const getBannerTypeLabel = (type) => {
    const typeLabels = {
      'default': 'По умолчанию',
      'mobile': 'Мобильный',
      'tablet': 'Планшет',
      'desktop': 'Десктоп',
      'all': 'Все устройства'
    }
    return typeLabels[type] || type
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-banner.png'
    return `/storage/${imagePath}`
  }

  if (disabled) {
    return (
      <div className="banner-selector disabled">
        <button className="banner-selector-btn" disabled>
          <span className="banner-icon">🖼️</span>
          <span className="banner-name">Выбор недоступен</span>
          <span className="dropdown-arrow">▼</span>
        </button>
      </div>
    )
  }

  return (
    <div className="banner-selector" ref={dropdownRef}>
      <button
        type="button"
        className="banner-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="banner-icon">🖼️</span>
        <span className="banner-name">
          {selectedBanner ? `ID: ${selectedBanner.id} (${getBannerTypeLabel(selectedBanner.type)})` : 'Выберите баннер'}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="banner-dropdown">
          <div className="dropdown-search">
            <input
              type="text"
              placeholder="🔍 Поиск по типу или ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm('')}
                title="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>

          {loading ? (
            <div className="dropdown-loading">Загрузка баннеров...</div>
          ) : filteredBanners.length === 0 ? (
            <div className="dropdown-empty">
              {searchTerm ? 'Ничего не найдено' : 'Нет доступных баннеров'}
            </div>
          ) : (
            <>
              {selectedBanner && (
                <>
                  <div className="dropdown-section">
                    <div className="dropdown-label">Текущий баннер</div>
                    <div className="dropdown-item current">
                      <div className="banner-preview-small">
                        <img
                          src={getImageUrl(selectedBanner.image)}
                          alt={`Баннер ${selectedBanner.id}`}
                          onError={(e) => {
                            e.target.src = '/placeholder-banner.png'
                          }}
                        />
                      </div>
                      <div className="banner-info">
                        <span className="banner-id">ID: {selectedBanner.id}</span>
                        <span className="banner-type">{getBannerTypeLabel(selectedBanner.type)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="dropdown-clear-btn"
                    onClick={handleClearBanner}
                  >
                    ✕ Сбросить баннер
                  </button>
                </>
              )}
              <div className="dropdown-section">
                <div className="dropdown-label">
                  Все баннеры ({filteredBanners.length})
                </div>
                <div className="banners-list">
                  {filteredBanners.map(banner => (
                    <button
                      key={banner.id}
                      type="button"
                      className={`dropdown-item banner-item ${selectedBanner?.id === banner.id ? 'active' : ''}`}
                      onClick={() => handleSelectBanner(banner)}
                    >
                      <div className="banner-preview-small">
                        <img
                          src={getImageUrl(banner.image)}
                          alt={`Баннер ${banner.id}`}
                          onError={(e) => {
                            e.target.src = '/placeholder-banner.png'
                          }}
                        />
                      </div>
                      <div className="banner-info">
                        <span className="banner-id">ID: {banner.id}</span>
                        <span className="banner-type">{getBannerTypeLabel(banner.type)}</span>
                        {banner.parent_id && (
                          <span className="parent-info">Родитель: {banner.parent_id}</span>
                        )}
                      </div>
                      {selectedBanner?.id === banner.id && (
                        <span className="check-mark">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default BannerSelector
