import React, { useState, useEffect, useRef } from 'react'
import { useProject } from '../../context/ProjectContext'
import { projectsAPI } from '../../api/projects'
import './ContextSelector.css'

const ContextSelector = () => {
  const { selectedProject, selectedContext, selectContext } = useProject()
  const [contexts, setContexts] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (selectedProject) {
      loadContexts()
    } else {
      setContexts([])
      selectContext(null)
    }
  }, [selectedProject])

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

  const loadContexts = async () => {
    try {
      setLoading(true)
      const data = await projectsAPI.getContexts(selectedProject.id)
      setContexts(data)
    } catch (error) {
      console.error('Ошибка загрузки контекстов:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectContext = (context) => {
    selectContext(context)
    setIsOpen(false)
  }

  const handleClearContext = () => {
    selectContext(null)
    setIsOpen(false)
  }

  if (!selectedProject) {
    return (
      <div className="context-selector disabled">
        <button className="context-selector-btn" disabled>
          <span className="context-icon">📋</span>
          <span className="context-name">Сначала выберите проект</span>
          <span className="dropdown-arrow">▼</span>
        </button>
      </div>
    )
  }

  return (
    <div className="context-selector" ref={dropdownRef}>
      <button
        className="context-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="context-icon">📋</span>
        <span className="context-name">
          {selectedContext ? selectedContext.name : 'Выберите контекст'}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="context-dropdown">
          {loading ? (
            <div className="dropdown-loading">Загрузка...</div>
          ) : contexts.length === 0 ? (
            <div className="dropdown-empty">
              Нет контекстов для проекта "{selectedProject.name}"
            </div>
          ) : (
            <>
              {selectedContext && (
                <>
                  <div className="dropdown-section">
                    <div className="dropdown-label">Текущий контекст</div>
                    <div className="dropdown-item current">
                      <span className="context-icon-small">📋</span>
                      {selectedContext.name}
                    </div>
                  </div>
                  <button
                    className="dropdown-clear-btn"
                    onClick={handleClearContext}
                  >
                    ✕ Сбросить контекст
                  </button>
                </>
              )}
              <div className="dropdown-section">
                <div className="dropdown-label">Все контексты проекта</div>
                {contexts.map(context => (
                  <button
                    key={context.id}
                    className={`dropdown-item ${selectedContext?.id === context.id ? 'active' : ''}`}
                    onClick={() => handleSelectContext(context)}
                  >
                    <span className="context-icon-small">📋</span>
                    {context.name}
                    {selectedContext?.id === context.id && (
                      <span className="check-mark">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ContextSelector


