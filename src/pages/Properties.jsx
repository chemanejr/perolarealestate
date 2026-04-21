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
  const ITEMS_PER_PAGE = 24

  // Filter States
  const [selectedPurpose, setSelectedPurpose] = React.useState('')
  const [selectedType, setSelectedType] = React.useState('')
  const [locationQuery, setLocationQuery] = React.useState('')
  const [minPrice, setMinPrice] = React.useState('')
  const [maxPrice, setMaxPrice] = React.useState('')
  const [rooms, setRooms] = React.useState('')
  const [status, setStatus] = React.useState('')
  
  // UI States for Custom Price
  const [customMin, setCustomMin] = React.useState(false)
  const [customMax, setCustomMax] = React.useState(false)

  // Result States
  const [filteredProperties, setFilteredProperties] = React.useState([])
  const [isFiltered, setIsFiltered] = React.useState(false)

  React.useEffect(() => {
    if (!loading && properties.length > 0 && !isFiltered) {
      setFilteredProperties(properties)
    }
  }, [loading, properties, isFiltered])

  const handleFilter = () => {
    let result = [...properties]

    // 1. Filter by Purpose (Heuristic: "/ Mês" means Rent)
    if (selectedPurpose && selectedPurpose !== t('hero.search.buy') && selectedPurpose !== t('hero.search.rent')) {
      // Ignora se for o placeholder
    } else if (selectedPurpose) {
      const isRentSearch = selectedPurpose === t('hero.search.rent')
      result = result.filter(p => {
        const isRentProperty = p.price.includes('Mês')
        return isRentSearch ? isRentProperty : !isRentProperty
      })
    }

    // 2. Filter by Type
    if (selectedType && selectedType !== t('catalog.filters.type')) {
      result = result.filter(p => p.type.toLowerCase().includes(selectedType.toLowerCase()) || 
                                 t(`hero.search.${p.type.toLowerCase()}`).toLowerCase() === selectedType.toLowerCase())
    }

    // 3. Filter by Location
    if (locationQuery) {
      result = result.filter(p => p.location.toLowerCase().includes(locationQuery.toLowerCase()))
    }

    // 4. Filter by Price
    const parsePrice = (priceStr) => {
      if (!priceStr) return 0
      return parseInt(priceStr.replace(/[^\d]/g, '')) || 0
    }

    if (minPrice) {
      const minVal = parsePrice(minPrice)
      result = result.filter(p => parsePrice(p.price) >= minVal)
    }
    if (maxPrice) {
      const maxVal = parsePrice(maxPrice)
      result = result.filter(p => parsePrice(p.price) <= maxVal)
    }

    // 5. Filter by Rooms
    if (rooms && rooms !== t('hero.search.rooms')) {
      const roomVal = parseInt(rooms)
      if (rooms === '4+') {
        result = result.filter(p => parseInt(p.bedrooms) >= 4)
      } else {
        result = result.filter(p => parseInt(p.bedrooms) === roomVal)
      }
    }

    setFilteredProperties(result)
    setIsFiltered(true)
    setCurrentPage(1)
  }

  const finalDisplay = isFiltered ? filteredProperties : properties
  const totalPages = Math.ceil(finalDisplay.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProperties = finalDisplay.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">{t('hero.search.type')}</option>
            <option value={t('hero.search.apartment')}>{t('hero.search.apartment')}</option>
            <option value={t('hero.search.villa')}>{t('hero.search.villa')}</option>
            <option value={t('hero.search.office')}>{t('hero.search.office')}</option>
          </select>
          <ChevronDown size={16} />
        </div>
        
        <div className="filter-select">
          <select value={selectedPurpose} onChange={(e) => setSelectedPurpose(e.target.value)}>
            <option value="">{t('catalog.filters.purpose')}</option>
            <option value={t('hero.search.buy')}>{t('hero.search.buy')}</option>
            <option value={t('hero.search.rent')}>{t('hero.search.rent')}</option>
          </select>
          <ChevronDown size={16} />
        </div>

        <div className="filter-input-wrapper">
          <input 
            type="text" 
            placeholder={t('catalog.filters.location')}
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>

        <div className="filter-select price-select">
          {!customMin ? (
            <select 
              value={minPrice} 
              onChange={(e) => e.target.value === 'other' ? setCustomMin(true) : setMinPrice(e.target.value)}
            >
              <option value="">{t('catalog.filters.minPrice')}</option>
              <option value="10000000">10.000.000 MT</option>
              <option value="25000000">25.000.000 MT</option>
              <option value="50000000">50.000.000 MT</option>
              <option value="other">Outros</option>
            </select>
          ) : (
            <input 
              type="text" 
              placeholder="Min MT" 
              autoFocus
              onBlur={(e) => { if(!e.target.value) setCustomMin(false) }}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          )}
          {!customMin && <ChevronDown size={16} />}
        </div>

        <div className="filter-select price-select">
          {!customMax ? (
            <select 
              value={maxPrice} 
              onChange={(e) => e.target.value === 'other' ? setCustomMax(true) : setMaxPrice(e.target.value)}
            >
              <option value="">{t('catalog.filters.maxPrice')}</option>
              <option value="25000000">25.000.000 MT</option>
              <option value="50000000">50.000.000 MT</option>
              <option value="100000000">100.000.000 MT</option>
              <option value="other">Outros</option>
            </select>
          ) : (
            <input 
              type="text" 
              placeholder="Max MT" 
              autoFocus
              onBlur={(e) => { if(!e.target.value) setCustomMax(false) }}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          )}
          {!customMax && <ChevronDown size={16} />}
        </div>

        <button className="filter-btn" onClick={handleFilter}>{t('catalog.filters.btn')}</button>
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
