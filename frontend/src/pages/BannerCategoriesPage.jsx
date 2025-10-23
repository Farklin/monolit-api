import React from 'react'
import BannerCategoriesTable from '../components/BannerCategories/BannerCategoriesTable'
import './BannerCategoriesPage.css'

const BannerCategoriesPage = () => {
  return (
    <div className="banner-categories-page">
      <div className="page-header">
        <h1>Управление категориями баннеров</h1>
        <p>Создавайте и настраивайте категории для привязки баннеров к контекстам и категориям</p>
      </div>
      <BannerCategoriesTable />
    </div>
  )
}

export default BannerCategoriesPage
