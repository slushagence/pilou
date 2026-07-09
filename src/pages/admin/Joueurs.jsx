import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Joueurs & gagnants : liste filtrable des parties, marquage "lot retiré",
// exports CSV et XLS (parties affichées / contacts newsletter opt-in dédoublonnés).

const PAR_PAGE = 50

function csvTelecharger(nomFichier, lignes) {
  const contenu = '\uFEFF' + lignes
    .map((l) => l.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';'))
    .join('\r\n')
  const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8' })
  const lien = document.createElement('a')
  lien.href = URL.createObjectURL(blob)
  lien.download = nomFichier
  lien.click()
  URL.revokeObjectURL(lien.href)
}

function xlsTelecharger(nomFichier, lignes) {
  const ws = XLSX.utils.aoa_to_sheet(lignes)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Données')
  XLSX.writeFile(wb, nomFichier)
}

export default function Joueurs() {
  const [lieux, setLieux] = useState([])
  const [parties, setParties] = useState([])
  const [chargement, setChargement] = useState(true)
  const [messageErreur, setMessageErreur] = useState(null)
  const [page, setPage] = useState(1)

  // Période
  const jourParis = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date())
  const [dateDebut, setDateDebut] = useState('2026-01-01')
  const [dateFin, setDateFin] = useState(jourParis)

  // Filtres
  const [filtreResto, setFiltreResto] = useState('tous')
  const [filtreGagnants, setFiltreGagnants] = useState(false)
  const [filtreNewsBrasserie, setFiltreNewsBrasserie] = useState(false)
  const [filtreNewsEtab, setFiltreNewsEtab] = useState(false)
  const [filtreConsentement, setFiltreConsentement] = useState(false)
  const [recherche, setRecherche] = useState('')

  // Autocomplete établissement (même ergonomie que le formulaire joueur)
  const [rechercheEtab, setRechercheEtab] = useState('')
  const [listeEtabOuverte, setListeEtabOuverte] = useState(false)
  const [filtreStatut, setFiltreStatut] = useState('tous') // tous | actifs | inactifs

  async function charger() {
    setChargement(true)
    setMessageErreur(null)
    let requete = supabase
      .from('parties')
      .select('*')
      .gte('jour', dateDebut)
      .lte('jour', dateFin)
      .order('created_at', { ascending: false })
      .limit(2000)
    if (filtreResto !== 'tous') requete = requete.eq('lieu_id', filtreResto)
    if (filtreGagnants) requete = requete.eq('resultat', 'gagne')
    if (filtreNewsBrasserie) requete = requete.eq('newsletter_brasserie', true)
    if (filtreNewsEtab) requete = requete.eq('newsletter_etablissement', true)
    if (filtreConsentement) requete = requete.eq('consentement_promo', true)

    const [r1, r2] = await Promise.all([
      supabase.from('lieux').select('id, nom, ville, actif').order('nom'),
      requete,
    ])
    if (r2.error) {
      setMessageErreur('Impossible de charger les parties.')
    } else {
      setLieux(r1.data ?? [])
      setParties(r2.data ?? [])
      setPage(1)
    }
    setChargement(false)
  }

  useEffect(() => { charger() }, [filtreResto, filtreGagnants, filtreNewsBrasserie, filtreNewsEtab, filtreConsentement, dateDebut, dateFin])

  const nomLieu = useMemo(() => {
    const m = new Map(lieux.map((l) => [l.id, `${l.nom} — ${l.ville}`]))
    return (id) => m.get(id) ?? '?'
  }, [lieux])

  // Lieux visibles selon le filtre statut (pour l'autocomplete et le filtrage des parties)
  const lieuxParStatut = useMemo(() => {
    if (filtreStatut === 'actifs') return lieux.filter((l) => l.actif)
    if (filtreStatut === 'inactifs') return lieux.filter((l) => !l.actif)
    return lieux
  }, [lieux, filtreStatut])

  // Recherche locale (email, nom, prénom, code) + statut du lieu
  const partiesFiltrees = useMemo(() => {
    const idsVisibles = new Set(lieuxParStatut.map((l) => l.id))
    let resultat = filtreStatut === 'tous' ? parties : parties.filter((p) => idsVisibles.has(p.lieu_id))
    const q = recherche.trim().toLowerCase()
    if (!q) return resultat
    return resultat.filter((p) =>
      [p.email, p.prenom, p.nom, p.code_retrait]
        .some((champ) => champ && String(champ).toLowerCase().includes(q))
    )
  }, [parties, recherche, lieuxParStatut, filtreStatut])

  const pageMax = Math.max(1, Math.ceil(partiesFiltrees.length / PAR_PAGE))
  const pageAffichee = partiesFiltrees.slice((page - 1) * PAR_PAGE, page * PAR_PAGE)

  function buildLignesParties() {
    const lignes = [[
      'Date', 'Heure', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Établissement',
      'Résultat', 'Lot', 'Code retrait', 'Lot remis', 'Newsletter Brasserie', 'Newsletter Établissement',
    ]]
    for (const p of partiesFiltrees) {
      const d = new Date(p.created_at)
      lignes.push([
        d.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }),
        d.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }),
        p.prenom, p.nom, p.email, p.telephone ?? '',
        nomLieu(p.lieu_id),
        p.resultat === 'gagne' ? 'Gagné' : 'Perdu',
        p.lot_nom ?? '', p.code_retrait ?? '',
        p.resultat === 'gagne' ? (p.retire ? 'Oui' : 'Non') : '',
        p.newsletter_brasserie ? 'Oui' : 'Non',
        p.newsletter_etablissement ? 'Oui' : 'Non',
      ])
    }
    return lignes
  }

  function buildLignesNewsletter() {
    const parEmail = new Map()
    for (const p of [...parties].reverse()) {
      if (p.newsletter_brasserie) parEmail.set(p.email, p)
    }
    const lignes = [['Email', 'Prénom', 'Nom', 'Téléphone']]
    for (const p of parEmail.values()) {
      lignes.push([p.email, p.prenom, p.nom, p.telephone ?? ''])
    }
    return lignes
  }

  function exporterParties(format) {
    const lignes = buildLignesParties()
    if (format === 'xls') xlsTelecharger('pilou-parties.xlsx', lignes)
    else if (format === 'pdf') pdfTelecharger('pilou-parties', lignes)
    else csvTelecharger('pilou-parties.csv', lignes)
  }

  function exporterNewsletter(format) {
    const lignes = buildLignesNewsletter()
    if (format === 'xls') xlsTelecharger('pilou-contacts-newsletter-brasserie.xlsx', lignes)
    else if (format === 'pdf') pdfTelecharger('pilou-newsletter', lignes)
    else csvTelecharger('pilou-contacts-newsletter-brasserie.csv', lignes)
  }

  function pdfTelecharger(nomFichier, lignes) {
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(13)
    doc.setTextColor(163, 32, 24)
    doc.text('PILOU — ' + nomFichier.replace('pilou-', '').replace(/-/g, ' ').toUpperCase(), 14, 16)
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, 22)
    autoTable(doc, {
      startY: 26,
      head: [lignes[0]],
      body: lignes.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [163, 32, 24], textColor: 255, fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 2 },
    })
    doc.save(`${nomFichier}.pdf`)
  }

  const STYLE_FILTRE = 'flex items-center gap-2 text-sm'

  return (
    <main className="fond-papier min-h-screen px-6 py-8 text-pilou-encre">
      <div className="mx-auto max-w-5xl">
        <Link to="/admin" className="text-sm underline opacity-70 hover:opacity-100">
          ‹ Retour aux établissements
        </Link>
        <h1 className="titre mt-4 text-2xl font-bold text-pilou-rouge">Joueurs &amp; gagnants</h1>

        {messageErreur && (
          <p className="mt-4 rounded bg-pilou-rouge px-4 py-2 text-sm text-pilou-creme">{messageErreur}</p>
        )}

        {/* ── Période ── */}
        <section className="mt-4 flex flex-wrap items-center gap-3 rounded bg-white/70 p-4 shadow-sm">
          <span className="text-sm font-semibold opacity-70">Période :</span>
          {[
            { label: "Aujourd'hui", d: jourParis, f: jourParis },
            { label: '7 jours', d: (() => { const d = new Date(); d.setDate(d.getDate()-6); return new Intl.DateTimeFormat('fr-CA',{timeZone:'Europe/Paris'}).format(d) })(), f: jourParis },
            { label: 'Ce mois', d: (() => { const d = new Date(); d.setDate(1); return new Intl.DateTimeFormat('fr-CA',{timeZone:'Europe/Paris'}).format(d) })(), f: jourParis },
            { label: 'Total', d: '2026-01-01', f: jourParis },
          ].map(({ label, d, f }) => (
            <button key={label} type="button" onClick={() => { setDateDebut(d); setDateFin(f) }}
              className={`rounded border px-2 py-1 text-xs ${dateDebut === d && dateFin === f ? 'bg-pilou-rouge text-pilou-creme border-pilou-rouge' : 'border-pilou-creme-fonce bg-white hover:bg-pilou-creme'}`}>
              {label}
            </button>
          ))}
          <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)}
            className="rounded border border-pilou-creme-fonce bg-white px-2 py-1 text-xs" />
          <span className="opacity-60 text-xs">→</span>
          <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)}
            className="rounded border border-pilou-creme-fonce bg-white px-2 py-1 text-xs" />
        </section>

        {/* ── Filtres ── */}
        <section className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3 rounded bg-white/70 p-4 shadow-sm">
          <div className={`${STYLE_FILTRE} relative`}>
            Établissement
            <select value={filtreStatut} onChange={(e) => { setFiltreStatut(e.target.value); setFiltreResto('tous'); setRechercheEtab('') }}
              className="rounded border border-pilou-creme-fonce bg-white px-2 py-1.5 text-xs">
              <option value="tous">Tous</option>
              <option value="actifs">Actifs</option>
              <option value="inactifs">Désactivés</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Commence à taper le nom..."
                value={rechercheEtab}
                onChange={(e) => { setRechercheEtab(e.target.value); setListeEtabOuverte(true); if (!e.target.value.trim()) setFiltreResto('tous') }}
                onFocus={() => setListeEtabOuverte(true)}
                onBlur={() => setTimeout(() => setListeEtabOuverte(false), 150)}
                className="rounded border border-pilou-creme-fonce bg-white px-2 py-1.5 w-56"
              />
              {filtreResto !== 'tous' && (
                <button type="button"
                  onClick={() => { setFiltreResto('tous'); setRechercheEtab('') }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100">
                  ✕
                </button>
              )}
              {listeEtabOuverte && rechercheEtab.trim() && (
                <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded border border-pilou-creme-fonce bg-white shadow-lg">
                  {lieuxParStatut
                    .filter((l) => `${l.nom} ${l.ville}`.toLowerCase().includes(rechercheEtab.trim().toLowerCase()))
                    .slice(0, 12)
                    .map((l) => (
                      <li key={l.id}>
                        <button type="button"
                          onMouseDown={() => { setFiltreResto(l.id); setRechercheEtab(`${l.nom} — ${l.ville}`); setListeEtabOuverte(false) }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-pilou-creme">
                          {l.nom} <span className="opacity-60">— {l.ville}</span>
                          {!l.actif && <span className="ml-1 text-xs text-pilou-rouge">(inactif)</span>}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
          <label className={STYLE_FILTRE}>
            <input type="checkbox" checked={filtreGagnants}
              onChange={(e) => setFiltreGagnants(e.target.checked)} className="accent-pilou-rouge" />
            Gagnants uniquement
          </label>
          <label className={STYLE_FILTRE}>
            <input type="checkbox" checked={filtreNewsBrasserie}
              onChange={(e) => setFiltreNewsBrasserie(e.target.checked)} className="accent-pilou-rouge" />
            Newsletter Brasserie
          </label>
          <label className={STYLE_FILTRE}>
            <input type="checkbox" checked={filtreNewsEtab}
              onChange={(e) => setFiltreNewsEtab(e.target.checked)} className="accent-pilou-rouge" />
            Newsletter établissement
          </label>
          <label className={STYLE_FILTRE}>
            <input type="checkbox" checked={filtreConsentement}
              onChange={(e) => setFiltreConsentement(e.target.checked)} className="accent-pilou-rouge" />
            Acceptation communication
          </label>
          <input type="search" placeholder="Rechercher (email, nom, code...)" value={recherche}
            onChange={(e) => { setRecherche(e.target.value); setPage(1) }}
            className="min-w-52 flex-1 rounded border border-pilou-creme-fonce bg-white px-3 py-1.5 text-sm" />
        </section>

        {/* ── Actions ── */}
        <section className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm opacity-70">
            {chargement ? 'Chargement...' : `${partiesFiltrees.length.toLocaleString('fr-FR')} partie${partiesFiltrees.length > 1 ? 's' : ''}`}
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded border border-pilou-creme-fonce overflow-hidden text-sm">
              <button type="button" onClick={() => exporterParties('csv')}
                className="bg-white/70 px-3 py-1.5 hover:bg-white">
                Parties CSV
              </button>
              <button type="button" onClick={() => exporterParties('xls')}
                className="border-l border-pilou-creme-fonce bg-white/70 px-3 py-1.5 hover:bg-white">
                XLS
              </button>
              <button type="button" onClick={() => exporterParties('pdf')}
                className="border-l border-pilou-creme-fonce bg-white/70 px-3 py-1.5 hover:bg-white">
                PDF
              </button>
            </div>
            <div className="flex rounded overflow-hidden text-sm">
              <button type="button" onClick={() => exporterNewsletter('csv')}
                className="titre bg-pilou-rouge px-3 py-1.5 font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
                Newsletter CSV
              </button>
              <button type="button" onClick={() => exporterNewsletter('xls')}
                className="titre border-l border-pilou-creme bg-pilou-rouge px-3 py-1.5 font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
                XLS
              </button>
              <button type="button" onClick={() => exporterNewsletter('pdf')}
                className="titre border-l border-pilou-creme bg-pilou-rouge px-3 py-1.5 font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
                PDF
              </button>
            </div>
          </div>
        </section>
        <p className="mt-1 text-xs opacity-60">
          RGPD : l'export newsletter ne contient que les joueurs ayant coché la case « newsletter de la
          Brasserie » (dédoublonnés par email). Les coordonnées destinées à un établissement ne doivent lui
          être transmises que pour ses propres joueurs ayant consenti (filtre établissement + newsletter établissement).
        </p>

        {/* ── Tableau ── */}
        <section className="mt-4 overflow-x-auto rounded bg-white/70 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-pilou-rouge text-left text-pilou-creme">
                <th className="p-2">Date</th>
                <th className="p-2">Joueur</th>
                <th className="p-2">Établissement</th>
                <th className="p-2">Résultat</th>
                <th className="p-2 text-center" title="Lot remis (slider barman)">Remis</th>
                <th className="p-2">News.</th>
              </tr>
            </thead>
            <tbody>
              {pageAffichee.map((p) => (
                <tr key={p.id} className="border-t border-pilou-creme-fonce align-top">
                  <td className="p-2 whitespace-nowrap opacity-80">
                    {new Date(p.created_at).toLocaleString('fr-FR', {
                      dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris',
                    })}
                  </td>
                  <td className="p-2">
                    <p className="font-semibold">{p.prenom} {p.nom}</p>
                    <p className="text-xs opacity-60">{p.email}{p.telephone ? ` · ${p.telephone}` : ''}</p>
                  </td>
                  <td className="p-2">{nomLieu(p.lieu_id)}</td>
                  <td className="p-2">
                    {p.resultat === 'gagne' ? (
                      <>
                        <p className="font-semibold text-pilou-rouge">🪙 {p.lot_nom}</p>
                        <p className="text-xs opacity-60">code : {p.code_retrait}</p>
                      </>
                    ) : (
                      <span className="opacity-50">Perdu</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {p.resultat === 'gagne' && (p.retire
                      ? <span className="text-green-600 font-bold" title="Lot remis au gagnant">✕</span>
                      : <span className="opacity-30" title="Lot pas encore remis">—</span>)}
                  </td>
                  <td className="p-2 text-xs">
                    {p.newsletter_brasserie && <span title="Newsletter Brasserie">🍺</span>}
                    {p.newsletter_etablissement && <span title="Newsletter établissement"> 🏠</span>}
                  </td>
                </tr>
              ))}
              {pageAffichee.length === 0 && !chargement && (
                <tr><td colSpan="6" className="p-4 text-center opacity-60">Aucune partie ne correspond aux filtres.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ── Pagination ── */}
        {pageMax > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm">
            <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}
              className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1 disabled:opacity-40">
              ‹ Précédent
            </button>
            <span className="opacity-70">Page {page} / {pageMax}</span>
            <button type="button" disabled={page === pageMax} onClick={() => setPage(page + 1)}
              className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1 disabled:opacity-40">
              Suivant ›
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
