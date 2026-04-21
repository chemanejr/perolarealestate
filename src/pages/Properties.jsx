import React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { useLanguage } from '../contexts/LanguageContext'
import { useProperties } from '../hooks/useProperties'
import './Properties.css'

export default function Properties() {
  const { t } = useLanguage()
  const { properties, loading } = useProperties()

  return (
    <div className="properties-page">
      <div className="catalog-header">
        <div className="catalog-container">
          <h1>{t('catalog.title')}</h1>
          <p>
            {t('catalog.desc')}
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-select">
          <select>
             <option>{t('catalog.filters.type')}</option>
          </select>
          <ChevronDown size={16} />
        </div>
        <div className="filter-select">
          <select>
             <option>{t('catalog.filters.purpose')}</option>
          </select>
          <ChevronDown size={16} />
        </div>
        <div className="filter-select">
          <select>
             <option>{t('catalog.filters.location')}</option>
          </select>
          <ChevronDown size={16} />
        </div>
        <div className="filter-select">
          <select>
             <option>{t('catalog.filters.minPrice')}</option>
          </select>
          <ChevronDown size={16} />
        </div>
        <div className="filter-select">
          <select>
             <option>{t('catalog.filters.maxPrice')}</option>
          </select>
          <ChevronDown size={16} />
        </div>
        <button className="filter-btn">{t('catalog.filters.btn')}</button>
      </div>

      <div className="catalog-grid">
        {loading ? <p>A carregar imóveis...</p> : properties.map(p => (
          <PropertyCard key={p.id} {...p} />
        ))}
      </div>

      <div className="pagination">
        <button className="page-nav"><ChevronLeft size={16} /></button>
        <button className="page-num active">1</button>
        <button className="page-num">2</button>
        <button className="page-num">3</button>
        <button className="page-nav"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}
