import React, { useState, useEffect } from 'react'
import { useProject } from '../../context/ProjectContext'
import './StockModal.css'

const StockModal = ({ stock, warehouses, onClose, onSave }) => {
  const { selectedContext } = useProject()
  const [formData, setFormData] = useState({
    warehouse_id: '',
    category_id: '',
    min_quantity: 0,
    max_quantity: 0
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Фильтруем склады по выбранному контексту
  // При редактировании не фильтруем, чтобы показать склад который уже выбран
  const filteredWarehouses = (selectedContext && !stock)
    ? warehouses.filter(w => w.context_id === selectedContext.id)
    : warehouses

  useEffect(() => {
    if (stock) {
      console.log('Editing stock:', stock)
      console.log('Warehouses:', warehouses)
      setFormData({
        warehouse_id: stock.warehouse_id || '',
        category_id: stock.category_id || '',
        min_quantity: stock.min_quantity || 0,
        max_quantity: stock.max_quantity || 0
      })
    }
  }, [stock, warehouses])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.warehouse_id) {
      newErrors.warehouse_id = 'Выберите склад'
    }

    if (!formData.category_id) {
      newErrors.category_id = 'ID категории обязателен'
    }

    if (formData.min_quantity < 0) {
      newErrors.min_quantity = 'Минимальное количество не может быть отрицательным'
    }

    if (formData.max_quantity < 0) {
      newErrors.max_quantity = 'Максимальное количество не может быть отрицательным'
    }

    if (parseInt(formData.max_quantity) < parseInt(formData.min_quantity)) {
      newErrors.max_quantity = 'Максимальное количество должно быть больше минимального'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSaving(true)
    try {
      await onSave({
        ...formData,
        warehouse_id: parseInt(formData.warehouse_id),
        category_id: parseInt(formData.category_id),
        min_quantity: parseInt(formData.min_quantity),
        max_quantity: parseInt(formData.max_quantity)
      })
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        alert('Произошла ошибка при сохранении остатка')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{stock ? 'Редактировать остаток' : 'Добавить остаток'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="warehouse_id">
              Склад <span className="required">*</span>
            </label>
            <select
              id="warehouse_id"
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              className={errors.warehouse_id ? 'error' : ''}
            >
              <option value="">Выберите склад</option>
              {filteredWarehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
            {selectedContext && !stock && (
              <small className="form-hint">
                Показаны склады контекста: <strong>{selectedContext.name}</strong>
              </small>
            )}
            {stock && (
              <small className="form-hint">
                При редактировании показаны все склады
              </small>
            )}
            {errors.warehouse_id && <span className="error-message">{errors.warehouse_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category_id">
              ID категории <span className="required">*</span>
            </label>
            <input
              type="number"
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={errors.category_id ? 'error' : ''}
              placeholder="Введите ID категории"
              min="1"
            />
            {errors.category_id && <span className="error-message">{errors.category_id}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="min_quantity">
                Мин. количество <span className="required">*</span>
              </label>
              <input
                type="number"
                id="min_quantity"
                name="min_quantity"
                value={formData.min_quantity}
                onChange={handleChange}
                className={errors.min_quantity ? 'error' : ''}
                placeholder="0"
                min="0"
              />
              {errors.min_quantity && <span className="error-message">{errors.min_quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="max_quantity">
                Макс. количество <span className="required">*</span>
              </label>
              <input
                type="number"
                id="max_quantity"
                name="max_quantity"
                value={formData.max_quantity}
                onChange={handleChange}
                className={errors.max_quantity ? 'error' : ''}
                placeholder="0"
                min="0"
              />
              {errors.max_quantity && <span className="error-message">{errors.max_quantity}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : (stock ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StockModal

