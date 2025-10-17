import React, { useState, useEffect } from 'react'
import { useProject } from '../context/ProjectContext'
import WarehousesTable from '../components/Warehouses/WarehousesTable'
import WarehouseModal from '../components/Warehouses/WarehouseModal'
import { warehousesAPI } from '../api/warehouses'
import { projectsAPI } from '../api/projects'
import { contextsAPI } from '../api/contexts'
import './WarehousesPage.css'

const WarehousesPage = () => {
  const { selectedProject, selectedContext } = useProject()
  const [warehouses, setWarehouses] = useState([])
  const [contexts, setContexts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedProject, selectedContext])

  const loadData = async () => {
    try {
      setLoading(true)
      let warehousesData = await warehousesAPI.getAll()

      // Фильтруем склады по выбранному контексту
      if (selectedContext) {
        warehousesData = warehousesData.filter(w => w.context_id === selectedContext.id)
      }

      setWarehouses(warehousesData)

      // Загружаем контексты выбранного проекта или все контексты
      let contextsData
      if (selectedProject) {
        contextsData = await projectsAPI.getContexts(selectedProject.id)
      } else {
        contextsData = await contextsAPI.getAll()
      }
      setContexts(contextsData)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      alert('Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }

  const handleAddWarehouse = () => {
    if (!selectedProject) {
      alert('Пожалуйста, выберите проект в шапке')
      return
    }
    setEditingWarehouse(null)
    setIsModalOpen(true)
  }

  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse)
    setIsModalOpen(true)
  }

  const handleDeleteWarehouse = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот склад?')) {
      return
    }

    try {
      await warehousesAPI.delete(id)
      await loadData()
    } catch (error) {
      console.error('Ошибка удаления склада:', error)
      alert('Не удалось удалить склад')
    }
  }

  const handleSaveWarehouse = async (warehouseData) => {
    try {
      if (editingWarehouse) {
        await warehousesAPI.update(editingWarehouse.id, warehouseData)
      } else {
        await warehousesAPI.create(warehouseData)
      }
      await loadData()
      setIsModalOpen(false)
      setEditingWarehouse(null)
    } catch (error) {
      console.error('Ошибка сохранения склада:', error)
      throw error
    }
  }

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (warehouse.description && warehouse.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="warehouses-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Склады</h2>
          <button className="btn-primary" onClick={handleAddWarehouse}>
            + Добавить склад
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">Фильтры</h3>
          <button className="filters-toggle">▼</button>
        </div>
        <div className="search-wrapper">
          <label className="search-label">
            Поиск
            <span className="search-count">{filteredWarehouses.length}</span>
          </label>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <WarehousesTable
        warehouses={filteredWarehouses}
        contexts={contexts}
        loading={loading}
        onEdit={handleEditWarehouse}
        onDelete={handleDeleteWarehouse}
      />

      {isModalOpen && (
        <WarehouseModal
          warehouse={editingWarehouse}
          contexts={contexts}
          onClose={() => {
            setIsModalOpen(false)
            setEditingWarehouse(null)
          }}
          onSave={handleSaveWarehouse}
        />
      )}
    </div>
  )
}

export default WarehousesPage

