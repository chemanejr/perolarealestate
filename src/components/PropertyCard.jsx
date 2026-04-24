import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, Trash2, Edit, Loader } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import EditPropertyModal from './EditPropertyModal'
import './PropertyCard.css'

export default function PropertyCard({ id, images = [], image, title, price, location, beds, baths, area, status, dealType, exclusive, onDelete }) {
  const { t } = useLanguage()
  const { isAdmin } = useAuth()
  const displayImages = images && images.length > 0 ? images : [image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [deleting, setDeleting]     = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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


  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm(`Remover "${title}" do website?`)) return
    setDeleting(true)
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (!error && onDelete) onDelete(id)
    setDeleting(false)
  }

  return (
    <div className="property-card">
      <div className="property-image-wrapper">
        <img src={displayImages[currentIdx]} alt={title} className="property-image" loading="lazy" decoding="async" />
        
        {isAdmin && (
          <div className="property-admin-actions">
            {!String(id).startsWith('json_') && (
              <button
                className="property-edit-btn"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(true); }}
                title="Editar imóvel"
              >
                <Edit size={14} />
              </button>
            )}
            <button
              className="property-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Remover imóvel"
            >
              {deleting ? <Loader size={14} className="spin" /> : <Trash2 size={14} />}
            </button>
          </div>
        )}
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

      {showEditModal && (
        <EditPropertyModal 
          property={{ id, images, image, title, price, location, beds, baths, area, status, dealType, exclusive }} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </div>
  )
}
