import React, { useState, useEffect } from 'react'
import { useProject } from '../context/ProjectContext'
import ContextsTable from '../components/Contexts/ContextsTable'
import ContextModal from '../components/Contexts/ContextModal'
import { contextsAPI } from '../api/contexts'
import { projectsAPI } from '../api/projects'
import './ContextsPage.css'

const ContextsPage = () => {
  const { selectedProject } = useProject()
  const [contexts, setContexts] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContext, setEditingContext] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedProject])

  const loadData = async () => {
    try {
      setLoading(true)
      const projectsData = await projectsAPI.getAll()
      setProjects(projectsData)

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

  const handleAddContext = () => {
    if (!selectedProject) {
      alert('Пожалуйста, выберите проект в шапке')
      return
    }
    setEditingContext(null)
    setIsModalOpen(true)
  }

  const handleEditContext = (context) => {
    setEditingContext(context)
    setIsModalOpen(true)
  }

  const handleDeleteContext = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот контекст?')) {
      return
    }

    try {
      await contextsAPI.delete(id)
      await loadData()
    } catch (error) {
      console.error('Ошибка удаления контекста:', error)
      alert('Не удалось удалить контекст')
    }
  }

  const handleSaveContext = async (contextData) => {
    try {
      if (editingContext) {
        await contextsAPI.update(editingContext.id, contextData)
      } else {
        await contextsAPI.create(contextData)
      }
      await loadData()
      setIsModalOpen(false)
      setEditingContext(null)
    } catch (error) {
      console.error('Ошибка сохранения контекста:', error)
      throw error
    }
  }

  const filteredContexts = contexts.filter(context =>
    context.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    context.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (context.description && context.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="contexts-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Контексты</h2>
          <button className="btn-primary" onClick={handleAddContext}>
            + Добавить контекст
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
            <span className="search-count">{filteredContexts.length}</span>
          </label>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по названию, ключу или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ContextsTable
        contexts={filteredContexts}
        projects={projects}
        loading={loading}
        onEdit={handleEditContext}
        onDelete={handleDeleteContext}
      />

      {isModalOpen && (
        <ContextModal
          context={editingContext}
          projects={projects}
          onClose={() => {
            setIsModalOpen(false)
            setEditingContext(null)
          }}
          onSave={handleSaveContext}
        />
      )}
    </div>
  )
}

export default ContextsPage

