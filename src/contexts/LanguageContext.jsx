import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'PT');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to the key itself if not found
      }
    }
    return value;
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'PT' ? 'EN' : 'PT';
    setLang(nextLang);
    localStorage.setItem('lang', nextLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
