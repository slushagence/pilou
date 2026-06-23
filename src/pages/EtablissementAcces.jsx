import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const PAR_PAGE = 30

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

export default function EtablissementAcces() {
  const { slug } = useParams()

  // Auth par code
  const [codeSaisi, setCodeSaisi] = useState('')
  const [erreurCode, setErreurCode] = useState(false)
  const [lieu, setLieu] = useState(null)
  const [authentifie, setAuthentifie] = useState(false)
  const [chargementAuth, setChargementAuth] = useState(false)

  // Données
  const [parties, setParties] = useState([])
  const [lots, setLots] = useState([])
  const [chargement, setChargement] = useState(false)
  const [page, setPage] = useState(1)
  const [filtreGagnants, setFiltreGagnants] = useState(false)
  const [filtreNewsletter, setFiltreNewsletter] = useState(false)

  // Période
  const jourParis = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date())
  const [dateDebut, setDateDebut] = useState(jourParis)
  const [dateFin, setDateFin] = useState(jourParis)

  async function verifierCode() {
    setChargementAuth(true)
    setErreurCode(false)
    const { data, error } = await supabase
      .from('lieux')
      .select('*')
      .eq('slug', slug)
      .eq('code_acces', codeSaisi.trim())
      .single()
    if (error || !data) {
      setErreurCode(true)
    } else {
      setLieu(data)
      setAuthentifie(true)
    }
    setChargementAuth(false)
  }

  async function chargerParties() {
    if (!lieu) return
    setChargement(true)
    let requete = supabase
      .from('parties')
      .select('*')
      .eq('lieu_id', lieu.id)
      .gte('jour', dateDebut)
      .lte('jour', dateFin)
      .order('created_at', { ascending: false })
      .limit(1000)
    if (filtreGagnants) requete = requete.eq('resultat', 'gagne')
    if (filtreNewsletter) requete = requete.eq('newsletter_etablissement', true)
    const [{ data: partiesData }, { data: lotsData }] = await Promise.all([
      requete,
      supabase.from('lots').select('nom, valeur_euros, stock_restant, stock_initial, poids, actif').eq('lieu_id', lieu.id).order('created_at'),
    ])
    setParties(partiesData ?? [])
    setLots(lotsData ?? [])
    setPage(1)
    setChargement(false)
  }

  useEffect(() => {
    if (authentifie) chargerParties()
  }, [authentifie, dateDebut, dateFin, filtreGagnants, filtreNewsletter])

  function exporterCSV() {
    const lignes = buildLignesGagnants()
    csvTelecharger(`pilou-${slug}.csv`, lignes)
  }

  function exporterXLS() {
    const lignes = buildLignesGagnants()
    const ws = XLSX.utils.aoa_to_sheet(lignes)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Gagnants')
    XLSX.writeFile(wb, `pilou-${slug}.xlsx`)
  }

  function exporterPDF() {
    const lignes = buildLignesGagnants()
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(13)
    doc.setTextColor(163, 32, 24)
    doc.text(`PILOU — ${lieu.nom} — ${lieu.ville}`, 14, 16)
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
    doc.save(`pilou-${slug}.pdf`)
  }

  function buildLignesGagnants() {
    const lignes = [['Date', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Résultat', 'Lot', 'Code retrait', 'Newsletter']]
    for (const p of partiesFiltrees) {
      const d = new Date(p.created_at)
      lignes.push([
        d.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }),
        p.prenom, p.nom, p.email, p.telephone ?? '',
        p.resultat === 'gagne' ? 'Gagné' : 'Perdu',
        p.lot_nom ?? '', p.code_retrait ?? '',
        p.newsletter_etablissement ? 'Oui' : 'Non',
      ])
    }
    return lignes
  }

  const totalParties = parties.length
  const totalGagnants = parties.filter((p) => p.resultat === 'gagne').length
  const partiesFiltrees = parties
  const pageMax = Math.max(1, Math.ceil(partiesFiltrees.length / PAR_PAGE))
  const pageAffichee = partiesFiltrees.slice((page - 1) * PAR_PAGE, page * PAR_PAGE)

  const CHAMP = 'rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm'

  // ── Écran de connexion ──
  if (!authentifie) {
    return (
      <main className="fond-papier min-h-screen flex flex-col items-center justify-center px-6 py-10 text-pilou-encre">
        <LogoPilou variante="couleur" hauteur={56} />
        <h1 className="titre mt-8 text-2xl font-bold text-center">Accès établissement</h1>
        <p className="mt-2 text-sm opacity-70 text-center">Saisissez votre code d'accès</p>
        <div className="mt-6 w-full max-w-xs">
          <input
            type="password"
            className={`${CHAMP} w-full text-center text-lg tracking-widest`}
            placeholder="Code d'accès"
            value={codeSaisi}
            onChange={(e) => setCodeSaisi(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && verifierCode()}
          />
          {erreurCode && <p className="mt-2 text-sm text-pilou-rouge text-center">Code incorrect.</p>}
          <button
            type="button"
            onClick={verifierCode}
            disabled={chargementAuth || !codeSaisi.trim()}
            className="titre mt-4 w-full rounded bg-pilou-rouge py-3 font-bold text-pilou-creme hover:bg-pilou-rouge-fonce disabled:opacity-50"
          >
            {chargementAuth ? 'Vérification...' : 'Accéder'}
          </button>
        </div>
      </main>
    )
  }

  // ── Interface établissement ──
  return (
    <main className="fond-papier min-h-screen px-6 py-8 text-pilou-encre">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <LogoPilou variante="couleur" hauteur={40} />
            <h1 className="titre mt-2 text-xl font-bold text-pilou-rouge">{lieu.nom}</h1>
            <p className="text-sm opacity-60">{lieu.ville}</p>
          </div>
          <button type="button" onClick={() => setAuthentifie(false)}
            className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1.5 text-sm hover:bg-white">
            Se déconnecter
          </button>
        </header>

        {/* Stats */}
        <section className="mt-6 rounded bg-white/70 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="titre font-bold text-sm">Statistiques</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Aujourd'hui", d: jourParis, f: jourParis },
                { label: '7 jours', d: (() => { const d = new Date(); d.setDate(d.getDate()-6); return new Intl.DateTimeFormat('fr-CA',{timeZone:'Europe/Paris'}).format(d) })(), f: jourParis },
                { label: 'Ce mois', d: (() => { const d = new Date(); d.setDate(1); return new Intl.DateTimeFormat('fr-CA',{timeZone:'Europe/Paris'}).format(d) })(), f: jourParis },
                { label: 'Total', d: '2026-01-01', f: jourParis },
              ].map(({ label, d, f }) => (
                <button key={label} type="button" onClick={() => { setDateDebut(d); setDateFin(f) }}
                  className="rounded border border-pilou-creme-fonce bg-white px-2 py-1 text-xs hover:bg-pilou-creme">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mb-3 text-xs items-center flex-wrap">
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

        {/* Filtres + export */}
        <section className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded bg-white/70 p-3 shadow-sm text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filtreGagnants} onChange={(e) => setFiltreGagnants(e.target.checked)} className="accent-pilou-rouge" />
            Gagnants uniquement
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filtreNewsletter} onChange={(e) => setFiltreNewsletter(e.target.checked)} className="accent-pilou-rouge" />
            Newsletter établissement
          </label>
          <div className="flex flex-wrap gap-2 ml-auto">
            <div className="flex rounded border border-pilou-creme-fonce overflow-hidden text-sm">
              <button type="button" onClick={exporterCSV}
                className="bg-white/70 px-3 py-1.5 hover:bg-white">CSV</button>
              <button type="button" onClick={exporterXLS}
                className="border-l border-pilou-creme-fonce bg-white/70 px-3 py-1.5 hover:bg-white">XLS</button>
              <button type="button" onClick={exporterPDF}
                className="border-l border-pilou-creme-fonce bg-white/70 px-3 py-1.5 hover:bg-white">PDF</button>
            </div>
          </div>
        </section>
        <p className="mt-1 text-xs opacity-50">
          RGPD : l'export newsletter ne contient que les joueurs ayant consenti à recevoir vos communications.
        </p>

        {/* Tableau */}
        <section className="mt-3 overflow-x-auto rounded bg-white/70 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-pilou-rouge text-left text-pilou-creme">
                <th className="p-2">Date</th>
                <th className="p-2">Joueur</th>
                <th className="p-2">Résultat</th>
                <th className="p-2">News.</th>
              </tr>
            </thead>
            <tbody>
              {pageAffichee.map((p) => (
                <tr key={p.id} className="border-t border-pilou-creme-fonce align-top">
                  <td className="p-2 whitespace-nowrap opacity-80 text-xs">
                    {new Date(p.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })}
                  </td>
                  <td className="p-2">
                    <p className="font-semibold">{p.prenom} {p.nom}</p>
                    <p className="text-xs opacity-60">{p.email}{p.telephone ? ` · ${p.telephone}` : ''}</p>
                  </td>
                  <td className="p-2">
                    {p.resultat === 'gagne' ? (
                      <>
                        <p className="font-semibold text-pilou-rouge">🪙 {p.lot_nom}</p>
                        <p className="text-xs opacity-60">code : {p.code_retrait}</p>
                      </>
                    ) : <span className="opacity-40">Perdu</span>}
                  </td>
                  <td className="p-2 text-xs">
                    {p.newsletter_etablissement && <span title="Newsletter établissement">✓</span>}
                  </td>
                </tr>
              ))}
              {pageAffichee.length === 0 && !chargement && (
                <tr><td colSpan="4" className="p-4 text-center opacity-60">Aucune partie pour cette période.</td></tr>
              )}
            </tbody>
          </table>
        </section>

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

        {/* ── Lots en lecture seule ── */}
        {lots.length > 0 && (
          <section className="mt-8">
            <h2 className="titre text-lg font-bold text-pilou-rouge mb-3">Vos lots</h2>
            <div className="rounded bg-white/70 shadow-sm overflow-hidden">
              {lots.map((lot, i) => {
                const totalPoids = lots.filter((l) => l.actif && l.stock_restant > 0).reduce((s, l) => s + l.poids, 0)
                const pct = totalPoids > 0 ? Math.round((lot.poids / totalPoids) * 100) : 0
                return (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? 'border-t border-pilou-creme-fonce' : ''}`}>
                    <div>
                      <p className={`font-semibold ${!lot.actif ? 'line-through opacity-40' : ''}`}>{lot.nom}</p>
                      <p className="text-xs opacity-60">{Number(lot.valeur_euros).toFixed(2).replace('.', ',')} € · {pct}% des gains</p>
                    </div>
                    <div className="text-right">
                      <p className={`titre font-bold ${lot.stock_restant === 0 ? 'text-pilou-rouge' : lot.stock_restant <= 5 ? 'text-pilou-or' : ''}`}>
                        {lot.stock_restant} / {lot.stock_initial}
                      </p>
                      <p className="text-xs opacity-50">en stock</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Bouton contact ── */}
        <section className="mt-8 mb-6 rounded bg-pilou-creme border border-pilou-creme-fonce p-4 text-center">
          <p className="text-sm font-semibold mb-2">Un problème ou une question ?</p>
          <a
            href="mailto:pilou@brasserieducomte.fr?subject=Aide%20PILOU%20-%20{lieu.nom}"
            className="titre inline-block rounded bg-pilou-rouge px-6 py-2.5 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce"
          >
            📩 Nous contacter
          </a>
        </section>
      </div>
    </main>
  )
}
