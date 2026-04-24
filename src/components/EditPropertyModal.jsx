import React, { useState } from 'react'
import { X, Upload, Plus, Trash2, Loader, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './AddPropertyModal.css'

const emptyForm = {
  title: '',
  price: '',
  location: '',
  type: 'Apartment',
  purpose: 'Venda',
  bedrooms: '',
  bathrooms: '',
  area: '',
  description: '',
  map_embed: '',
}

export default function EditPropertyModal({ property, onClose }) {
  const [form, setForm]         = useState({
    title: property.title || '',
    price: property.price || '',
    location: property.location || '',
    type: property.type || 'Apartment',
    purpose: property.purpose || 'Venda',
    bedrooms: property.beds || '',
    bathrooms: property.baths || '',
    area: property.area || '',
    description: property.description || '',
    map_embed: property.map_embed || '',
  })
  const [images, setImages]     = useState(property.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const handleField = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      const uploaded = []
      for (const file of files) {
        const ext  = file.name.split('.').pop()
        const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(path)
        uploaded.push(publicUrl)
      }
      setImages(prev => [...prev, ...uploaded])
    } catch (err) {
      setError('Erro ao carregar imagens: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.location) {
      setError('Preencha o título, preço e localização.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { error: updateError } = await supabase.from('properties').update({
        title:       form.title,
        price:       form.price,
        location:    form.location,
        type:        form.type,
        purpose:     form.purpose,
        bedrooms:    form.bedrooms || null,
        bathrooms:   form.bathrooms || null,
        area:        form.area || null,
        description: form.description,
        map_embed:   form.map_embed || null,
        images:      images,
      }).eq('id', property.id)
      if (updateError) throw updateError
      setSuccess(true)
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError('Erro ao guardar imóvel: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="add-prop-backdrop" onClick={onClose}>
      <div className="add-prop-modal" onClick={e => e.stopPropagation()}>
        <div className="add-prop-header">
          <h2>Editar Imóvel</h2>
          <button className="add-prop-close" onClick={onClose}><X size={18} /></button>
        </div>

        {success ? (
          <div className="add-prop-success">
            <CheckCircle size={48} />
            <h3>Imóvel actualizado!</h3>
            <p>A página irá actualizar automaticamente.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="add-prop-form">
            {/* Row 1 */}
            <div className="add-prop-row">
              <div className="add-prop-field add-prop-field--wide">
                <label>TÍTULO *</label>
                <input name="title" value={form.title} onChange={handleField} placeholder="Ex: Moradia T4 Sommerschield" required />
              </div>
              <div className="add-prop-field">
                <label>PREÇO *</label>
                <input name="price" value={form.price} onChange={handleField} placeholder="Ex: 25.000.000 MT" required />
              </div>
            </div>

            {/* Row 2 */}
            <div className="add-prop-row">
              <div className="add-prop-field">
                <label>LOCALIZAÇÃO *</label>
                <input name="location" value={form.location} onChange={handleField} placeholder="Ex: Maputo, Sommerschield" required />
              </div>
              <div className="add-prop-field">
                <label>TIPO</label>
                <select name="type" value={form.type} onChange={handleField}>
                  <option value="Apartment">Apartamento</option>
                  <option value="House">Moradia</option>
                  <option value="Villa">Vivenda</option>
                  <option value="Office">Escritório</option>
                  <option value="Land">Terreno</option>
                </select>
              </div>
              <div className="add-prop-field">
                <label>FINALIDADE</label>
                <select name="purpose" value={form.purpose} onChange={handleField}>
                  <option value="Venda">Venda</option>
                  <option value="Arrendamento">Arrendamento</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="add-prop-row">
              <div className="add-prop-field">
                <label>QUARTOS</label>
                <input name="bedrooms" value={form.bedrooms} onChange={handleField} placeholder="Ex: 3" type="number" min="0" />
              </div>
              <div className="add-prop-field">
                <label>CASAS DE BANHO</label>
                <input name="bathrooms" value={form.bathrooms} onChange={handleField} placeholder="Ex: 2" type="number" min="0" />
              </div>
              <div className="add-prop-field">
                <label>ÁREA (m²)</label>
                <input name="area" value={form.area} onChange={handleField} placeholder="Ex: 250" type="number" min="0" />
              </div>
            </div>

            {/* Description */}
            <div className="add-prop-field">
              <label>DESCRIÇÃO</label>
              <textarea name="description" value={form.description} onChange={handleField} placeholder="Descreva o imóvel..." rows={3} />
            </div>

            {/* Map */}
            <div className="add-prop-field">
              <label>LINK DO MAPA (Google Maps embed URL)</label>
              <input name="map_embed" value={form.map_embed} onChange={handleField} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>

            {/* Image Upload */}
            <div className="add-prop-field">
              <label>FOTOGRAFIAS</label>
              <label className="add-prop-upload-btn">
                {uploading
                  ? <><Loader size={16} className="spin" /> A carregar...</>
                  : <><Upload size={16} /> Seleccionar Fotos</>
                }
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:'none'}} />
              </label>
              {images.length > 0 && (
                <div className="add-prop-img-grid">
                  {images.map((url, i) => (
                    <div key={i} className="add-prop-img-thumb">
                      <img src={url} alt={`foto ${i+1}`} />
                      <button type="button" onClick={() => removeImage(i)} className="add-prop-img-remove">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="add-prop-error">{error}</p>}

            <div className="add-prop-actions">
              <button type="button" className="add-prop-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="add-prop-submit" disabled={saving || uploading}>
                {saving
                  ? <><Loader size={16} className="spin" /> A guardar...</>
                  : <><Plus size={16} /> Guardar Alterações</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
