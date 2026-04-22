import React from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import './Contact.css'

export default function Contact() {
  const { t } = useLanguage()
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
            <form className="contact-form">
              <div className="form-group-row">
                <div className="input-group">
                  <label>{t('contact.form.name')}</label>
                  <input type="text" placeholder={t('contact.form.namePlaceholder')} />
                </div>
                <div className="input-group">
                  <label>{t('contact.form.company')}</label>
                  <input type="text" placeholder={t('contact.form.companyPlaceholder')} />
                </div>
              </div>

              <div className="form-group-row">
                <div className="input-group">
                  <label>{t('contact.form.phone')}</label>
                  <input type="text" placeholder={t('contact.form.phonePlaceholder')} />
                </div>
                <div className="input-group">
                  <label>{t('contact.form.subject')}</label>
                  <select>
                    <option>{t('contact.form.subjects.0')}</option>
                    <option>{t('contact.form.subjects.1')}</option>
                    <option>{t('contact.form.subjects.2')}</option>
                    <option>{t('contact.form.subjects.3')}</option>
                  </select>
                </div>
              </div>

              <div className="input-group full-width">
                <label>{t('contact.form.message')}</label>
                <textarea placeholder={t('contact.form.messagePlaceholder')} rows="6"></textarea>
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
                <p>{t('contact.info.week')}</p>
                <p>{t('contact.info.sat')}</p>
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
  )
}
