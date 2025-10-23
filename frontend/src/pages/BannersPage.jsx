import React from 'react'
import BannersTable from '../components/Banners/BannersTable'
import './BannersPage.css'

const BannersPage = () => {
  return (
    <div className="banners-page">
      <div className="page-header">
        <h1>Управление баннерами</h1>
        <p>Загружайте и управляйте баннерами для различных типов устройств</p>
      </div>
      <BannersTable />
    </div>
  )
}

export default BannersPage
