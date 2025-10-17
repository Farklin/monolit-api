import React from 'react'
import './WarehouseStocksTable.css'

const WarehouseStocksTable = ({ stocks, warehouses, contexts, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка остатков...</p>
      </div>
    )
  }

  if (stocks.length === 0) {
    return (
      <div className="empty-state">
        <p>Остатки не найдены</p>
      </div>
    )
  }

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find(w => w.id === warehouseId)
    return warehouse ? warehouse.name : `#${warehouseId}`
  }

  const getContextName = (warehouseId) => {
    const warehouse = warehouses.find(w => w.id === warehouseId)
    if (!warehouse) return '-'
    const context = contexts.find(c => c.id === warehouse.context_id)
    return context ? context.name : '-'
  }

  const getQuantityStatus = (minQty, maxQty) => {
    const current = minQty // Здесь можно добавить логику текущего количества
    const percentage = (current / maxQty) * 100

    if (percentage < 30) {
      return <span className="qty-status low">Низкий</span>
    } else if (percentage < 70) {
      return <span className="qty-status medium">Средний</span>
    } else {
      return <span className="qty-status high">Высокий</span>
    }
  }

  return (
    <div className="table-container">
      <table className="stocks-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" className="table-checkbox" />
            </th>
            <th>ID</th>
            <th>Склад</th>
            <th>Контекст</th>
            <th>Категория</th>
            <th>Мин. количество</th>
            <th>Макс. количество</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>
                <input type="checkbox" className="table-checkbox" />
              </td>
              <td>{stock.id}</td>
              <td className="warehouse-name">{getWarehouseName(stock.warehouse_id)}</td>
              <td className="context-name">{getContextName(stock.warehouse_id)}</td>
              <td className="category-id">Категория #{stock.category_id}</td>
              <td className="quantity min">{stock.min_quantity}</td>
              <td className="quantity max">{stock.max_quantity}</td>
              <td>{getQuantityStatus(stock.min_quantity, stock.max_quantity)}</td>
              <td>{new Date(stock.created_at).toLocaleDateString('ru-RU')}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(stock)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(stock.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <div className="table-info">
          Показано от 1 до {stocks.length} из {stocks.length}
        </div>
        <div className="pagination">
          <button className="pagination-btn" disabled>‹</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn" disabled>›</button>
        </div>
      </div>
    </div>
  )
}

export default WarehouseStocksTable

