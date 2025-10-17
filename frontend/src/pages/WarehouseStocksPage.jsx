import React, { useState, useEffect } from 'react'
import { useProject } from '../context/ProjectContext'
import WarehouseStocksTable from '../components/WarehouseStocks/WarehouseStocksTable'
import StockModal from '../components/WarehouseStocks/StockModal'
import { warehousesAPI, warehouseStocksAPI } from '../api/warehouses'
import { projectsAPI } from '../api/projects'
import { contextsAPI } from '../api/contexts'
import './WarehouseStocksPage.css'

const WarehouseStocksPage = () => {
  const { selectedProject, selectedContext } = useProject()
  const [stocks, setStocks] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [contexts, setContexts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedProject, selectedContext])

  const loadData = async () => {
    try {
      setLoading(true)

      // Загружаем склады
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

      // Загружаем остатки со складов
      // API автоматически фильтрует по X-Project-Id и X-Context-Id из заголовков
      const stocksData = await warehouseStocksAPI.getAll()
      setStocks(stocksData)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      alert('Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = () => {
    if (!selectedProject) {
      alert('Пожалуйста, выберите проект в шапке')
      return
    }
    setEditingStock(null)
    setIsModalOpen(true)
  }

  const handleEditStock = (stock) => {
    setEditingStock(stock)
    setIsModalOpen(true)
  }

  const handleDeleteStock = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот остаток?')) {
      return
    }

    try {
      await warehouseStocksAPI.delete(id)
      await loadData()
    } catch (error) {
      console.error('Ошибка удаления остатка:', error)
      alert('Не удалось удалить остаток')
    }
  }

  const handleSaveStock = async (stockData) => {
    try {
      if (editingStock) {
        await warehouseStocksAPI.update(editingStock.id, stockData)
      } else {
        await warehouseStocksAPI.create(stockData)
      }
      await loadData()
      setIsModalOpen(false)
      setEditingStock(null)
    } catch (error) {
      console.error('Ошибка сохранения остатка:', error)
      throw error
    }
  }

  const filteredStocks = stocks.filter(stock => {
    const warehouse = warehouses.find(w => w.id === stock.warehouse_id)
    const warehouseName = warehouse ? warehouse.name.toLowerCase() : ''
    return warehouseName.includes(searchQuery.toLowerCase()) ||
           stock.category_id.toString().includes(searchQuery)
  })

  return (
    <div className="warehouse-stocks-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Остатки по складам</h2>
          <button className="btn-primary" onClick={handleAddStock}>
            + Добавить остаток
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
            <span className="search-count">{filteredStocks.length}</span>
          </label>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по складу или категории..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <WarehouseStocksTable
        stocks={filteredStocks}
        warehouses={warehouses}
        contexts={contexts}
        loading={loading}
        onEdit={handleEditStock}
        onDelete={handleDeleteStock}
      />

      {isModalOpen && (
        <StockModal
          stock={editingStock}
          warehouses={warehouses}
          onClose={() => {
            setIsModalOpen(false)
            setEditingStock(null)
          }}
          onSave={handleSaveStock}
        />
      )}
    </div>
  )
}

export default WarehouseStocksPage

