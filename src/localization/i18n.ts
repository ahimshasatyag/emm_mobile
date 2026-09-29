import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './translations/en.json';
import id from './translations/id.json';

// Definisikan semua terjemahan
const resources = {
  en: { translation: en },
  id: { translation: id },
};

// Ambil bahasa bawaan perangkat menggunakan getLocales()
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
// Kita dukung 'id' (Indonesia) dan 'en' (Inggris), default ke 'en'
const defaultLanguage = deviceLanguage === 'id' ? 'id' : 'en';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: defaultLanguage, // bahasa bawaan perangkat
    fallbackLng: 'en',    // bahasa fallback jika key tidak ditemukan
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
