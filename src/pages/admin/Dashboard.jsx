import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'

// Accueil du back-office : compteurs du jour, liste des établissements
// avec indicateurs, création d'établissement, dernières alertes.

// Génère un slug : "Le Bar des Amis" + "Nice" → "le-bar-des-amis-nice"
function genererSlug(nom, ville) {
  return `${nom} ${ville}`
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([])
  const [lots, setLots] = useState([])
  const [partiesJour, setPartiesJour] = useState([])
  const [alertes, setAlertes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [messageErreur, setMessageErreur] = useState(null)

  // Formulaire de création d'établissement
  const [formOuvert, setFormOuvert] = useState(false)
  const [nvNom, setNvNom] = useState('')
  const [nvVille, setNvVille] = useState('Nice')
  const [nvTaux, setNvTaux] = useState('25')
  const [nvEmail, setNvEmail] = useState('')
  const [erreurForm, setErreurForm] = useState(null)

  const jourParis = useMemo(
    () => new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date()),
    []
  )

  async function chargerTout() {
    setMessageErreur(null)
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('restaurants').select('*').order('nom'),
      supabase.from('lots').select('id, restaurant_id, actif, stock_restant, seuil_alerte'),
      supabase.from('parties').select('restaurant_id, resultat').eq('jour', jourParis),
      supabase.from('alertes_stock').select('*').order('created_at', { ascending: false }).limit(6),
    ])
    if (r1.error) {
      setMessageErreur("Impossible de charger les données. Vérifie l'exposition des tables (Settings → Data API).")
    } else {
      setRestaurants(r1.data ?? [])
      setLots(r2.data ?? [])
      setPartiesJour(r3.data ?? [])
      setAlertes(r4.data ?? [])
    }
    setChargement(false)
  }

  useEffect(() => { chargerTout() }, [])

  async function creerEtablissement() {
    setErreurForm(null)
    const taux = parseFloat(String(nvTaux).replace(',', '.'))
    if (!nvNom.trim() || !nvVille.trim()) { setErreurForm('Nom et ville sont requis.'); return }
    if (Number.isNaN(taux) || taux < 0 || taux > 100) {
      setErreurForm('Le taux de gain doit être entre 0 et 100 %.'); return
    }
    const { error } = await supabase.from('restaurants').insert({
      nom: nvNom.trim(),
      ville: nvVille.trim(),
      slug: genererSlug(nvNom, nvVille),
      taux_de_gain: taux / 100,
      email_contact: nvEmail.trim() || null,
    })
    if (error) {
      setErreurForm(error.code === '23505'
        ? 'Un établissement avec ce nom et cette ville existe déjà.'
        : "La création a échoué. Réessaie.")
      return
    }
    setNvNom(''); setNvEmail(''); setNvTaux('25'); setFormOuvert(false)
    chargerTout()
  }

  async function seDeconnecter() { await supabase.auth.signOut() }

  const dateAlerte = (iso) => new Date(iso).toLocaleString('fr-FR',
    { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })

  const totalParties = partiesJour.length
  const totalGagnants = partiesJour.filter((p) => p.resultat === 'gagne').length

  return (
    <main className="fond-papier min-h-screen px-6 py-8 text-pilou-encre">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="titre text-xl font-bold text-pilou-rouge">
              Pilou <span className="text-xs align-top text-pilou-or">Nissa</span>
            </p>
            <h1 className="titre text-sm font-bold opacity-70">Back-office Brasserie</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="joueurs"
              className="titre rounded bg-pilou-rouge px-3 py-1.5 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
              Joueurs &amp; gagnants
            </Link>
            <button type="button" onClick={seDeconnecter}
              className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1.5 text-sm hover:bg-white">
              Se déconnecter
            </button>
          </div>
        </header>

        {messageErreur && (
          <p className="mt-6 rounded bg-pilou-rouge px-4 py-3 text-sm text-pilou-creme">{messageErreur}</p>
        )}
        {chargement && <p className="mt-6 text-sm opacity-60">Chargement...</p>}

        <section className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded bg-white/70 p-4 text-center shadow-sm">
            <p className="titre text-3xl font-bold text-pilou-rouge">{totalParties}</p>
            <p className="text-sm opacity-70">parties aujourd'hui</p>
          </div>
          <div className="rounded bg-white/70 p-4 text-center shadow-sm">
            <p className="titre text-3xl font-bold text-pilou-or">{totalGagnants}</p>
            <p className="text-sm opacity-70">gagnants aujourd'hui</p>
          </div>
        </section>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="titre text-lg font-bold text-pilou-rouge">Établissements</h2>
          <button type="button" onClick={() => setFormOuvert(!formOuvert)}
            className="titre rounded bg-pilou-rouge px-3 py-1.5 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
            {formOuvert ? 'Annuler' : '+ Ajouter'}
          </button>
        </div>

        {formOuvert && (
          <section className="mt-3 rounded bg-white/70 p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="text" placeholder="Nom de l'établissement *" value={nvNom}
                onChange={(e) => setNvNom(e.target.value)}
                className="rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm" />
              <input type="text" placeholder="Ville *" value={nvVille}
                onChange={(e) => setNvVille(e.target.value)}
                className="rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm" />
              <input type="text" placeholder="Taux de gain en % (ex: 25)" value={nvTaux}
                onChange={(e) => setNvTaux(e.target.value)}
                className="rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm" />
              <input type="email" placeholder="Email d'alerte (facultatif)" value={nvEmail}
                onChange={(e) => setNvEmail(e.target.value)}
                className="rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm" />
            </div>
            {erreurForm && <p className="mt-2 text-sm text-pilou-rouge">{erreurForm}</p>}
            <button type="button" onClick={creerEtablissement}
              className="titre mt-3 rounded bg-pilou-rouge px-4 py-2 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
              Créer l'établissement
            </button>
            <p className="mt-2 text-xs opacity-60">
              L'établissement est créé actif, sans lots : ajoute ensuite ses lots depuis sa fiche.
            </p>
          </section>
        )}

        <ul className="mt-3 space-y-3">
          {restaurants.map((resto) => {
            const lotsDuResto = lots.filter((l) => l.restaurant_id === resto.id)
            const lotsActifs = lotsDuResto.filter((l) => l.actif && l.stock_restant > 0).length
            const enAlerte = lotsDuResto.some((l) => l.actif && l.stock_restant <= l.seuil_alerte)
            const partiesResto = partiesJour.filter((p) => p.restaurant_id === resto.id).length
            return (
              <li key={resto.id}>
                <Link to={`restaurant/${resto.id}`}
                  className="block rounded bg-white/70 p-4 shadow-sm transition hover:bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className={`titre font-bold ${resto.actif ? '' : 'line-through opacity-50'}`}>
                        {resto.nom} <span className="font-normal opacity-60">— {resto.ville}</span>
                      </p>
                      <p className="text-xs opacity-60">
                        Taux : {Math.round(resto.taux_de_gain * 100)}% · {lotsActifs} lot{lotsActifs > 1 ? 's' : ''} disponible{lotsActifs > 1 ? 's' : ''}
                        {!resto.actif && ' · INACTIF'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {enAlerte && <span className="text-pilou-or">🟠 stock bas</span>}
                      {lotsActifs === 0 && <span className="text-pilou-rouge">🔴 aucun lot</span>}
                      <span className="opacity-60">{partiesResto} partie{partiesResto > 1 ? 's' : ''} aujourd'hui</span>
                      <span className="titre font-bold text-pilou-rouge">›</span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <h2 className="titre mt-10 text-lg font-bold text-pilou-rouge">Dernières alertes</h2>
        {alertes.length === 0 && !chargement && (
          <p className="mt-2 text-sm opacity-60">Aucune alerte pour le moment.</p>
        )}
        <ul className="mt-3 space-y-2">
          {alertes.map((a) => (
            <li key={a.id} className="rounded bg-white/70 px-4 py-2 text-sm shadow-sm">
              <span className={a.type === 'rupture' ? 'text-pilou-rouge' : 'text-pilou-or'}>
                {a.type === 'rupture' ? '🔴 Rupture' : '🟠 Stock bas'}
              </span>{' '}
              — <strong>{a.lot_nom}</strong> ({a.restaurant_nom}) · reste {a.stock_restant} ·{' '}
              <span className="opacity-60">{dateAlerte(a.created_at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
