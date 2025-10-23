import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { bannerCategoriesApi } from '../../api/banners'
import { useAuth } from '../../context/AuthContext'
import { PermissionEnum } from '../../utils/PermissionEnum'
import BannerCategoryModal from './BannerCategoryModal'
import './BannerCategoriesTable.css'

const BannerCategoriesTable = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [filters, setFilters] = useState({
    context_id: '',
    type: '',
    category_id: ''
  })
  const { hasPermission } = useAuth()

  const categoryTypes = [
    { value: '', label: 'Все типы' },
    { value: 'catalog', label: 'Каталог' },
    { value: 'promo', label: 'Промо' }
  ]

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
      const response = await bannerCategoriesApi.getBannerCategories(params)
      setCategories(response.data || [])
    } catch (error) {
      console.error('Ошибка при загрузке категорий баннеров:', error)
      toast.error('Ошибка при загрузке категорий баннеров')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [filters])

  const handleCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDelete = async (category) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию баннера?')) {
      try {
        await bannerCategoriesApi.deleteBannerCategory(category.id)
        toast.success('Категория баннера успешно удалена')
        fetchCategories()
      } catch (error) {
        console.error('Ошибка при удалении категории баннера:', error)
        toast.error('Ошибка при удалении категории баннера')
      }
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleModalSuccess = () => {
    fetchCategories()
    handleModalClose()
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getCategoryTypeLabel = (type) => {
    const typeObj = categoryTypes.find(t => t.value === type)
    return typeObj ? typeObj.label : type
  }

  if (loading) {
    return (
      <div className="banner-categories-table-container">
        <div className="loading">Загрузка категорий баннеров...</div>
      </div>
    )
  }

  return (
    <div className="banner-categories-table-container">
      <div className="banner-categories-header">
        <h2>Категории баннеров</h2>
        <div className="banner-categories-controls">
          <div className="filters">
            <input
              type="number"
              placeholder="ID контекста"
              value={filters.context_id}
              onChange={(e) => handleFilterChange('context_id', e.target.value)}
              className="filter-input"
            />
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              {categoryTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="ID категории"
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="filter-input"
            />
          </div>
          {hasPermission(PermissionEnum.CREATE_BANNER_CATEGORY) && (
            <button type="button" onClick={handleCreate} className="btn btn-primary">
              Добавить категорию
            </button>
          )}
        </div>
      </div>

      <div className="banner-categories-table-wrapper">
        <table className="banner-categories-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Контекст ID</th>
              <th>Баннер ID</th>
              <th>Тип</th>
              <th>Категория ID</th>
              <th>Приоритет</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  Категории баннеров не найдены
                </td>
              </tr>
            ) : (
              categories.map(category => (
                <tr key={category.id}>
                  <td>
                    <span className="category-name">{category.name}</span>
                  </td>
                  <td>
                    <span className="context-id">{category.context_id}</span>
                  </td>
                  <td>
                    <span className="banner-id">{category.banner_id}</span>
                  </td>
                  <td>
                    <span className={`category-type type-${category.type}`}>
                      {getCategoryTypeLabel(category.type)}
                    </span>
                  </td>
                  <td>
                    <span className="category-id">{category.category_id}</span>
                  </td>
                  <td>
                    <span className="priority">{category.priority}</span>
                  </td>
                  <td>
                    {new Date(category.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {hasPermission(PermissionEnum.UPDATE_BANNER_CATEGORY) && (
                        <button
                          onClick={() => handleEdit(category)}
                          className="btn btn-sm btn-secondary"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                      )}
                      {hasPermission(PermissionEnum.DELETE_BANNER_CATEGORY) && (
                        <button
                          onClick={() => handleDelete(category)}
                          className="btn btn-sm btn-danger"
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
        <BannerCategoryModal
          category={editingCategory}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}

export default BannerCategoriesTable
