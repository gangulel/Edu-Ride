import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../translations/en.json';
import si from '../translations/si.json';
import ta from '../translations/ta.json';

export const LANGUAGE_KEY = '@eduride_language';

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export async function loadSavedLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      await i18n.changeLanguage(saved);
    }
  } catch {
    // keep default 'en'
  }
}

export async function saveLanguage(langCode) {
  await AsyncStorage.setItem(LANGUAGE_KEY, langCode);
  await i18n.changeLanguage(langCode);
}

export default i18n;
