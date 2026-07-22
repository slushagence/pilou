import { useTranslation } from 'react-i18next'

// Petit sélecteur FR/EN, à placer en haut des pages joueur.
// `sombre` adapte la couleur au fond (pages sur fond-rouge vs fond-papier).
export default function SelecteurLangue({ sombre = false }) {
  const { i18n } = useTranslation()

  const styleActif = sombre
    ? 'bg-pilou-creme text-pilou-rouge'
    : 'bg-pilou-rouge text-pilou-creme'
  const styleInactif = sombre
    ? 'text-pilou-creme/70 hover:text-pilou-creme'
    : 'text-pilou-encre/60 hover:text-pilou-encre'

  return (
    <div className="mb-6 flex justify-center gap-2 text-sm font-bold uppercase tracking-wide">
      <button type="button" onClick={() => i18n.changeLanguage('fr')}
        className={`rounded px-4 py-2 transition ${i18n.language === 'fr' ? styleActif : styleInactif}`}>
        FR
      </button>
      <button type="button" onClick={() => i18n.changeLanguage('en')}
        className={`rounded px-4 py-2 transition ${i18n.language === 'en' ? styleActif : styleInactif}`}>
        EN
      </button>
    </div>
  )
}
