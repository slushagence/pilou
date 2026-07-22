import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'
import PiecePilou from '../components/PiecePilou'
import SelecteurLangue from '../components/SelecteurLangue'
import stade from '../assets/pilou/pilou-stade.png'
import logoBDC from '../assets/pilou/logo-bdc_blanc.png'

export default function Jeu() {
  const { t, i18n } = useTranslation()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [enRotation, setEnRotation] = useState(false)
  const [faceFinale, setFaceFinale] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [lotsDispo, setLotsDispo] = useState(null) // null = chargement, sinon nombre

  const lieuId = state?.lieu?.id

  // Vérifie qu'il reste des lots à gagner dans cet établissement
  useEffect(() => {
    if (!lieuId) return
    supabase
      .from('v_lots')
      .select('id', { count: 'exact', head: true })
      .eq('lieu_id', lieuId)
      .then(({ count }) => setLotsDispo(count ?? 0))
  }, [lieuId])

  if (!state?.lieu || !state?.joueur) return <Navigate to="/jouer" replace />
  const { lieu, joueur } = state

  // ── Plus aucun lot disponible : message d'excuse ──
  if (lotsDispo === 0) {
    return (
      <main className="fond-rouge min-h-screen px-6 py-10 text-pilou-creme">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <SelecteurLangue sombre />
          <LogoPilou variante="blanc" hauteur={56} />

          <p className="mt-10 text-5xl">😅</p>
          <h1 className="titre mt-4 text-3xl font-bold">
            {t('jeu.epuise_titre')}
          </h1>
          <p className="mt-4 text-sm opacity-90 leading-relaxed">
            {t('jeu.epuise_texte')}<br />
            {t('jeu.epuise_texte2')}
          </p>

          <p className="mt-6 text-sm opacity-80">{lieu.nom} — {lieu.ville}</p>

          <Link to="/" className="titre mt-8 block w-full rounded bg-pilou-creme py-4 text-xl
                     font-bold text-pilou-rouge shadow-lg transition hover:bg-white">
            {t('jeu.retour_accueil')}
          </Link>

          <img src={logoBDC} alt="Brasserie du Comté"
            className="mt-10 w-20 object-contain opacity-80"
            draggable="false" />

          <a href="https://www.lapilou.fr" target="_blank" rel="noopener noreferrer"
            className="mt-4 text-base font-bold text-pilou-creme uppercase underline hover:opacity-80 text-center block">
            🍺 <i>{t('commun.lien_site_titre')}</i> 🍺<br/>{t('commun.lien_site_cta')}
          </a>
        </div>
      </main>
    )
  }

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
      p_code_postal: joueur.codePostal || null,
      p_newsletter_brasserie: joueur.newsletterBrasserie ?? false,
      p_newsletter_etablissement: joueur.newsletterEtablissement ?? false,
      p_consentement_promo: joueur.consentementPromo ?? false,
    })

    if (error || !data) {
      setEnRotation(false)
      setErreur(t('jeu.erreurs.reseau'))
      return
    }
    if (!data.ok) {
      setEnRotation(false)
      if (data.erreur === 'deja_joue_aujourdhui') {
        setErreur(t('jeu.erreurs.deja_joue'))
      } else if (data.erreur === 'trop_de_tentatives') {
        setErreur(t('jeu.erreurs.trop_de_tentatives'))
      } else if (data.erreur === 'etablissement_inconnu') {
        setErreur(t('jeu.erreurs.etablissement_inconnu'))
      } else {
        setErreur(t('jeu.erreurs.generique'))
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
        <SelecteurLangue sombre />
        <LogoPilou variante="blanc" hauteur={56} />

        <h1 className="titre mt-6 text-4xl font-bold">{t('jeu.titre')}</h1>
        <p className="titre mt-1 text-lg text-pilou-or">{t('jeu.sous_titre')}</p>
        <p className="mt-2 text-sm opacity-80">{lieu.nom} — {lieu.ville}</p>
        {lieu.taux_de_gain && (
          <p className="mt-1 text-xs opacity-60">
            {t('jeu.chance', {
              n: Math.round(1 / lieu.taux_de_gain).toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR'),
            })}
          </p>
        )}

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
          {faceFinale ? '...' : enRotation ? t('jeu.bouton_en_cours') : t('jeu.bouton_tourner')}
        </button>

        {erreur && (
          <p className="mt-4 rounded bg-pilou-rouge-fonce px-4 py-3 text-sm">{erreur}</p>
        )}

        <Link to="/lots" state={{ lieu }} className="mt-6 text-sm underline opacity-80 hover:opacity-100">
          {t('jeu.voir_lots')}
        </Link>

        <img src={stade} alt="" draggable="false"
          className="mt-8 w-full opacity-95 mix-blend-multiply" />

        <img src={logoBDC} alt="Brasserie du Comté"
          className="mt-6 w-20 object-contain opacity-80"
          draggable="false" />

        <a href="https://www.lapilou.fr" target="_blank" rel="noopener noreferrer"
          className="mt-4 text-base font-bold text-pilou-creme uppercase underline hover:opacity-80 text-center block">
          🍺 <i>{t('commun.lien_site_titre')}</i> 🍺<br/>{t('commun.lien_site_cta')}
        </a>
      </div>
    </main>
  )
}
