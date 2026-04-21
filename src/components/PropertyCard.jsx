import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import './PropertyCard.css'

export default function PropertyCard({ id, images = [], image, title, price, location, beds, baths, area, status, dealType, exclusive }) {
  const { t } = useLanguage()
  const displayImages = images && images.length > 0 ? images : [image];
  const [currentIdx, setCurrentIdx] = useState(0);

  // Dynamic status translation
  const getStatusLabel = (statusStr) => {
    if (!statusStr) return null;
    const key = statusStr.toLowerCase();
    if (t(`card.${key}`) !== `card.${key}`) {
      return t(`card.${key}`);
    }
    return statusStr;
  }

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };


  return (
    <div className="property-card">
      <div className="property-image-wrapper">
        <img src={displayImages[currentIdx]} alt={title} className="property-image" />
        
        {displayImages.length > 1 && (
          <>
            <button className="slider-arrow slider-prev" onClick={prevImage} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button className="slider-arrow slider-next" onClick={nextImage} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
            <div className="slider-dots">
              {displayImages.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`slider-dot ${idx === currentIdx ? 'active' : ''}`} 
                />
              ))}
            </div>
          </>
        )}

        <div className="property-badges">
          {dealType && <span className="badge badge-sale">{dealType}</span>}
          {exclusive && <span className="badge badge-dark">{t('card.exclusive')}</span>}
        </div>
      </div>
      <div className="property-content">
        <h3 className="property-title">{title}</h3>
        <p className="property-price">{price}</p>
        <div className="property-location">
          <MapPin size={14} className="icon-gold" />
          <span>{location}</span>
        </div>
        <div className="property-specs">
          <div className="spec-item">
            <Bed size={16} />
            <span>{beds} {t('card.beds')}</span>
          </div>
          <div className="spec-item">
            <Bath size={16} />
            <span>{baths} {t('card.baths')}</span>
          </div>
          <div className="spec-item">
            <Square size={16} />
            <span>{area}m²</span>
          </div>
        </div>
        {id && (
           <Link to={`/imoveis/${id}`} className="property-btn">
             {t('card.details')}
           </Link>
        )}
      </div>
    </div>
  )
}
