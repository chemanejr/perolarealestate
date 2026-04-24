import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import AdminControls from './AdminControls'
import './Navbar.css'

export default function Navbar() {
  const { lang, t, toggleLanguage } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar navbar--solid">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="navbar-logo-circle">
            <img src="/logo.png" alt="Logo" className="navbar-logo-img" />
          </div>
          <span>Pérola Real Estate</span>
        </NavLink>

        <div className="navbar-right">
          <div className="navbar-lang" onClick={toggleLanguage}>
            <span className={`lang-label ${lang === 'PT' ? 'active' : ''}`}>PT</span>
            <span className="lang-separator">/</span>
            <span className={`lang-label ${lang === 'EN' ? 'active' : ''}`}>EN</span>
          </div>

          <NavLink to="/contacto" className="navbar-cta-simple" onClick={closeMenu}>
            {t('nav.cta')}
          </NavLink>

          <div className="navbar-admin-icon">
            <AdminControls />
          </div>

          <button
            className={`navbar-hamburger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <ul className={`navbar-links${menuOpen ? ' navbar-links--open' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenu}>{t('nav.home')}</NavLink></li>
          <li><NavLink to="/imoveis" onClick={closeMenu}>{t('nav.properties')}</NavLink></li>
          <li><NavLink to="/sobre" onClick={closeMenu}>{t('nav.about')}</NavLink></li>
          <li><NavLink to="/contacto" onClick={closeMenu}>{t('nav.contact')}</NavLink></li>
        </ul>

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
