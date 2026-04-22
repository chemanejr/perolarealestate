import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import AdminControls from './AdminControls'
import './Navbar.css'

export default function Navbar() {
  const { lang, t, toggleLanguage } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Pages where navbar should start transparent (with Hero images)
  const transparentPaths = ['/', '/sobre']
  const isPropertyDetail = location.pathname.startsWith('/imoveis/') && location.pathname !== '/imoveis'
  const hasHero = transparentPaths.includes(location.pathname) || isPropertyDetail

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  
  const isTransparent = hasHero && !scrolled

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}${isTransparent ? ' navbar--transparent' : ''}`}>
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Pérola Real Estate Logo" className="navbar-logo-img" />
          <span>Pérola Real Estate</span>
        </NavLink>

        <ul className={`navbar-links${menuOpen ? ' navbar-links--open' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenu}>{t('nav.home')}</NavLink></li>
          <li><NavLink to="/imoveis" onClick={closeMenu}>{t('nav.properties')}</NavLink></li>
          <li><NavLink to="/sobre" onClick={closeMenu}>{t('nav.about')}</NavLink></li>
          <li><NavLink to="/contacto" onClick={closeMenu}>{t('nav.contact')}</NavLink></li>
          <li className="admin-mobile-wrapper">
            <AdminControls />
          </li>
        </ul>

        <div 
          className={`language-toggle ${lang === 'EN' ? 'is-en' : 'is-pt'}`}
          onClick={toggleLanguage}
        >
          <div className="toggle-thumb" />
          <span className="lang-pt">PT</span>
          <span className="lang-en">EN</span>
        </div>

        <NavLink to="/contacto" className="navbar-cta" onClick={closeMenu}>
          {t('nav.cta')}
        </NavLink>

        <div className="admin-desktop-wrapper">
          <AdminControls />
        </div>

        <button
          className={`navbar-hamburger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && <div className="navbar-overlay" onClick={closeMenu} />}
    </nav>
  )
}
