import React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { useLanguage } from '../contexts/LanguageContext'
import { useProperties } from '../hooks/useProperties'
import './Properties.css'

export default function Properties() {
  const { t } = useLanguage()
  const { properties, loading } = useProperties()
  const [currentPage, setCurrentPage] = React.useState(1)
  const ITEMS_PER_PAGE = 9

  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProperties = properties.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
        {loading ? <p>A carregar imóveis...</p> : currentProperties.map(p => (
          <PropertyCard key={p.id} {...p} />
        ))}
      </div>

      {/* Paginação Dinâmica: Só aparece se houver mais de uma página */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-nav" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          {[...Array(totalPages)].map((_, idx) => (
            <button 
              key={idx + 1}
              className={`page-num ${currentPage === idx + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          
          <button 
            className="page-nav" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
