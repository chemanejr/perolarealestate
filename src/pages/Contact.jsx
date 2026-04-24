import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import './Contact.css'

export default function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: t('contact.form.subjects.0'),
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Olá, o meu nome é ${formData.name}. Email: ${formData.email}. Telefone: ${formData.phone}. Assunto: ${formData.subject}. Mensagem: ${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=258878469329&text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>{t('contact.title')}</h1>
          <p>
            {t('contact.desc')}
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-section">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group-row">
                <div className="input-group">
                  <label>{t('contact.form.name')}</label>
                  <input 
                    name="name"
                    type="text" 
                    placeholder={t('contact.form.namePlaceholder')} 
                    required 
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>{t('contact.form.company')}</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder={t('contact.form.companyPlaceholder')} 
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="input-group">
                  <label>{t('contact.form.phone')}</label>
                  <input 
                    name="phone"
                    type="text" 
                    placeholder={t('contact.form.phonePlaceholder')} 
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>{t('contact.form.subject')}</label>
                  <select name="subject" onChange={handleChange}>
                    <option>{t('contact.form.subjects.0')}</option>
                    <option>{t('contact.form.subjects.1')}</option>
                    <option>{t('contact.form.subjects.2')}</option>
                    <option>{t('contact.form.subjects.3')}</option>
                  </select>
                </div>
              </div>

              <div className="input-group full-width">
                <label>{t('contact.form.message')}</label>
                <textarea 
                  name="message"
                  placeholder={t('contact.form.messagePlaceholder')} 
                  rows="2" 
                  required
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary">{t('contact.form.submit')}</button>
            </form>
          </div>

          <div className="contact-info-section">
            <div className="info-item">
              <div className="info-icon">
                <Phone size={20} />
              </div>
              <div className="info-text">
                <span className="info-label">{t('contact.info.phone')}</span>
                <p>{t('contact.info.phonePrimary')}</p>
                <p>{t('contact.info.phoneSecondary')}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Mail size={20} />
              </div>
              <div className="info-text">
                <span className="info-label">{t('contact.info.email')}</span>
                <p>{t('contact.info.emailAddress')}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <MapPin size={20} />
              </div>
              <div className="info-text">
                <span className="info-label">{t('contact.info.office')}</span>
                <p className="highlight-text">{t('contact.info.officeDetail')}</p>
                <p className="light-text">{t('contact.info.city')}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Clock size={20} />
              </div>
              <div className="info-text">
                <span className="info-label">{t('contact.info.hours')}</span>
                <p><strong>{t('contact.info.labelWeek')}:</strong> {t('contact.info.week')}</p>
                <p><strong>{t('contact.info.labelSat')}:</strong> {t('contact.info.sat')}</p>
                <div className="hours-note" style={{marginTop: '1rem', padding: '0.8rem', background: 'rgba(90, 132, 54, 0.05)', borderRadius: '8px', borderLeft: '3px solid var(--color-primary)'}}>
                  <p style={{color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.85rem', lineHeight: '1.4'}}>
                    {t('contact.info.note')}
                  </p>
                </div>
              </div>
            </div>

        </div>
      </div>

      <div className="contact-map">
        <iframe 
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.908448992758!2d32.57171800576015!3d-25.969588609935744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee69b313938f08d%3A0x8b06daaf6b234223!2sCosta%20do%20Sol%20Proximo%20a%20Casa%20Jov%20Rua%20do%20Hodpital%20Quarteirao%2018%20Numero%204!5e0!3m2!1spt-PT!2smz!4v1776815376022!5m2!1spt-PT!2smz" 
           width="100%" 
           height="100%" 
           style={{border: 0}} 
           allowFullScreen="" 
           loading="lazy" 
           referrerPolicy="no-referrer-when-downgrade">
        </iframe>
        <div className="map-overlay">
          <span className="overlay-label">{t('contact.map.label')}</span>
          <p>{t('contact.map.text')}</p>
        </div>
        <div className="chat-badge">
          <MessageSquare size={20} color="white" />
        </div>
      </div>
    </div>
  </div>
  )
}
