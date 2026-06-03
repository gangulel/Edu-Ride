import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n, { loadSavedLanguage, saveLanguage, LANGUAGES } from '../src/services/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [languageLoading, setLanguageLoading] = useState(true);

  useEffect(() => {
    loadSavedLanguage().then(() => {
      setLanguage(i18n.language || 'en');
      setLanguageLoading(false);
    });
  }, []);

  const changeLanguage = async (langCode) => {
    await saveLanguage(langCode);
    setLanguage(langCode);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languageLoading, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
