import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-container">
              <img src="/logo.png" alt="Pérola Real Estate Logo" className="footer-logo-img" />
              <h3 className="footer-logo">Pérola Real Estate</h3>
            </div>
            <p>
              {t('footer.brandDesc')}
            </p>
          </div>
          
          <div className="footer-links">
            <h4>{t('footer.linksTitle')}</h4>
            <ul>
              <li><Link to="/sobre">{t('footer.links.about')}</Link></li>
              <li><Link to="/imoveis">{t('footer.links.props')}</Link></li>
              <li><Link to="#">{t('footer.links.invest')}</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>{t('footer.supportTitle')}</h4>
            <ul>
              <li><Link to="/contacto">{t('footer.support.client')}</Link></li>
              <li><Link to="#">{t('footer.support.terms')}</Link></li>
              <li><Link to="#">{t('footer.support.privacy')}</Link></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>{t('footer.newsletterTitle')}</h4>
            <p>{t('footer.newsletterDesc')}</p>
            <form className="newsletter-form">
              <input type="email" placeholder={t('footer.newsletterPlaceholder')} />
              <button type="submit" aria-label="Subscrever"><ArrowRight size={16} /></button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.rights')}</p>
          <div className="footer-socials">
            <a href="#"><Facebook size={18} /></a>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
