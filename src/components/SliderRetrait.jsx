import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'

/*
 * Slider "à glisser" par le barman quand il remet le lot.
 * Implémenté en pointer/touch events (fiable sur iOS/Android,
 * contrairement à un input range invisible).
 * Glissé au bout → RPC marquer_retire → écran "lot remis".
 */
export default function SliderRetrait({ codeRetrait, onRetire }) {
  const { t } = useTranslation()
  const [valeur, setValeur] = useState(0)
  const [etat, setEtat] = useState('repos') // repos | envoi | erreur
  const piste = useRef(null)
  const glisse = useRef(false)
  const enCours = useRef(false)

  function positionDepuisEvenement(e) {
    const rect = piste.current.getBoundingClientRect()
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left
    return Math.min(100, Math.max(0, (x / rect.width) * 100))
  }

  function debut(e) {
    if (etat === 'envoi') return
    glisse.current = true
    setValeur(positionDepuisEvenement(e))
  }

  function bouge(e) {
    if (!glisse.current || etat === 'envoi') return
    setValeur(positionDepuisEvenement(e))
  }

  async function fin() {
    if (!glisse.current) return
    glisse.current = false
    if (valeur >= 92) {
      if (enCours.current) return
      enCours.current = true
      setEtat('envoi')
      setValeur(100)
      const { data, error } = await supabase.rpc('marquer_retire', {
        p_code_retrait: codeRetrait,
      })
      if (error || !data?.ok) {
        setEtat('erreur')
        setValeur(0)
        enCours.current = false
      } else {
        onRetire?.()
      }
    } else {
      setValeur(0)
    }
  }

  return (
    <div className="mt-6 w-full">
      <p className="text-xs opacity-80 mb-2 text-center">
        {t('resultat.slider_legende')}
      </p>
      <div
        ref={piste}
        onMouseDown={debut}
        onMouseMove={bouge}
        onMouseUp={fin}
        onMouseLeave={fin}
        onTouchStart={debut}
        onTouchMove={bouge}
        onTouchEnd={fin}
        className="relative h-14 w-full select-none overflow-hidden rounded-full bg-pilou-or
                   border-2 border-pilou-creme cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        {/* Progression */}
        <div
          className="absolute inset-y-0 left-0 bg-pilou-creme/40"
          style={{ width: `${valeur}%` }}
        />
        {/* Texte */}
        <span className="absolute inset-0 flex items-center justify-center titre text-sm font-bold
                         tracking-wide uppercase pointer-events-none text-pilou-rouge pl-10">
          {etat === 'envoi' ? t('resultat.slider_envoi') : etat === 'erreur' ? t('resultat.slider_erreur') : t('resultat.slider_repos')}
        </span>
        {/* Poignée */}
        <div
          className="absolute top-1 bottom-1 flex w-12 items-center justify-center rounded-full
                     bg-pilou-rouge text-xl shadow-lg pointer-events-none"
          style={{ left: `calc(${valeur / 100} * (100% - 52px) + 2px)` }}
        >
          🍺
        </div>
      </div>
    </div>
  )
}
