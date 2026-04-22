import React, { useState } from 'react'
import { X, LogIn, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './AdminLoginModal.css'

export default function AdminLoginModal({ onClose }) {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      onClose()
    } catch {
      setError('Credenciais inválidas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="admin-modal-header">
          <div className="admin-modal-logo">
            <img src="/logo.png" alt="Pérola" />
          </div>
          <h2>Área Restrita</h2>
          <p>Acesso exclusivo para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-input-group">
            <label>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          <div className="admin-input-group">
            <label>PALAVRA-PASSE</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading
              ? <><Loader size={16} className="spin" /> A entrar...</>
              : <><LogIn size={16} /> Entrar</>
            }
          </button>
        </form>
      </div>
    </div>
  )
}
