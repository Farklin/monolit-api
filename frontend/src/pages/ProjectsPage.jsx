import React, { useState, useEffect } from 'react'
import ProjectsTable from '../components/Projects/ProjectsTable'
import ProjectModal from '../components/Projects/ProjectModal'
import { projectsAPI } from '../api/projects'

import './ProjectsPage.css'

const ProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProjects()
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

  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      return
    }

    try {
      await projectsAPI.delete(id)
      await loadProjects()
    } catch (error) {
      console.error('Ошибка удаления проекта:', error)
      alert('Не удалось удалить проект')
    }
  }

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.id, projectData)
      } else {
        await projectsAPI.create(projectData)
      }
      await loadProjects()
      setIsModalOpen(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error)
      throw error
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="projects-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Проекты</h2>
          <button className="btn-primary" onClick={handleAddProject}>
            + Добавить проект
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
            <span className="search-count">{filteredProjects.length}</span>
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

      <ProjectsTable
        projects={filteredProjects}
        loading={loading}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setIsModalOpen(false)
            setEditingProject(null)
          }}
          onSave={handleSaveProject}
        />
      )}
    </div>
  )
}

export default ProjectsPage

