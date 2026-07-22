import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr.json'
import en from './locales/en.json'

const langueSauvegardee = localStorage.getItem('pilou_langue')
const langueNavigateur = navigator.language?.startsWith('en') ? 'en' : 'fr'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: langueSauvegardee ?? langueNavigateur,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (langue) => {
  localStorage.setItem('pilou_langue', langue)
})

export default i18n
