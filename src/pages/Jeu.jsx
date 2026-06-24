import { useState } from 'react'
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'
import PiecePilou from '../components/PiecePilou'
import stade from '../assets/pilou/pilou-stade.png'
import logoBDC from '../assets/pilou/logo-bdc_blanc.png'

export default function Jeu() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [enRotation, setEnRotation] = useState(false)
  const [faceFinale, setFaceFinale] = useState(null)
  const [erreur, setErreur] = useState(null)

  if (!state?.lieu || !state?.joueur) return <Navigate to="/jouer" replace />
  const { lieu, joueur } = state

  async function tournerLaPiece() {
    if (enRotation || faceFinale) return
    setErreur(null)
    setEnRotation(true)

    const debut = Date.now()
    const { data, error } = await supabase.rpc('jouer', {
      p_lieu_id: lieu.id,
      p_prenom: joueur.prenom,
      p_nom: joueur.nom,
      p_email: joueur.email,
      p_telephone: joueur.telephone || null,
      p_newsletter_brasserie: joueur.newsletterBrasserie ?? false,
      p_newsletter_etablissement: joueur.newsletterEtablissement ?? false,
      p_consentement_promo: joueur.consentementPromo ?? false,
    })

    if (error || !data) {
      setEnRotation(false)
      setErreur("Le jeu n'a pas répondu. Vérifie ta connexion et réessaie.")
      return
    }
    if (!data.ok) {
      setEnRotation(false)
      if (data.erreur === 'deja_joue_aujourdhui') {
        setErreur('Tu as déjà joué aujourd\u2019hui ! Reviens tenter ta chance demain.')
      } else if (data.erreur === 'etablissement_inconnu') {
        setErreur('Ce lieu ne participe plus au jeu.')
      } else {
        setErreur('Le formulaire semble incomplet. Reviens en arrière et vérifie tes infos.')
      }
      return
    }

    const resteRotation = Math.max(0, 2600 - (Date.now() - debut))
    setTimeout(() => {
      setEnRotation(false)
      setFaceFinale(data.resultat)
      setTimeout(() => {
        navigate('/resultat', { state: { reponse: data, lieu } })
      }, 1100)
    }, resteRotation)
  }

  return (
    <main className="fond-rouge min-h-screen px-6 py-10 text-pilou-creme">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <LogoPilou variante="blanc" hauteur={56} />

        <h1 className="titre mt-6 text-4xl font-bold">À toi de jouer !</h1>
        <p className="titre mt-1 text-lg text-pilou-or">Tente ta chance</p>
        <p className="mt-2 text-sm opacity-80">{lieu.nom} — {lieu.ville}</p>

        <div className={`my-8 ${faceFinale ? 'piece-atterrissage' : ''}`}>
          <PiecePilou face={faceFinale ?? 'piece'} enRotation={enRotation} />
        </div>

        <button
          type="button"
          onClick={tournerLaPiece}
          disabled={enRotation || !!faceFinale}
          className="titre w-full rounded bg-pilou-creme py-4 text-xl font-bold text-pilou-rouge
                     shadow-lg transition hover:bg-white disabled:cursor-wait disabled:opacity-70
                     focus:outline-2 focus:outline-offset-2 focus:outline-pilou-creme"
        >
          {faceFinale ? '...' : enRotation ? 'La pièce tourne...' : 'Faire tourner la pièce'}
        </button>

        {erreur && (
          <p className="mt-4 rounded bg-pilou-rouge-fonce px-4 py-3 text-sm">{erreur}</p>
        )}

        <Link to="/lots" state={{ lieu }} className="mt-6 text-sm underline opacity-80 hover:opacity-100">
          Voir les lots disponibles
        </Link>

        <img src={stade} alt="" draggable="false"
          className="mt-8 w-full opacity-95 mix-blend-multiply" />

        <img src={logoBDC} alt="Brasserie du Comté"
          className="mt-6 w-20 object-contain opacity-80"
          draggable="false" />

        <a href="https://www.lapilou.fr" target="_blank" rel="noopener noreferrer"
          className="mt-4 text-base font-bold text-pilou-creme uppercase underline hover:opacity-80">
          🍺 <i>Qu'es la Pilou ?</i> 🍺<br/>VISITEZ NOTRE SITE POUR EN SAVOIR PLUS !
        </a>
      </div>
    </main>
  )
}
