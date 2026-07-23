import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'
import SelecteurLangue from '../components/SelecteurLangue'
import logoBDC from '../assets/pilou/logo-bdc.png'

export default function Formulaire() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [lieux, setLieux] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreurChargement, setErreurChargement] = useState(false)

  const [recherche, setRecherche] = useState('')
  const [lieu, setLieu] = useState(null)
  const [listeOuverte, setListeOuverte] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [majeurEtReglement, setMajeurEtReglement] = useState(false)
  const [consentementPromo, setConsentementPromo] = useState(false)
  const [newsletterBrasserie, setNewsletterBrasserie] = useState(false)
  const [newsletterEtablissement, setNewsletterEtablissement] = useState(false)
  const [erreurs, setErreurs] = useState({})
  const [siteWeb, setSiteWeb] = useState('') // honeypot — champ piège pour les bots, doit rester vide
  const zoneAutocomplete = useRef(null)

  useEffect(() => {
    supabase
      .from('v_lieux')
      .select('id, nom, ville, taux_de_gain, message_retrait, message_retrait_en')
      .order('nom')
      .then(({ data, error }) => {
        if (error) setErreurChargement(true)
        else setLieux(data ?? [])
        setChargement(false)
      })
  }, [])

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
    if (!q) return lieux.slice(0, 6)
    return lieux
      .filter((l) => `${l.nom} ${l.ville}`.toLowerCase().includes(q))
      .slice(0, 6)
  }, [recherche, lieux])

  function choisirLieu(l) {
    setLieu(l)
    setRecherche(`${l.nom} — ${l.ville}`)
    setListeOuverte(false)
  }

  function valider() {
    const e = {}
    if (!lieu) e.lieu = t('formulaire.erreurs.lieu')
    if (!prenom.trim()) e.prenom = t('formulaire.erreurs.prenom')
    if (!nom.trim()) e.nom = t('formulaire.erreurs.nom')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) e.email = t('formulaire.erreurs.email')
    if (!/^[0-9+\s.-]{6,}$/.test(telephone.trim())) e.telephone = t('formulaire.erreurs.telephone')
    if (!/^[0-9]{5}$/.test(codePostal.trim())) e.codePostal = t('formulaire.erreurs.code_postal')
    if (!majeurEtReglement) e.majeur = t('formulaire.erreurs.majeur')
    setErreurs(e)
    return Object.keys(e).length === 0
  }

  // Vérifie que le domaine de l'email existe vraiment (enregistrement MX)
  // via DNS-over-HTTPS Google. En cas de doute (réseau, timeout), on laisse passer.
  async function domaineEmailValide(adresse) {
    try {
      const domaine = adresse.split('@')[1]
      const controleur = new AbortController()
      const timer = setTimeout(() => controleur.abort(), 3000)
      const reponse = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domaine)}&type=MX`,
        { signal: controleur.signal }
      )
      clearTimeout(timer)
      const data = await reponse.json()
      // Status 0 = NOERROR ; Answer présent = le domaine reçoit des emails
      return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0
    } catch {
      return true // en cas d'échec technique, on ne bloque pas le joueur
    }
  }

  async function lancerLeJeu() {
    // Honeypot : si ce champ caché est rempli, c'est un bot — on bloque silencieusement
    if (siteWeb.trim() !== '') return
    if (!valider()) return

    // Anti-triche : le domaine de l'email doit exister
    if (!(await domaineEmailValide(email.trim()))) {
      setErreurs({ email: t('formulaire.erreurs.email_domaine') })
      return
    }

    navigate('/jeu', {
      state: {
        lieu,
        joueur: {
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
          codePostal: codePostal.trim(),
          newsletterBrasserie,
          newsletterEtablissement,
          consentementPromo,
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
        <SelecteurLangue />
        <LogoPilou variante="couleur" hauteur={112} />

        <h1 className="titre mt-8 text-center text-3xl font-bold leading-tight">
          {t('formulaire.titre_ligne1')}
          <span className="block text-pilou-or">{t('formulaire.titre_ligne2')}</span>
        </h1>
        <p className="mt-3 text-center text-sm opacity-75">
          {t('formulaire.sous_titre')}
        </p>

        {/* ── Choix du lieu ── */}
        <div className="relative mt-8" ref={zoneAutocomplete}>
          <label htmlFor="lieu" className="titre text-sm font-bold">
            {t('formulaire.label_lieu')} <span className="text-pilou-rouge">*</span>
          </label>
          <input
            id="lieu"
            type="text"
            className={`${styleChamp} mt-1`}
            placeholder={t('formulaire.placeholder_lieu')}
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value)
              setLieu(null)
              setListeOuverte(true)
            }}
            onFocus={() => setListeOuverte(true)}
            autoComplete="off"
          />
          {listeOuverte && !chargement && (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded border border-pilou-creme-fonce bg-white shadow-lg">
              {resultats.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => choisirLieu(l)}
                    className="block w-full px-3 py-2.5 text-left text-sm hover:bg-pilou-creme"
                  >
                    {l.nom} — {l.ville}
                  </button>
                </li>
              ))}
              {resultats.length === 0 && (
                <li className="px-3 py-2.5 text-sm opacity-60">{t('formulaire.aucun_lieu')}</li>
              )}
            </ul>
          )}
          {chargement && <p className="mt-1 text-xs opacity-60">{t('formulaire.chargement_lieux')}</p>}
          {erreurChargement && (
            <p className="mt-1 text-xs text-pilou-rouge">
              {t('formulaire.erreur_chargement_lieux')}
            </p>
          )}
          {erreurs.lieu && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.lieu}</p>}
        </div>

        {/* ── Identité ── */}
        <div className="mt-5">
          <label htmlFor="prenom" className="titre text-sm font-bold">
            {t('formulaire.label_prenom')} <span className="text-pilou-rouge">*</span>
          </label>
          <input id="prenom" type="text" className={`${styleChamp} mt-1`} placeholder={t('formulaire.label_prenom')}
            value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" />
          {erreurs.prenom && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.prenom}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="nom" className="titre text-sm font-bold">
            {t('formulaire.label_nom')} <span className="text-pilou-rouge">*</span>
          </label>
          <input id="nom" type="text" className={`${styleChamp} mt-1`} placeholder={t('formulaire.label_nom')}
            value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="family-name" />
          {erreurs.nom && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.nom}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="email" className="titre text-sm font-bold">
            {t('formulaire.label_email')} <span className="text-pilou-rouge">*</span>
          </label>
          <input id="email" type="email" className={`${styleChamp} mt-1`} placeholder="email@exemple.com"
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          {erreurs.email && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.email}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="telephone" className="titre text-sm font-bold">
            {t('formulaire.label_telephone')} <span className="text-pilou-rouge">*</span>
          </label>
          <input id="telephone" type="tel" className={`${styleChamp} mt-1`} placeholder="06 12 34 56 78"
            value={telephone} onChange={(e) => setTelephone(e.target.value)} autoComplete="tel" />
          {erreurs.telephone && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.telephone}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="codePostal" className="titre text-sm font-bold">
            {t('formulaire.label_code_postal')} <span className="text-pilou-rouge">*</span>
          </label>
          <input id="codePostal" type="text" inputMode="numeric" className={`${styleChamp} mt-1`} placeholder="06000"
            value={codePostal} onChange={(e) => setCodePostal(e.target.value)} autoComplete="postal-code" maxLength={5} />
          {erreurs.codePostal && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.codePostal}</p>}
        </div>

        {/* ── Majorité + règlement ── */}
        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={majeurEtReglement}
            onChange={(e) => setMajeurEtReglement(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 accent-pilou-rouge"
          />
          <span>
            {t('formulaire.accepte_reglement_debut')}{' '}
            <a href="/reglement" target="_blank" rel="noopener noreferrer"
               className="font-semibold underline">
              {t('formulaire.lien_reglement')}
            </a>
            <span className="text-pilou-rouge"> *</span>
          </span>
        </label>
        {erreurs.majeur && <p className="mt-1 text-xs text-pilou-rouge">{erreurs.majeur}</p>}

        {/* ── Consentements ── */}
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={newsletterBrasserie}
            onChange={(e) => setNewsletterBrasserie(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 accent-pilou-rouge"
          />
          <span>{t('formulaire.newsletter_brasserie')}</span>
        </label>
        <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={newsletterEtablissement}
            onChange={(e) => setNewsletterEtablissement(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 accent-pilou-rouge"
          />
          <span>
            {t('formulaire.newsletter_etablissement')}
          </span>
        </label>
        <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={consentementPromo}
            onChange={(e) => setConsentementPromo(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 accent-pilou-rouge"
          />
          <span>
            {t('formulaire.consentement_promo')}
          </span>
        </label>

        {/* Honeypot anti-bot — invisible pour les humains, attractif pour les bots */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <label htmlFor="siteWeb">Site web</label>
          <input
            id="siteWeb"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={siteWeb}
            onChange={(e) => setSiteWeb(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={lancerLeJeu}
          className="titre mt-8 w-full rounded bg-pilou-rouge py-4 text-xl font-bold text-pilou-creme
                     shadow-lg transition hover:bg-pilou-rouge-fonce
                     focus:outline-2 focus:outline-offset-2 focus:outline-pilou-rouge"
        >
          {t('formulaire.bouton_valider')}
        </button>

        <img src={logoBDC} alt="Brasserie du Comté"
          className="mt-6 w-20 object-contain mx-auto mix-blend-multiply"
          draggable="false" />

        <a
          href="https://www.lapilou.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-center text-base font-bold text-pilou-rouge uppercase underline hover:opacity-80"
        >
          🍺 <i>{t('commun.lien_site_titre')}</i> 🍺<br/>{t('commun.lien_site_cta')}
        </a>
      </div>
    </main>
  )
}
