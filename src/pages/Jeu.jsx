import { useState } from 'react'
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import PiecePilou from '../components/PiecePilou'

export default function Jeu() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [enRotation, setEnRotation] = useState(false)
  const [erreur, setErreur] = useState(null)

  // Arrivée directe sur /jeu sans passer par le formulaire → retour au début
  if (!state?.restaurant || !state?.joueur) return <Navigate to="/jouer" replace />
  const { restaurant, joueur } = state

  async function tournerLaPiece() {
    if (enRotation) return
    setErreur(null)
    setEnRotation(true)

    // Le serveur décide du résultat ; la pièce ne fait que le mettre en scène.
    const debut = Date.now()
    const { data, error } = await supabase.rpc('jouer', {
      p_restaurant_id: restaurant.id,
      p_prenom: joueur.prenom,
      p_nom: joueur.nom,
      p_email: joueur.email,
      p_telephone: joueur.telephone || null,
      p_newsletter_brasserie: joueur.newsletterBrasserie ?? false,
      p_newsletter_etablissement: joueur.newsletterEtablissement ?? false,
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
        setErreur("Cet établissement ne participe plus au jeu.")
      } else {
        setErreur('Le formulaire semble incomplet. Reviens en arrière et vérifie tes infos.')
      }
      return
    }

    // On laisse la pièce finir son tour (2,6s) avant de révéler le résultat
    const dureeRestante = Math.max(0, 2600 - (Date.now() - debut))
    setTimeout(() => {
      navigate('/resultat', { state: { reponse: data, restaurant } })
    }, dureeRestante)
  }

  return (
    <main className="fond-rouge min-h-screen px-6 py-10 text-pilou-creme">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <p className="titre text-2xl font-bold">
          Pilou <span className="text-sm align-top text-pilou-or">Nissa</span>
        </p>

        <h1 className="titre mt-8 text-4xl font-bold">À toi de jouer !</h1>
        <p className="titre mt-1 text-lg text-pilou-or">Tente ta chance</p>
        <p className="mt-2 text-sm opacity-80">{restaurant.nom} — {restaurant.ville}</p>

        <div className="my-10">
          <PiecePilou enRotation={enRotation} />
        </div>

        <button
          type="button"
          onClick={tournerLaPiece}
          disabled={enRotation}
          className="titre w-full rounded bg-pilou-creme py-4 text-xl font-bold text-pilou-rouge
                     shadow-lg transition hover:bg-white disabled:cursor-wait disabled:opacity-70
                     focus:outline-2 focus:outline-offset-2 focus:outline-pilou-creme"
        >
          {enRotation ? 'La pièce tourne...' : 'Faire tourner la pièce'}
        </button>

        {erreur && (
          <p className="mt-4 rounded bg-pilou-rouge-fonce px-4 py-3 text-sm">{erreur}</p>
        )}

        <Link to="/lots" state={{ restaurant }} className="mt-6 text-sm underline opacity-80 hover:opacity-100">
          Voir la liste des lots
        </Link>
      </div>
    </main>
  )
}
