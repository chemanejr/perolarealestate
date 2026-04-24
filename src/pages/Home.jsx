import React, { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, Key, ShieldCheck, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import { useLanguage } from '../contexts/LanguageContext'
import { useProperties } from '../hooks/useProperties'
import './Home.css'

export default function Home() {
  const { t } = useLanguage()
  const { properties: featuredProperties, loading } = useProperties()
  // We'll just show the first 6 properties on the home page as featured
  const displayProperties = featuredProperties.slice(0, 6)
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = ["/hero_1.jpg", "/hero_2.jpg"]

  const [customMin, setCustomMin] = useState(false)
  const [customMax, setCustomMax] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${slides[currentSlide]})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>

          <div className="search-bar">
            {/* Row 1 */}
            <select className="search-select">
              <option>{t('hero.search.buy')}</option>
              <option>{t('hero.search.rent')}</option>
            </select>
            <select className="search-select">
              <option>{t('hero.search.type')}</option>
              <option>{t('hero.search.apartment')}</option>
              <option>{t('hero.search.villa')}</option>
              <option>{t('hero.search.office')}</option>
            </select>

            {/* Row 2 - Wide on Desktop */}
            <div className="search-input-group full-row desktop-span-2">
              <input type="text" placeholder={t('catalog.filters.location')} />
            </div>

            {/* Row 3 */}
            <div className="search-field-container">
              {!customMin ? (
                <select className="search-select" onChange={(e) => e.target.value === 'other' && setCustomMin(true)}>
                  <option>{t('hero.search.minPrice')}</option>
                  <option>10.000.000 MT</option>
                  <option>20.000.000 MT</option>
                  <option>50.000.000 MT</option>
                  <option value="other">Outros</option>
                </select>
              ) : (
                <div className="custom-input-wrapper">
                  <input type="text" autoFocus placeholder="Min. MT" onBlur={(e) => e.target.value === '' && setCustomMin(false)} />
                  <button onClick={() => setCustomMin(false)}>×</button>
                </div>
              )}
            </div>

            <div className="search-field-container">
              {!customMax ? (
                <select className="search-select" onChange={(e) => e.target.value === 'other' && setCustomMax(true)}>
                  <option>{t('hero.search.maxPrice')}</option>
                  <option>20.000.000 MT</option>
                  <option>50.000.000 MT</option>
                  <option>100.000.000 MT</option>
                  <option value="other">Outros</option>
                </select>
              ) : (
                <div className="custom-input-wrapper">
                  <input type="text" autoFocus placeholder="Max. MT" onBlur={(e) => e.target.value === '' && setCustomMax(false)} />
                  <button onClick={() => setCustomMax(false)}>×</button>
                </div>
              )}
            </div>

            {/* Row 4 */}
            <select className="search-select">
              <option>{t('hero.search.rooms')}</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4+</option>
            </select>
            <select className="search-select">
              <option>{t('hero.search.status')}</option>
              <option>Pronto</option>
              <option>Em Construção</option>
              <option>Novo</option>
            </select>

            {/* Row 5 - Part of the single row on Desktop */}
            <button className="search-btn full-row desktop-span-search">{t('hero.search.btn')}</button>
          </div>
        </div>

        {/* Shape Divider */}
        <div className="hero-shape-divider">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V120H1200V0C1134,32,963,120,600,120S66,32,0,0Z" fill="var(--color-bg-light)" stroke="none"></path>
          </svg>
        </div>
      </section>

      {/* Destaques */}
      <section className="featured-section">
        <div className="section-header">
          <p className="section-kicker">{t('featured.kicker')}</p>
          <h2>{t('featured.title')}</h2>
        </div>
        <div className="properties-grid">
          {loading ? <p>A carregar imóveis...</p> : displayProperties.map(prop => (
            <PropertyCard key={prop.id} {...prop} />
          ))}
        </div>
        <div className="btn-center">
          <Link to="/imoveis" className="btn-outline-dark">
            {t('featured.viewAll')}
          </Link>
        </div>
      </section>

      {/* Serviços */}
      <section className="services-section">
        <div className="section-header text-center">
          <p className="section-kicker">{t('services.kicker')}</p>
          <h2>{t('services.title')}</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon-wrapper"><Key size={24} /></div>
            <h3>{t('services.s1.title')}</h3>
            <p>{t('services.s1.desc')}</p>
          </div>
          <div className="service-card">
            <div className="icon-wrapper"><Briefcase size={24} /></div>
            <h3>{t('services.s2.title')}</h3>
            <p>{t('services.s2.desc')}</p>
          </div>
          <div className="service-card">
            <div className="icon-wrapper"><ShieldCheck size={24} /></div>
            <h3>{t('services.s3.title')}</h3>
            <p>{t('services.s3.desc')}</p>
          </div>
        </div>
      </section>

      {/* Porquê a Pérola */}
      <section className="why-us-section">
        <div className="why-us-container">
          <div className="why-us-content">
            <h2>{t('whyUs.title')}</h2>
            <div className="features-grid">
              <div className="feature-item">
                <CheckCircle className="icon-gold" size={20} />
                <div>
                  <h4>{t('whyUs.f1.title')}</h4>
                  <p>{t('whyUs.f1.desc')}</p>
                </div>
              </div>
              <div className="feature-item">
                <CheckCircle className="icon-gold" size={20} />
                <div>
                  <h4>{t('whyUs.f2.title')}</h4>
                  <p>{t('whyUs.f2.desc')}</p>
                </div>
              </div>
              <div className="feature-item">
                <CheckCircle className="icon-gold" size={20} />
                <div>
                  <h4>{t('whyUs.f3.title')}</h4>
                  <p>{t('whyUs.f3.desc')}</p>
                </div>
              </div>
              <div className="feature-item">
                <CheckCircle className="icon-gold" size={20} />
                <div>
                  <h4>{t('whyUs.f4.title')}</h4>
                  <p>{t('whyUs.f4.desc')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="why-us-image">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Nosso Escritório" />
            <div className="experience-badge">
              <span className="years">+15</span>
              <span className="text">ANOS DE EXPERIÊNCIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-header">
            <h2>Pronto Para Transformar a Sua Procura?</h2>
            <p>Agende uma consultoria gratuita com a nossa equipa.</p>
          </div>
          <div className="cta-form-box">
            <form className="cta-form" action="https://formsubmit.co/geral@perolarealestate.co.mz" method="POST">
              <input type="hidden" name="_subject" value="Novo Contacto - Pérola Real Estate" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://perolarealestate.vercel.app/" />

              <div className="form-row">
                <div className="input-group">
                  <label>NOME</label>
                  <input type="text" name="nome" placeholder="O seu nome completo" required />
                </div>
                <div className="input-group">
                  <label>TELEFONE/WHATSAPP</label>
                  <input type="text" name="telefone" placeholder="+258" required />
                </div>
              </div>
              <div className="input-group full-width">
                <label>MENSAGEM</label>
                <textarea name="mensagem" placeholder="Como podemos ajudar?" rows="2" required></textarea>
              </div>
              <button type="submit" className="btn-primary">ENVIAR MENSAGEM</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
