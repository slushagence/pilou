import { useRef, useState } from 'react'
import { supabase } from '../supabase'

/*
 * Slider "à glisser" par le barman quand il remet le lot.
 * Une fois glissé au bout : appel RPC marquer_retire(code) → écran "lot remis".
 * Action irréversible côté joueur (le barman garde le contrôle).
 */
export default function SliderRetrait({ codeRetrait, onRetire }) {
  const [valeur, setValeur] = useState(0)
  const [etat, setEtat] = useState('repos') // repos | envoi | fait | erreur
  const enCours = useRef(false)

  async function confirmer() {
    if (enCours.current) return
    enCours.current = true
    setEtat('envoi')
    const { data, error } = await supabase.rpc('marquer_retire', {
      p_code_retrait: codeRetrait,
    })
    if (error || !data?.ok) {
      setEtat('erreur')
      setValeur(0)
      enCours.current = false
    } else {
      setEtat('fait')
      onRetire?.()
    }
  }

  function relacher() {
    if (etat !== 'repos') return
    if (valeur >= 96) confirmer()
    else setValeur(0) // pas au bout → retour au départ
  }

  if (etat === 'fait') return null

  return (
    <div className="mt-6 w-full">
      <p className="text-xs opacity-80 mb-2 text-center">
        ⚠️ Réservé au barman : glisser pour confirmer la remise du lot
      </p>
      <div className="relative h-14 w-full overflow-hidden rounded-full bg-black/30 border border-pilou-creme/40">
        {/* Piste de progression */}
        <div
          className="absolute inset-y-0 left-0 bg-pilou-or/70 transition-none"
          style={{ width: `${valeur}%` }}
        />
        {/* Texte */}
        <span className="absolute inset-0 flex items-center justify-center titre text-sm font-bold tracking-wide uppercase pointer-events-none">
          {etat === 'envoi' ? 'Validation...' : etat === 'erreur' ? 'Erreur, réessaie' : 'Glisser → lot remis 🍺'}
        </span>
        {/* Curseur invisible par-dessus */}
        <input
          type="range"
          min="0"
          max="100"
          value={valeur}
          disabled={etat === 'envoi'}
          onChange={(e) => setValeur(Number(e.target.value))}
          onMouseUp={relacher}
          onTouchEnd={relacher}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}
