import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Layout from './components/Layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProjectsPage from './pages/ProjectsPage'
import ContextsPage from './pages/ContextsPage'
import WarehousesPage from './pages/WarehousesPage'
import WarehouseStocksPage from './pages/WarehouseStocksPage'
import UsersPage from './pages/UsersPage'
import RolesPage from './pages/RolesPage'
import PermissionsPage from './pages/PermissionsPage'
import NotificationListener from './components/Notifications/NotificationListener'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <NotificationProvider>
          <Router>
            <NotificationListener />
            <ToastContainer />
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Защищенные маршруты */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProjectsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProjectsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contexts"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ContextsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/warehouses"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <WarehousesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/warehouse-stocks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <WarehouseStocksPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UsersPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <RolesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/permissions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PermissionsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </NotificationProvider>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App

