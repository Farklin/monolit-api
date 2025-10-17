import React, { createContext, useState, useContext, useEffect } from 'react'

const ProjectContext = createContext()

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedContext, setSelectedContext] = useState(null)
  const [loading, setLoading] = useState(true)

  // Загрузка из localStorage при инициализации
  useEffect(() => {
    const savedProjectId = localStorage.getItem('selectedProjectId')
    const savedProjectName = localStorage.getItem('selectedProjectName')
    const savedContextId = localStorage.getItem('selectedContextId')
    const savedContextName = localStorage.getItem('selectedContextName')

    if (savedProjectId && savedProjectName) {
      setSelectedProject({
        id: parseInt(savedProjectId),
        name: savedProjectName
      })
    }

    if (savedContextId && savedContextName) {
      setSelectedContext({
        id: parseInt(savedContextId),
        name: savedContextName
      })
    }

    setLoading(false)
  }, [])

  // Функция для установки выбранного проекта
  const selectProject = (project) => {
    if (project) {
      setSelectedProject(project)
      localStorage.setItem('selectedProjectId', project.id)
      localStorage.setItem('selectedProjectName', project.name)

      // При смене проекта сбрасываем контекст
      clearContext()
    } else {
      setSelectedProject(null)
      localStorage.removeItem('selectedProjectId')
      localStorage.removeItem('selectedProjectName')
      clearContext()
    }
  }

  // Функция для установки выбранного контекста
  const selectContext = (context) => {
    if (context) {
      setSelectedContext(context)
      localStorage.setItem('selectedContextId', context.id)
      localStorage.setItem('selectedContextName', context.name)
    } else {
      setSelectedContext(null)
      localStorage.removeItem('selectedContextId')
      localStorage.removeItem('selectedContextName')
    }
  }

  // Функция для очистки выбранного проекта
  const clearProject = () => {
    setSelectedProject(null)
    localStorage.removeItem('selectedProjectId')
    localStorage.removeItem('selectedProjectName')
    clearContext()
  }

  // Функция для очистки выбранного контекста
  const clearContext = () => {
    setSelectedContext(null)
    localStorage.removeItem('selectedContextId')
    localStorage.removeItem('selectedContextName')
  }

  const value = {
    selectedProject,
    selectedContext,
    selectProject,
    selectContext,
    clearProject,
    clearContext,
    loading
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

