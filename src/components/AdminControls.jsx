import React, { useState, useRef, useEffect } from 'react'
import { UserCircle, LogOut, PlusCircle, Settings, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AdminLoginModal from './AdminLoginModal'
import AddPropertyModal from './AddPropertyModal'
import './AdminControls.css'

export default function AdminControls() {
  const { isAdmin, logout } = useAuth()
  const [showLogin,      setShowLogin]    = useState(false)
  const [showDropdown,   setShowDropdown] = useState(false)
  const [showAddModal,   setShowAddModal] = useState(false)
  const [logoutFeedback, setLogoutFeedback] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
    setLogoutFeedback(true)
    setTimeout(() => setLogoutFeedback(false), 2000)
  }

  if (isAdmin) {
    return (
      <>
        <div className="admin-controls" ref={dropdownRef}>
          <button
            className="admin-btn admin-btn--active"
            onClick={() => setShowDropdown(v => !v)}
            title="Painel de Administração"
          >
            <UserCircle size={22} />
            <span className="admin-badge" />
          </button>

          {showDropdown && (
            <div className="admin-dropdown">
              <div className="admin-dropdown-header">
                <CheckCircle size={14} className="admin-dropdown-check" />
                <span>Admin activo</span>
              </div>
              <button className="admin-dropdown-item" onClick={() => { setShowAddModal(true); setShowDropdown(false) }}>
                <PlusCircle size={16} />
                Adicionar Imóvel
              </button>
              <div className="admin-dropdown-divider" />
              <button className="admin-dropdown-item admin-dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={16} />
                Terminar Sessão
              </button>
            </div>
          )}
        </div>

        {showAddModal && <AddPropertyModal onClose={() => setShowAddModal(false)} />}
        {logoutFeedback && <div className="admin-toast">Sessão terminada com sucesso</div>}
      </>
    )
  }

  return (
    <>
      <button
        className="admin-btn"
        onClick={() => setShowLogin(true)}
        title="Área de Administração"
      >
        <UserCircle size={22} />
      </button>
      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
