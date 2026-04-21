import React, { useState, useEffect } from 'react'
import { Target, Eye, ShieldCheck, MessageSquare, Award, Clock, Star, Users, MapPin, Key } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import './About.css'

export default function About() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = ["/hero_1.jpg", "/hero_2.jpg"]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 3000) // 3 seconds per slide for a majestic feel
    return () => clearInterval(timer)
  }, [slides.length])


  return (
    <div className="about-page">
      <div 
        className="about-hero"
        style={{ backgroundImage: `url(${slides[currentSlide]})` }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-subtitle">{t('about.hero.kicker')}</span>
          <h1>{t('about.hero.title')}<br/><span className="highlight-gold">{t('about.hero.brand')}</span></h1>
        </div>
      </div>

      <div className="mission-statement-section">
        <div className="mission-statement-container">
          <div className="mission-intro">
            <h2>{t('about.mission.title')}</h2>
          </div>
          <div className="mission-text">
             <div className="quote-icon"><MessageSquare color="white" size={24}/></div>
             <p>{t('about.mission.quote')}</p>
          </div>
        </div>
      </div>

      {/* NEW: Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">15+</span>
            <span className="stat-label">{t('about.stats.yoe')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">450+</span>
            <span className="stat-label">{t('about.stats.props')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">99%</span>
            <span className="stat-label">{t('about.stats.clients')}</span>
          </div>
        </div>
      </div>

      {/* RESTRUCTURED: Process instead of Values */}
      <div className="process-section">
        <div className="process-header">
           <span className="about-subtitle-dark">{t('about.process.subtitle')}</span>
           <h2>{t('about.process.title')}</h2>
        </div>
        <div className="process-grid">
          <div className="process-card">
            <div className="process-icon"><Star size={28} /></div>
            <h3>{t('about.process.p1.title')}</h3>
            <p>{t('about.process.p1.desc')}</p>
          </div>
          <div className="process-card">
            <div className="process-icon"><Users size={28} /></div>
            <h3>{t('about.process.p2.title')}</h3>
            <p>{t('about.process.p2.desc')}</p>
          </div>
          <div className="process-card">
            <div className="process-icon"><Key size={28} /></div>
            <h3>{t('about.process.p3.title')}</h3>
            <p>{t('about.process.p3.desc')}</p>
          </div>
        </div>
      </div>

      {/* NEW: Expertise Section */}
      <div className="expertise-section">
        <div className="expertise-container">
          <div className="expertise-content">
            <span className="about-subtitle">{t('about.expertise.subtitle')}</span>
            <h2>{t('about.expertise.title')}</h2>
            <p>{t('about.expertise.desc')}</p>
            <ul className="expertise-list">
              <li><Target size={20} className="icon-gold"/> Imóveis *Off-Market* Exclusivos</li>
              <li><ShieldCheck size={20} className="icon-gold"/> Segurança Contratual Blindada</li>
              <li><MapPin size={20} className="icon-gold"/> Cobertura Prime em Maputo e Matola</li>
            </ul>
          </div>
          <div className="expertise-image">
            <img src="/hero_2.jpg" alt="Maputo Skyline" />
          </div>
        </div>
      </div>


      <div className="about-cta-section">
         <h2>{t('about.cta.title')}</h2>
         <div className="about-cta-buttons">
           <Link to="/imoveis" className="btn-primary">{t('about.cta.explore')}</Link>
           <Link to="/contacto" className="btn-outline-light">{t('about.cta.schedule')}</Link>
         </div>
      </div>
    </div>
  )
}
