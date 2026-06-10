import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Formulaire() {
  const navigate = useNavigate()

  // Liste des établissements (chargée une fois depuis la vue publique)
  const [restaurants, setRestaurants] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreurChargement, setErreurChargement] = useState(false)

  // Saisie
  const [recherche, setRecherche] = useState('')
  const [restaurant, setRestaurant] = useState(null) // l'établissement choisi
  const [listeOuverte, setListeOuverte] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [majeurEtReglement, setMajeurEtReglement] = useState(false)
  const [erreurs, setErreurs] = useState({})
  const zoneAutocomplete = useRef(null)

  useEffect(() => {
    supabase
      .from('v_restaurants')
      .select('id, nom, ville')
      .order('nom')
      .then(({ data, error }) => {
        if (error) setErreurChargement(true)
        else setRestaurants(data ?? [])
        setChargement(false)
      })
  }, [])

  // Ferme la liste si on clique ailleurs
  useEffect(() => {
    const fermer = (e) => {
      if (zoneAutocomplete.current && !zoneAutocomplete.current.contains(e.target)) {
        setListeOuverte(false)
      }
    }
    document.addEventListener('mousedown', fermer)
    return () => document.removeEventListener('mousedown', fermer)
  }, [])

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    if (!q) return restaurants.slice(0, 6)
    return restaurants
      .filter((r) => `${r.nom} ${r.ville}`.toLowerCase().includes(q))
      .slice(0, 6)
  }, [recherche, restaurants])

  function choisirRestaurant(r) {
    setRestaurant(r)
    setRecherche(`${r.nom} — ${r.ville}`)
    setListeOuverte(false)
  }

  function valider() {
    const e = {}
    if (!restaurant) e.restaurant = 'Choisis ton établissement dans la liste.'
    if (!prenom.trim()) e.prenom = 'Ton prénom est requis.'
    if (!nom.trim()) e.nom = 'Ton nom est requis.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) e.email = 'Email invalide.'
    if (!majeurEtReglement) e.majeur = 'Tu dois être majeur et accepter le règlement.'
    setErreurs(e)
    return Object.keys(e).length === 0
  }

  function lancerLeJeu() {
    if (!valider()) return
    navigate('/jeu', {
      state: {
        restaurant,
        joueur: {
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
        },
      },
    })
  }

  const styleChamp =
    'w-full rounded border border-pilou-creme-fonce bg-white/80 px-3 py-2.5 ' +
    'text-pilou-encre placeholder:text-pilou-encre/40 ' +
    'focus:outline-2 focus:outline-pilou-rouge'

  return (
    <main className="fond-papier min-h-screen px-6 py-10 text-pilou-encre">
      <div className="mx-auto max-w-md">
        <p className="titre text-center text-2xl font-bold text-pilou-rouge">
          Pilou <span className="text-sm align-top text-pilou-or">Nissa</span>
        </p>

        <h1 className="titre mt-8 text-center text-3xl font-bold leading-tight">
          Avant de jouer,
          <span className="block text-pilou-or">quelques infos</span>
        </h1>
        <p className="mt-3 text-center text-sm opacity-75">
          Remplis ce formulaire pour tenter ta chance et découvrir ton gain !
        </p>

        {/* ── Choix de l'établissement ── */}
        <div className="relative mt-8" ref={zoneAutocomplete}>
          <label htmlFor="etablissement" className="titre text-sm font-bold">
            Choisis ton établissement <span className="text-pilou-rouge">*</span>
          </label>
          <input
            id="etablissement"
            type="text"
            className={`${styleChamp} mt-1`}
            placeholder="Commence à taper le nom..."
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value)
              setRestaurant(null)
              setListeOuverte(true)
            }}
            onFocus={() => setListeOuverte(true)}
            autoComplete="off"
          />
          {listeOuverte && !chargement && (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded border border-pilou-creme-fonce bg-white shadow-lg">
              {resultats.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => choisirRestaurant(r)}
                    className="block w-full px-3 py-2.5 text-left text-sm hover:bg-pilou-creme"
                  >
                    {r.nom} — {r.ville}
                  </button>
                </li>
              ))}
              {resultats.length === 0 && (
                <li className="px-3 py-2.5 text-sm opacity-60">Aucun établissement trouvé.</li>
              )}
            </ul>
          )}
          {chargement && <p className="mt-1 text-xs opacity-60">Chargement des établissements...</p>}
          {erreurChargement && (
            <p className="mt-1 text-xs text-pilou-rouge">
              Impossible de charger la liste. Vérifie ta connexion et recharge la page.
            </p>
          )}
          {erreurs.restaurant && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.restaurant}</p>}
        </div>

        {/* ── Identité ── */}
        <div className="mt-5">
          <label htmlFor="prenom" className="titre text-sm font-bold">
            Prénom <span className="text-pilou-rouge">*</span>
          </label>
          <input id="prenom" type="text" className={`${styleChamp} mt-1`} placeholder="Prénom"
            value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" />
          {erreurs.prenom && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.prenom}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="nom" className="titre text-sm font-bold">
            Nom <span className="text-pilou-rouge">*</span>
          </label>
          <input id="nom" type="text" className={`${styleChamp} mt-1`} placeholder="Nom"
            value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="family-name" />
          {erreurs.nom && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.nom}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="email" className="titre text-sm font-bold">
            Email <span className="text-pilou-rouge">*</span>
          </label>
          <input id="email" type="email" className={`${styleChamp} mt-1`} placeholder="email@exemple.com"
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          {erreurs.email && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.email}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="telephone" className="titre text-sm font-bold">Téléphone</label>
          <input id="telephone" type="tel" className={`${styleChamp} mt-1`} placeholder="06 12 34 56 78"
            value={telephone} onChange={(e) => setTelephone(e.target.value)} autoComplete="tel" />
        </div>

        {/* ── Majorité + règlement ── */}
        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={majeurEtReglement}
            onChange={(e) => setMajeurEtReglement(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-pilou-rouge"
          />
          <span>
            J'ai plus de 18 ans et j'accepte le{' '}
            <span className="font-semibold underline">règlement du jeu</span>
            <span className="text-pilou-rouge"> *</span>
          </span>
        </label>
        {erreurs.majeur && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.majeur}</p>}

        <button
          type="button"
          onClick={lancerLeJeu}
          className="titre mt-8 w-full rounded bg-pilou-rouge py-4 text-xl font-bold text-pilou-creme
                     shadow-lg transition hover:bg-pilou-rouge-fonce
                     focus:outline-2 focus:outline-offset-2 focus:outline-pilou-rouge"
        >
          C'est parti !
        </button>
      </div>
    </main>
  )
}
