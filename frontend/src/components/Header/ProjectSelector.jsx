import React, { useState, useEffect, useRef } from 'react'
import { useProject } from '../../context/ProjectContext'
import { projectsAPI } from '../../api/projects'
import './ProjectSelector.css'

const ProjectSelector = () => {
  const { selectedProject, selectProject } = useProject()
  const [projects, setProjects] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    loadProjects()
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

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsAPI.getAll()
      setProjects(data)
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProject = (project) => {
    selectProject(project)
    setIsOpen(false)
  }

  return (
    <div className="project-selector" ref={dropdownRef}>
      <button
        className="project-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="project-icon">🎯</span>
        <span className="project-name">
          {selectedProject ? selectedProject.name : 'Выберите проект'}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="project-dropdown">
          {loading ? (
            <div className="dropdown-loading">Загрузка...</div>
          ) : projects.length === 0 ? (
            <div className="dropdown-empty">Нет доступных проектов</div>
          ) : (
            <>
              {selectedProject && (
                <div className="dropdown-section">
                  <div className="dropdown-label">Текущий проект</div>
                  <div className="dropdown-item current">
                    <span className="project-icon-small">🎯</span>
                    {selectedProject.name}
                  </div>
                </div>
              )}
              <div className="dropdown-section">
                <div className="dropdown-label">Все проекты</div>
                {projects.map(project => (
                  <button
                    key={project.id}
                    className={`dropdown-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                    onClick={() => handleSelectProject(project)}
                  >
                    <span className="project-icon-small">🎯</span>
                    {project.name}
                    {selectedProject?.id === project.id && (
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

export default ProjectSelector

