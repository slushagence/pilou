import { useEffect, useMemo, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'
import * as XLSX from 'xlsx'

function genererSlug(nom, ville) {
  return `${nom} ${ville}`
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Formate une date JS en YYYY-MM-DD (fuseau Paris)
function toDateParis(date) {
  return new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(date)
}

// Date ISO YYYY-MM-DD → affichage FR
function afficherDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function Dashboard() {
  const [lieux, setLieux] = useState([])
  const [lots, setLots] = useState([])
  const [partiesPeriode, setPartiesPeriode] = useState([])
  const [alertes, setAlertes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [messageErreur, setMessageErreur] = useState(null)

  // Période stats
  const jourParis = useMemo(() => toDateParis(new Date()), [])
  const [dateDebut, setDateDebut] = useState(jourParis)
  const [dateFin, setDateFin] = useState(jourParis)
  const periodeLibelle = dateDebut === dateFin
    ? (dateDebut === jourParis ? "aujourd'hui" : `le ${afficherDate(dateDebut)}`)
    : `du ${afficherDate(dateDebut)} au ${afficherDate(dateFin)}`

  // Formulaire de création d'établissement
  const [formOuvert, setFormOuvert] = useState(false)
  const [nvNom, setNvNom] = useState('')
  const [nvVille, setNvVille] = useState('Nice')
  const [nvTaux, setNvTaux] = useState('25')
  const [nvEmail, setNvEmail] = useState('')
  const [erreurForm, setErreurForm] = useState(null)

  // Import XLS
  const [importEtat, setImportEtat] = useState(null) // null | 'en_cours' | 'succes' | 'erreur'
  const [importMessage, setImportMessage] = useState('')
  const inputFichier = useRef(null)

  // Recherche établissements
  const [rechercheLieux, setRechercheLieux] = useState('')

  function exporterLieux() {
    const lignes = [['nom', 'ville', 'email_contact', 'telephone', 'contact', 'taux_de_gain_%', 'code_acces']]
    for (const lieu of lieux) {
      lignes.push([
        lieu.nom,
        lieu.ville,
        lieu.email_contact ?? '',
        lieu.telephone ?? '',
        lieu.contact ?? '',
        Math.round(lieu.taux_de_gain * 100),
        lieu.code_acces ?? '',
      ])
    }
    const ws = XLSX.utils.aoa_to_sheet(lignes)
    ws['!cols'] = [30, 20, 30, 18, 24, 18, 22].map((w) => ({ wch: w }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Établissements')
    XLSX.writeFile(wb, 'pilou-etablissements.xlsx')
  }

  async function importerXLS(e) {
    const fichier = e.target.files?.[0]
    if (!fichier) return
    setImportEtat('en_cours')
    setImportMessage('Lecture du fichier...')

    try {
      const buffer = await fichier.arrayBuffer()
      const wb = XLSX.read(buffer)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const lignes = XLSX.utils.sheet_to_json(ws, { defval: '' })

      let crees = 0, mis_a_jour = 0, erreurs = []

      for (const ligne of lignes) {
        const nom = String(ligne['nom'] ?? '').trim()
        const ville = String(ligne['ville'] ?? '').trim()
        if (!nom || !ville) continue

        const taux = parseFloat(String(ligne['taux_de_gain_%'] ?? 25).replace(',', '.'))
        const donnees = {
          nom,
          ville,
          slug: genererSlug(nom, ville),
          email_contact: String(ligne['email_contact'] ?? '').trim() || null,
          telephone: String(ligne['telephone'] ?? '').trim() || null,
          contact: String(ligne['contact'] ?? '').trim() || null,
          taux_de_gain: (isNaN(taux) ? 25 : taux) / 100,
          code_acces: String(ligne['code_acces'] ?? '').trim() || null,
        }

        // Vérifie si le lieu existe déjà (par nom + ville)
        const { data: existant } = await supabase
          .from('lieux').select('id').eq('nom', nom).eq('ville', ville).single()

        if (existant) {
          const { error } = await supabase.from('lieux').update(donnees).eq('id', existant.id)
          if (error) erreurs.push(`${nom} (${ville}) : ${error.message}`)
          else mis_a_jour++
        } else {
          const { error } = await supabase.from('lieux').insert(donnees)
          if (error) erreurs.push(`${nom} (${ville}) : ${error.message}`)
          else crees++
        }
      }

      if (erreurs.length > 0) {
        setImportEtat('erreur')
        setImportMessage(`${crees} créés, ${mis_a_jour} mis à jour. Erreurs : ${erreurs.join(' | ')}`)
      } else {
        setImportEtat('succes')
        setImportMessage(`✅ ${crees} établissement(s) créé(s), ${mis_a_jour} mis à jour.`)
        chargerTout()
      }
    } catch (err) {
      setImportEtat('erreur')
      setImportMessage(`Erreur de lecture : ${err.message}`)
    }
    e.target.value = ''
  }

  async function chargerTout() {
    setMessageErreur(null)
    setChargement(true)
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('lieux').select('*').order('nom'),
      supabase.from('lots').select('id, lieu_id, actif, stock_restant, seuil_alerte'),
      supabase.from('parties').select('lieu_id, resultat')
        .gte('jour', dateDebut)
        .lte('jour', dateFin),
      supabase.from('alertes_stock').select('*').order('created_at', { ascending: false }).limit(6),
    ])
    if (r1.error) {
      setMessageErreur("Impossible de charger les données. Vérifie l'exposition des tables (Settings → Data API).")
    } else {
      setLieux(r1.data ?? [])
      setLots(r2.data ?? [])
      setPartiesPeriode(r3.data ?? [])
      setAlertes(r4.data ?? [])
    }
    setChargement(false)
  }

  useEffect(() => { chargerTout() }, [dateDebut, dateFin])

  async function creerEtablissement() {
    setErreurForm(null)
    const taux = parseFloat(String(nvTaux).replace(',', '.'))
    if (!nvNom.trim() || !nvVille.trim()) { setErreurForm('Nom et ville sont requis.'); return }
    if (Number.isNaN(taux) || taux < 0 || taux > 100) {
      setErreurForm('Le taux de gain doit être entre 0 et 100 %.'); return
    }
    const { error } = await supabase.from('lieux').insert({
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

  const totalParties = partiesPeriode.length
  const totalGagnants = partiesPeriode.filter((p) => p.resultat === 'gagne').length

  // Raccourcis période
  function setPeriode(type) {
    const auj = toDateParis(new Date())
    if (type === 'jour') { setDateDebut(auj); setDateFin(auj) }
    else if (type === 'semaine') {
      const d = new Date(); d.setDate(d.getDate() - 6)
      setDateDebut(toDateParis(d)); setDateFin(auj)
    }
    else if (type === 'mois') {
      const d = new Date(); d.setDate(1)
      setDateDebut(toDateParis(d)); setDateFin(auj)
    }
    else if (type === 'total') {
      setDateDebut('2026-01-01'); setDateFin(auj)
    }
  }

  const CHAMP = 'rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm'

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

        {/* ── Stats avec sélecteur de période ── */}
        <section className="mt-6 rounded bg-white/70 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="titre font-bold text-sm">Statistiques — <span className="text-pilou-rouge">{periodeLibelle}</span></p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Aujourd'hui", type: 'jour' },
                { label: '7 jours', type: 'semaine' },
                { label: 'Ce mois', type: 'mois' },
                { label: 'Total', type: 'total' },
              ].map(({ label, type }) => (
                <button key={type} type="button" onClick={() => setPeriode(type)}
                  className="rounded border border-pilou-creme-fonce bg-white px-2 py-1 text-xs hover:bg-pilou-creme">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sélecteur dates personnalisées */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
            <span className="opacity-60">Ou choisir une période :</span>
            <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)}
              className="rounded border border-pilou-creme-fonce bg-white px-2 py-1 text-xs" />
            <span className="opacity-60">→</span>
            <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)}
              className="rounded border border-pilou-creme-fonce bg-white px-2 py-1 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded bg-pilou-creme p-4 text-center">
              <p className="titre text-3xl font-bold text-pilou-rouge">{chargement ? '…' : totalParties}</p>
              <p className="text-sm opacity-70">parties jouées</p>
            </div>
            <div className="rounded bg-pilou-creme p-4 text-center">
              <p className="titre text-3xl font-bold text-pilou-or">{chargement ? '…' : totalGagnants}</p>
              <p className="text-sm opacity-70">gagnants</p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2">
          <h2 className="titre text-lg font-bold text-pilou-rouge">Établissements</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exporterLieux}
              className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1.5 text-sm hover:bg-white">
              📥 Exporter XLS
            </button>
            <button type="button" onClick={() => inputFichier.current?.click()}
              className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1.5 text-sm hover:bg-white">
              📤 Importer XLS
            </button>
            <input ref={inputFichier} type="file" accept=".xlsx,.xls" className="hidden" onChange={importerXLS} />
            <button type="button" onClick={() => setFormOuvert(!formOuvert)}
              className="titre rounded bg-pilou-rouge px-3 py-1.5 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
              {formOuvert ? 'Annuler' : '+ Ajouter'}
            </button>
          </div>
        </div>

        {importEtat && (
          <p className={`mt-2 rounded px-3 py-2 text-sm ${
            importEtat === 'succes' ? 'bg-green-100 text-green-800'
            : importEtat === 'erreur' ? 'bg-red-100 text-red-800'
            : 'bg-pilou-creme text-pilou-encre opacity-70'
          }`}>
            {importEtat === 'en_cours' ? '⏳ ' : ''}{importMessage}
          </p>
        )}

        {/* Recherche établissements */}
        <input
          type="search"
          placeholder="🔍 Rechercher un établissement (nom, ville...)"
          value={rechercheLieux}
          onChange={(e) => setRechercheLieux(e.target.value)}
          className="mt-3 w-full rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-pilou-rouge"
        />

        {formOuvert && (
          <section className="mt-3 rounded bg-white/70 p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="text" placeholder="Nom de l'établissement / événement *" value={nvNom}
                onChange={(e) => setNvNom(e.target.value)}
                className={CHAMP} />
              <input type="text" placeholder="Ville *" value={nvVille}
                onChange={(e) => setNvVille(e.target.value)}
                className={CHAMP} />
              <input type="text" placeholder="Taux de gain en % (ex: 25)" value={nvTaux}
                onChange={(e) => setNvTaux(e.target.value)}
                className={CHAMP} />
              <input type="email" placeholder="Email d'alerte" value={nvEmail}
                onChange={(e) => setNvEmail(e.target.value)}
                className={CHAMP} />
            </div>
            {erreurForm && <p className="mt-2 text-sm text-pilou-rouge">{erreurForm}</p>}
            <button type="button" onClick={creerEtablissement}
              className="titre mt-3 rounded bg-pilou-rouge px-4 py-2 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
              Créer l'établissement / événement
            </button>
            <p className="mt-2 text-xs opacity-60">
              L'établissement est créé actif, sans lots : ajoute ensuite ses lots depuis sa fiche.
            </p>
          </section>
        )}

        <ul className="mt-3 space-y-3">
          {lieux
            .filter((lieu) => {
              const q = rechercheLieux.trim().toLowerCase()
              if (!q) return true
              return `${lieu.nom} ${lieu.ville}`.toLowerCase().includes(q)
            })
            .map((lieu) => {
            const lotsduLieu = lots.filter((l) => l.lieu_id === lieu.id)
            const lotsActifs = lotsduLieu.filter((l) => l.actif && l.stock_restant > 0).length
            const enAlerte = lotsduLieu.some((l) => l.actif && l.stock_restant <= l.seuil_alerte)
            const partiesLieu = partiesPeriode.filter((p) => p.lieu_id === lieu.id).length
            return (
              <li key={lieu.id}>
                <Link to={`lieu/${lieu.id}`}
                  className="block rounded bg-white/70 p-4 shadow-sm transition hover:bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className={`titre font-bold ${lieu.actif ? '' : 'line-through opacity-50'}`}>
                        {lieu.nom} <span className="font-normal opacity-60">— {lieu.ville}</span>
                      </p>
                      <p className="text-xs opacity-60">
                        Taux : {Math.round(lieu.taux_de_gain * 100)}% · {lotsActifs} lot{lotsActifs > 1 ? 's' : ''} disponible{lotsActifs > 1 ? 's' : ''}
                        {!lieu.actif && ' · INACTIF'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {enAlerte && <span className="text-pilou-or">🟠 stock bas</span>}
                      {lotsActifs === 0 && <span className="text-pilou-rouge">🔴 aucun lot</span>}
                      <span className="opacity-60">{partiesLieu} partie{partiesLieu > 1 ? 's' : ''} {periodeLibelle}</span>
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
              — <strong>{a.lot_nom}</strong> ({a.lieu_nom}) · reste {a.stock_restant} ·{' '}
              <span className="opacity-60">{dateAlerte(a.created_at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
