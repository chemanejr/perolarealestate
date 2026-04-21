import React, { useState, useEffect } from 'react'
import { Bed, Bath, Square, Layers, Car, User, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import './PropertyDetail.css'

export default function PropertyDetail() {
  const { t } = useLanguage()
  const { id } = useParams()
  const { properties, loading } = useProperties()

  const property = properties.find(p => p.id.toString() === id)
  
  const [heroSlide, setHeroSlide] = useState(0)
  const [gallerySlide, setGallerySlide] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const thumbStripRef = React.useRef(null)

  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    timing: '',
    payment: '',
    objective: '',
    name: '',
    phone: '',
    email: ''
  });

  const similarProperties = properties.filter(p => property && p.id !== property.id).slice(0, 3)

  // Hero Logic (Dynamic - 2s)
  useEffect(() => {
    if (property && property.images && property.images.length > 1) {
      const timer = setInterval(() => {
        setHeroSlide(prev => (prev + 1) % property.images.length)
      }, 2000)
      return () => clearInterval(timer)
    }
  }, [property])

  // Sync Thumbnail Scroll (Paginação por Blocos de 3)
  useEffect(() => {
    if (thumbStripRef.current) {
      const thumbs = thumbStripRef.current.querySelectorAll('.static-thumb-item');
      if (thumbs.length > 0) {
        const imagesPerPage = 3;
        const pageIndex = Math.floor(gallerySlide / imagesPerPage);
        
        const firstThumbOfPage = thumbs[pageIndex * imagesPerPage];
        if (firstThumbOfPage) {
          thumbStripRef.current.scrollTo({
            left: firstThumbOfPage.offsetLeft - 20, // 20px de respiro
            behavior: 'smooth'
          });
        }
      }
    }
  }, [gallerySlide]);

  const nextHero = () => setHeroSlide(prev => (prev + 1) % property.images.length)
  const prevHero = () => setHeroSlide(prev => (prev - 1 + property.images.length) % property.images.length)

  const nextGallery = () => {
    if (property.images && gallerySlide < property.images.length - 1) {
      setGallerySlide(prev => prev + 1);
    }
  }
  const prevGallery = () => {
    if (gallerySlide > 0) {
      setGallerySlide(prev => prev - 1);
    }
  }

  const handleOptionSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormStep(prev => prev + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    console.log('Lead Data Submitted:', formData);
    alert('Obrigado! O nosso consultor entrará em contacto brevemente.');
  };

  if (loading) return <div className="property-detail-page"><div className="detail-container">A carregar...</div></div>
  if (!property) return <div className="property-detail-page"><div className="detail-container">Não encontrado.</div></div>

  return (
    <>
    <div className="property-detail-page">
      {/* Hero Section Estilo Landing Page */}
      <section className="hero-section hero-detail-height">
        <div className="hero-slideshow-container">
          {property.images && property.images.length > 0 ? (
            property.images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt="Hero" 
                className={`hero-slide ${idx === heroSlide ? 'active' : ''}`}
              />
            ))
          ) : (
            <img src="/villa-exterior.png" alt="Hero" className="hero-slide active" />
          )}
        </div>
        
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <p className="section-kicker" style={{color: 'var(--color-white)', opacity: 0.8}}>{property.location}</p>
          <h1>{property.title}</h1>
        </div>

        {/* Shape Divider (Igual à Home) */}
        <div className="hero-shape-divider">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V120H1200V0C1134,32,963,120,600,120S66,32,0,0Z" fill="var(--color-bg-light)" stroke="none"></path>
          </svg>
        </div>
      </section>

      <div className="detail-container">
        <div className="detail-content">
          <div className="title-area">
            {property.dealType && <span className="deal-badge">{property.dealType}</span>}
            <h1 className="detail-title">{property.title}</h1>
          </div>
          <p className="detail-price">{property.price}</p>

          <div className="specs-row">
            <div className="spec-box">
              <Bed size={20} className="icon-gold" />
              <span className="spec-label">{t('property.specs.beds')}</span>
              <span className="spec-value">{property.bedrooms} {t('property.specs.beds')}</span>
            </div>
            <div className="spec-box">
              <Bath size={20} className="icon-gold" />
              <span className="spec-label">{t('property.specs.baths')}</span>
              <span className="spec-value">{property.bathrooms} {t('property.specs.baths')}</span>
            </div>
            <div className="spec-box">
              <Square size={20} className="icon-gold" />
              <span className="spec-label">{t('property.specs.area')}</span>
              <span className="spec-value">{property.area || 350} m²</span>
            </div>
          </div>

          {/* Galeria Estática Re-unificada */}
          <div className="property-static-gallery">
            <div className="static-main-stage" onClick={() => setIsModalOpen(true)} style={{cursor: 'zoom-in'}}>
              {property.images && (
                <img src={property.images[gallerySlide]} alt="Galeria" className="active" />
              )}
              
              <div className="zoom-hint">
                <Search size={16} /> <span>Clique para ampliar</span>
              </div>

              {/* Setas Condicionais (Início e Fim) */}
              {gallerySlide > 0 && (
                <button className="gallery-nav-btn prev" onClick={(e) => { e.stopPropagation(); prevGallery(); }}><ChevronLeft size={24} /></button>
              )}
              {property.images && gallerySlide < property.images.length - 1 && (
                <button className="gallery-nav-btn next" onClick={(e) => { e.stopPropagation(); nextGallery(); }}><ChevronRight size={24} /></button>
              )}
            </div>
            
            <div className="static-thumbnail-strip continuous-row" ref={thumbStripRef}>
              {property.images && property.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`static-thumb-item ${idx === gallerySlide ? 'active' : ''}`}
                  onClick={() => setGallerySlide(idx)}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="description-section">
            <h2>{t('property.description')}</h2>
            <p>{property.description}</p>
          </div>

          <div className="location-section">
            <h2>{t('property.location')}</h2>
            <div className="map-placeholder">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114781.56470001859!2d32.50209632465715!3d-25.867972744773418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee6fbbd1acda385%3A0xb330fe5e69bf17b!2sMaputo!5e0!3m2!1sen!2smz!4v1711820400000!5m2!1sen!2smz" 
                width="100%" height="100%" style={{border: 0}} allowFullScreen="" loading="lazy">
              </iframe>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="contact-card">
            <div className="form-header">
              <h3>Tenho Interesse</h3>
              <p>Deixe seus dados e o corretor entrará em contato.</p>
              <div className="form-step-indicator">Passo {formStep} de 4</div>
            </div>

            <div className="multi-step-form">
              {formStep === 1 && (
                <div className="form-step-content fade-in">
                  <h4>Quando você pretende comprar?</h4>
                  <div className="option-list">
                    {["Quero fechar o quanto antes", "Nos próximos 30 dias", "Em até 3 meses", "Em 6 meses ou mais", "Ainda estou pesquisando"].map(opt => (
                      <button key={opt} className="option-btn" onClick={() => handleOptionSelect('timing', opt)}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="form-step-content fade-in">
                  <h4>Como pretende pagar?</h4>
                  <div className="option-list">
                    {["Já tenho financiamento aprovado", "Vou pagar à vista", "Estou em processo de aprovação", "Ainda não sei"].map(opt => (
                      <button key={opt} className="option-btn" onClick={() => handleOptionSelect('payment', opt)}>{opt}</button>
                    ))}
                  </div>
                  <button className="back-link" onClick={() => setFormStep(1)}>&larr; Voltar</button>
                </div>
              )}

              {formStep === 3 && (
                <div className="form-step-content fade-in">
                  <h4>Qual o seu objetivo principal?</h4>
                  <div className="option-list">
                    {["Moradia Própria", "Investimento", "Segunda Residência / Férias", "Outro"].map(opt => (
                      <button key={opt} className="option-btn" onClick={() => handleOptionSelect('objective', opt)}>{opt}</button>
                    ))}
                  </div>
                  <button className="back-link" onClick={() => setFormStep(2)}>&larr; Voltar</button>
                </div>
              )}

              {formStep === 4 && (
                <form className="property-contact-form fade-in" onSubmit={handleFinalSubmit}>
                  <div className="input-group">
                    <label>NOME COMPLETO</label>
                    <input name="name" type="text" placeholder="Seu nome" required onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>WHATSAPP</label>
                    <input name="phone" type="text" placeholder="+258" required onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label>E-MAIL</label>
                    <input name="email" type="email" placeholder="Para receber detalhes" required onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="btn-primary">ENVIAR AGORA</button>
                  <button type="button" className="back-link" onClick={() => setFormStep(3)}>&larr; Voltar</button>
                </form>
              )}
            </div>

            <div className="agent-info">
              <div className="agent-avatar">
                <User size={24} color="var(--color-primary-dark)" />
              </div>
              <div>
                <span className="agent-label">{t('property.sidebar.agentLabel')}</span>
                <span className="agent-name">Pérola Real Estate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secção de Imóveis Similares */}
      <section className="similar-properties-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">{t('featured.kicker')}</p>
            <h2>Imóveis Semelhantes</h2>
          </div>
          <div className="properties-grid">
            {similarProperties.map(prop => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>
          <div className="btn-center">
             <Link to="/imoveis" className="btn-outline-dark">
                {t('featured.viewAll')}
             </Link>
          </div>
        </div>
      </section>
    </div>
    
    {/* Lightbox Modal */}
    {isModalOpen && (
      <div className="lightbox-modal" onClick={() => setIsModalOpen(false)}>
        <div className="lightbox-content">
          <button className="lightbox-close" onClick={() => setIsModalOpen(false)}>
            <ChevronRight style={{transform: 'rotate(90deg)'}} size={24} />
          </button>
          <img src={property.images[gallerySlide]} alt="Zoom" />
        </div>
      </div>
    )}
    </>
  )
}
