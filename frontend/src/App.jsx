import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext'
import Layout from './components/Layout/Layout'
import ProjectsPage from './pages/ProjectsPage'
import ContextsPage from './pages/ContextsPage'
import WarehousesPage from './pages/WarehousesPage'
import WarehouseStocksPage from './pages/WarehouseStocksPage'
import './App.css'

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contexts" element={<ContextsPage />} />
            <Route path="/warehouses" element={<WarehousesPage />} />
            <Route path="/warehouse-stocks" element={<WarehouseStocksPage />} />
          </Routes>
        </Layout>
      </Router>
    </ProjectProvider>
  )
}

export default App

