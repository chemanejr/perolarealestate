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
          <img src="/logo.png" alt="Logo" className="navbar-logo-img" />
          <span>Pérola Real Estate</span>
        </NavLink>

        {/* Desktop Links - Hidden on Mobile via CSS */}
        <ul className="navbar-desktop-links">
          <li><NavLink to="/" end>{t('nav.home')}</NavLink></li>
          <li><NavLink to="/imoveis">{t('nav.properties')}</NavLink></li>
          <li><NavLink to="/sobre">{t('nav.about')}</NavLink></li>
          <li><NavLink to="/contacto">{t('nav.contact')}</NavLink></li>
        </ul>

        <div className="navbar-right">
          <div 
            className={`language-toggle ${lang === 'EN' ? 'is-en' : 'is-pt'}`}
            onClick={toggleLanguage}
          >
            <div className="toggle-thumb" />
            <span className="lang-pt">PT</span>
            <span className="lang-en">EN</span>
          </div>

          <div className="navbar-desktop-admin">
            <AdminControls />
          </div>

          <button
            className={`navbar-hamburger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu Content */}
        <ul className={`navbar-mobile-links${menuOpen ? ' navbar-links--open' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenu}>{t('nav.home')}</NavLink></li>
          <li><NavLink to="/imoveis" onClick={closeMenu}>{t('nav.properties')}</NavLink></li>
          <li><NavLink to="/sobre" onClick={closeMenu}>{t('nav.about')}</NavLink></li>
          <li><NavLink to="/contacto" onClick={closeMenu}>{t('nav.contact')}</NavLink></li>
          <li className="admin-menu-item">
            <AdminControls />
          </li>
        </ul>
      </div>

      {menuOpen && <div className="navbar-overlay" onClick={closeMenu} />}
    </nav>
  )
}
