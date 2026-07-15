import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const CHAMP = 'rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm'

function LigneLot({ lot, totalPoids, tauxDeGain, onMaj, onSupprimer }) {
  const [edition, setEdition] = useState(false)
  const [valeurs, setValeurs] = useState({})

  function ouvrirEdition() {
    const pctAffiche = totalPoids > 0 ? Math.round((lot.poids / totalPoids) * 100) : lot.poids
    setValeurs({
      nom: lot.nom,
      description: lot.description ?? '',
      valeur_euros: String(lot.valeur_euros),
      stock_restant: String(lot.stock_restant),
      stock_initial: String(lot.stock_initial),
      seuil_alerte: String(lot.seuil_alerte),
      pct: String(pctAffiche),
    })
    setEdition(true)
  }

  async function enregistrer() {
    const pct = parseInt(valeurs.pct, 10)
    if (isNaN(pct) || pct < 1 || pct > 100) return
    const maj = {
      nom: valeurs.nom.trim(),
      description: valeurs.description.trim() || null,
      valeur_euros: parseFloat(String(valeurs.valeur_euros).replace(',', '.')),
      stock_restant: parseInt(valeurs.stock_restant, 10),
      stock_initial: parseInt(valeurs.stock_initial, 10),
      seuil_alerte: parseInt(valeurs.seuil_alerte, 10),
      poids: pct,
    }
    if (!maj.nom || Object.values(maj).some((v) => typeof v === 'number' && (Number.isNaN(v) || v < 0))) return
    await onMaj(lot.id, maj)
    setEdition(false)
  }

  const disponible = lot.actif && lot.stock_restant > 0
  const proba = disponible && totalPoids > 0 ? tauxDeGain * (lot.poids / totalPoids) : 0
  const uneChanceSur = proba > 0 ? Math.round(1 / proba) : null
  const pctReel = totalPoids > 0 ? Math.round((lot.poids / totalPoids) * 100) : 0

  if (edition) {
    return (
      <div className="mt-3 rounded border border-pilou-or bg-white p-3 text-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={CHAMP} placeholder="Nom *" value={valeurs.nom}
            onChange={(e) => setValeurs((v) => ({ ...v, nom: e.target.value }))} />
          <input className={CHAMP} placeholder="Valeur en € *" value={valeurs.valeur_euros}
            onChange={(e) => setValeurs((v) => ({ ...v, valeur_euros: e.target.value }))} />
          <input className={`${CHAMP} sm:col-span-2`} placeholder="Description"
            value={valeurs.description}
            onChange={(e) => setValeurs((v) => ({ ...v, description: e.target.value }))} />
          <label className="text-xs opacity-70">Stock restant
            <input type="number" min="0" className={`${CHAMP} mt-1 w-full`} value={valeurs.stock_restant}
              onChange={(e) => setValeurs((v) => ({ ...v, stock_restant: e.target.value }))} />
          </label>
          <label className="text-xs opacity-70">Stock initial
            <input type="number" min="0" className={`${CHAMP} mt-1 w-full`} value={valeurs.stock_initial}
              onChange={(e) => setValeurs((v) => ({ ...v, stock_initial: e.target.value }))} />
          </label>
          <label className="text-xs opacity-70">Alerte stock (reste X → mail BDC)
            <input type="number" min="0" className={`${CHAMP} mt-1 w-full`} value={valeurs.seuil_alerte}
              onChange={(e) => setValeurs((v) => ({ ...v, seuil_alerte: e.target.value }))} />
          </label>
          <label className="text-xs opacity-70">% répartition des gains (sur 100%)
            <input type="number" min="1" max="100" className={`${CHAMP} mt-1 w-full`} value={valeurs.pct}
              onChange={(e) => setValeurs((v) => ({ ...v, pct: e.target.value }))} />
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={enregistrer}
            className="titre rounded bg-pilou-rouge px-3 py-1.5 text-xs font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
            Enregistrer
          </button>
          <button type="button" onClick={() => setEdition(false)}
            className="rounded border border-pilou-creme-fonce px-3 py-1.5 text-xs hover:bg-pilou-creme">
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-pilou-creme-fonce pt-3 text-sm">
      <div className="min-w-40 flex-1">
        <p className={`font-semibold ${lot.actif ? '' : 'line-through opacity-50'}`}>
          {lot.nom} <span className="font-normal opacity-60">· {Number(lot.valeur_euros).toFixed(2).replace('.', ',')} €</span>
        </p>
        <p className="text-xs opacity-60">
          alerte à {lot.seuil_alerte} lots · répartition : {pctReel}%
          {uneChanceSur
            ? ` · ≈ 1 chance sur ${uneChanceSur.toLocaleString('fr-FR')}`
            : ' · hors tirage'}
        </p>
      </div>
      <p className={`titre w-20 text-center font-bold ${
        lot.stock_restant === 0 ? 'text-pilou-rouge'
        : lot.stock_restant <= lot.seuil_alerte ? 'text-pilou-or' : ''}`}>
        {lot.stock_restant} / {lot.stock_initial}
      </p>
      <button type="button" onClick={ouvrirEdition}
        className="rounded border border-pilou-creme-fonce bg-white px-2 py-1 text-xs hover:bg-pilou-creme">
        Modifier
      </button>
      <button type="button" onClick={() => onMaj(lot.id, { actif: !lot.actif })}
        className={`rounded border px-2 py-1 text-xs ${
          lot.actif ? 'border-pilou-creme-fonce bg-white hover:bg-pilou-creme'
          : 'border-pilou-rouge bg-pilou-rouge text-pilou-creme'}`}>
        {lot.actif ? 'Désactiver' : 'Réactiver'}
      </button>
      <button type="button" onClick={() => onSupprimer(lot)}
        className="rounded border border-pilou-rouge px-2 py-1 text-xs text-pilou-rouge hover:bg-pilou-rouge hover:text-pilou-creme">
        Supprimer
      </button>
    </div>
  )
}

export default function FicheRestaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lieu, setLieu] = useState(null)
  const [lots, setLots] = useState([])
  const [messageErreur, setMessageErreur] = useState(null)
  const [messageSucces, setMessageSucces] = useState(null)

  const [nomResto, setNomResto] = useState('')
  const [villeResto, setVilleResto] = useState('')
  const [telephoneResto, setTelephoneResto] = useState('')
  const [contactResto, setContactResto] = useState('')
  const [tauxPct, setTauxPct] = useState('')
  const [emailContact, setEmailContact] = useState('')
  const [codeAcces, setCodeAcces] = useState('')

  // Stats du lieu
  const [stats, setStats] = useState({ parties: 0, gagnants: 0 })

  // Dernières participations de ce lieu
  const [partiesLieu, setPartiesLieu] = useState([])
  const [filtreGagnantsLieu, setFiltreGagnantsLieu] = useState(false)

  const [formLot, setFormLot] = useState(false)
  const [nl, setNl] = useState({ nom: '', description: '', valeur: '', stock: '', seuil: '5', pct: '50' })
  const [erreurLot, setErreurLot] = useState(null)

  const jourParis = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date())

  async function charger() {
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('lieux').select('*').eq('id', id).single(),
      supabase.from('lots').select('*').eq('lieu_id', id).order('created_at'),
      supabase.from('parties').select('resultat').eq('lieu_id', id).eq('jour', jourParis),
      supabase.from('parties')
        .select('id, created_at, prenom, nom, email, telephone, resultat, lot_nom, code_retrait, retire')
        .eq('lieu_id', id)
        .order('created_at', { ascending: false })
        .limit(100),
    ])
    if (r1.error) { setMessageErreur("Établissement introuvable."); return }
    setLieu(r1.data)
    setNomResto(r1.data.nom ?? '')
    setVilleResto(r1.data.ville ?? '')
    setTelephoneResto(r1.data.telephone ?? '')
    setContactResto(r1.data.contact ?? '')
    setTauxPct(String(Math.round(r1.data.taux_de_gain * 100)))
    setEmailContact(r1.data.email_contact ?? '')
    setCodeAcces(r1.data.code_acces ?? '')
    setLots(r2.data ?? [])
    const parties = r3.data ?? []
    setStats({
      parties: parties.length,
      gagnants: parties.filter((p) => p.resultat === 'gagne').length,
    })
    setPartiesLieu(r4.data ?? [])
  }

  useEffect(() => { charger() }, [id])

  async function envoyerIdentifiants() {
    if (!emailContact.trim() || !codeAcces.trim()) {
      setMessageErreur("Renseignez l'email et le code d'accès avant d'envoyer."); return
    }
    // On sauvegarde d'abord les réglages
    await enregistrerReglages()
    // Puis on envoie le mail via l'edge function
    const { error } = await supabase.functions.invoke('quick-task', {
      body: {
        type: 'identifiants',
        email: emailContact.trim(),
        nom: nomResto.trim(),
        ville: villeResto.trim(),
        slug: lieu.slug,
        code_acces: codeAcces.trim(),
      },
    })
    if (error) {
      setMessageErreur("Erreur lors de l'envoi du mail.")
    } else {
      setMessageSucces(`Mail d'accès envoyé à ${emailContact} !`)
      setTimeout(() => setMessageSucces(null), 4000)
    }
  }

  async function enregistrerReglages() {
    const taux = parseFloat(String(tauxPct).replace(',', '.'))
    if (!nomResto.trim() || !villeResto.trim()) {
      setMessageErreur('Le nom et la ville sont requis.'); return
    }
    if (Number.isNaN(taux) || taux < 0 || taux > 100) {
      setMessageErreur('Le taux de gain doit être entre 0 et 100 %.'); return
    }
    setMessageErreur(null)
    await supabase.from('lieux').update({
      nom: nomResto.trim(),
      ville: villeResto.trim(),
      telephone: telephoneResto.trim() || null,
      contact: contactResto.trim() || null,
      taux_de_gain: taux / 100,
      email_contact: emailContact.trim() || null,
      code_acces: codeAcces.trim() || null,
    }).eq('id', id)
    charger()
  }

  async function basculerActifResto() {
    await supabase.from('lieux').update({ actif: !lieu.actif }).eq('id', id)
    charger()
  }

  async function supprimerEtablissement() {
    if (!window.confirm(
      `Supprimer définitivement « ${lieu.nom} » ?\n\nTous les lots seront supprimés.\nLes parties jouées sont conservées dans l'historique.`
    )) return
    // Supprimer les lots d'abord
    await supabase.from('lots').delete().eq('lieu_id', id)
    // Puis supprimer le lieu
    const { error } = await supabase.from('lieux').delete().eq('id', id)
    if (error) {
      setMessageErreur('Suppression impossible. Des parties sont liées à cet établissement.')
    } else {
      navigate('/admin')
    }
  }

  function exporterPDF() {
    const doc = new jsPDF()
    const dateGen = new Date().toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })

    // En-tête
    doc.setFontSize(18)
    doc.setTextColor(180, 30, 30)
    doc.text('PILOU — Fiche établissement', 14, 20)

    doc.setFontSize(11)
    doc.setTextColor(40, 40, 40)
    doc.text(`Générée le ${dateGen}`, 14, 28)

    // Infos établissement
    doc.setFontSize(13)
    doc.setTextColor(180, 30, 30)
    doc.text('Informations', 14, 40)

    doc.setFontSize(11)
    doc.setTextColor(40, 40, 40)
    const infos = [
      ['Nom', lieu.nom],
      ['Ville', lieu.ville],
      ['Téléphone', lieu.telephone ?? '—'],
      ['Contact', lieu.contact ?? '—'],
      ['Email d\'alerte', lieu.email_contact ?? '—'],
      ['Statut', lieu.actif ? 'Actif' : 'Inactif'],
      ['Taux de gain', `${Math.round(lieu.taux_de_gain * 100)} %`],
    ]
    autoTable(doc, {
      startY: 44,
      head: [],
      body: infos,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    })

    // Lots
    const lotsActifs = lots.filter((l) => l.actif)
    doc.setFontSize(13)
    doc.setTextColor(180, 30, 30)
    doc.text('Lots', 14, doc.lastAutoTable.finalY + 12)

    const totalPoidsPDF = lotsActifs
      .filter((l) => l.stock_restant > 0)
      .reduce((s, l) => s + l.poids, 0)

    const lignesLots = lots.map((l) => {
      const pct = totalPoidsPDF > 0 ? Math.round((l.poids / totalPoidsPDF) * 100) : 0
      const proba = totalPoidsPDF > 0 && l.stock_restant > 0
        ? lieu.taux_de_gain * (l.poids / totalPoidsPDF) : 0
      const chanceSur = proba > 0 ? `1 chance sur ${Math.round(1 / proba).toLocaleString('fr-FR')}` : 'Hors tirage'
      return [
        l.nom,
        `${Number(l.valeur_euros).toFixed(2).replace('.', ',')} €`,
        `${l.stock_restant} / ${l.stock_initial}`,
        `${pct} %`,
        chanceSur,
        l.actif ? 'Actif' : 'Inactif',
      ]
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Lot', 'Valeur', 'Stock', 'Répartition', 'Probabilité', 'Statut']],
      body: lignesLots,
      theme: 'striped',
      headStyles: { fillColor: [180, 30, 30], textColor: 255, fontSize: 10 },
      styles: { fontSize: 10, cellPadding: 3 },
    })

    // Zone signature
    const signY = doc.lastAutoTable.finalY + 20
    doc.setFontSize(11)
    doc.setTextColor(40, 40, 40)
    doc.text('Validation — L\'établissement confirme avoir pris connaissance de cette annexe :', 14, signY)
    doc.text('Signature :', 14, signY + 16)
    doc.line(40, signY + 16, 120, signY + 16)
    doc.text('Date :', 130, signY + 16)
    doc.line(148, signY + 16, 196, signY + 16)

    // Pied de page
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Document généré depuis le back-office PILOU — Brasserie du Comté', 14, 290)

    doc.save(`pilou-fiche-${lieu.nom.toLowerCase().replace(/\s+/g, '-')}.pdf`)
  }

  async function majLot(lotId, maj) {
    await supabase.from('lots').update(maj).eq('id', lotId)
    charger()
  }

  async function supprimerLot(lot) {
    if (!window.confirm(`Supprimer définitivement le lot « ${lot.nom} » ?\n` +
      `(Si des parties l'ont déjà été gagné, préfère "Désactiver".)`)) return
    const { error } = await supabase.from('lots').delete().eq('id', lot.id)
    if (error) {
      setMessageErreur('Suppression impossible : ce lot a déjà été gagné. Utilise "Désactiver".')
    }
    charger()
  }

  async function creerLot() {
    setErreurLot(null)
    const valeur = parseFloat(String(nl.valeur).replace(',', '.'))
    const stock = parseInt(nl.stock, 10)
    const seuil = parseInt(nl.seuil, 10)
    const pct = parseInt(nl.pct, 10)
    if (!nl.nom.trim()) { setErreurLot('Le nom du lot est requis.'); return }
    if ([valeur, stock, seuil, pct].some(Number.isNaN) || valeur < 0 || stock < 0 || seuil < 0 || pct < 1 || pct > 100) {
      setErreurLot('Vérifie les valeurs numériques (% entre 1 et 100).'); return
    }
    const { error } = await supabase.from('lots').insert({
      lieu_id: id,
      nom: nl.nom.trim(),
      description: nl.description.trim() || null,
      valeur_euros: valeur,
      stock_initial: stock,
      stock_restant: stock,
      seuil_alerte: seuil,
      poids: pct,
    })
    if (error) { setErreurLot('La création a échoué. Réessaie.'); return }
    setNl({ nom: '', description: '', valeur: '', stock: '', seuil: '5', pct: '50' })
    setFormLot(false)
    charger()
  }

  if (!lieu) {
    return (
      <main className="fond-papier flex min-h-screen items-center justify-center">
        <p className="text-pilou-encre opacity-60">{messageErreur ?? 'Chargement...'}</p>
      </main>
    )
  }

  const totalPoids = lots
    .filter((l) => l.actif && l.stock_restant > 0)
    .reduce((somme, l) => somme + l.poids, 0)

  const totalPct = lots
    .filter((l) => l.actif && l.stock_restant > 0)
    .reduce((somme, l) => somme + l.poids, 0)

  return (
    <main className="fond-papier min-h-screen px-6 py-8 text-pilou-encre">
      <div className="mx-auto max-w-3xl">
        <Link to="/admin" className="text-sm underline opacity-70 hover:opacity-100">
          ‹ Retour aux établissements
        </Link>

        <header className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="titre text-2xl font-bold text-pilou-rouge">
            {lieu.nom} <span className="text-base font-normal text-pilou-encre opacity-60">— {lieu.ville}</span>
          </h1>
          <div className="flex gap-2">
            <button type="button" onClick={exporterPDF}
              className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1.5 text-sm hover:bg-white">
              📄 Exporter PDF
            </button>
            <button type="button" onClick={basculerActifResto}
              className={`rounded border px-3 py-1.5 text-sm ${
                lieu.actif ? 'border-pilou-creme-fonce bg-white/70 hover:bg-white'
                : 'border-pilou-rouge bg-pilou-rouge text-pilou-creme'}`}>
              {lieu.actif ? 'Désactiver l\u2019établissement' : 'Réactiver l\u2019établissement'}
            </button>
            <button type="button" onClick={supprimerEtablissement}
              className="rounded border border-pilou-rouge px-3 py-1.5 text-sm text-pilou-rouge hover:bg-pilou-rouge hover:text-pilou-creme">
              🗑 Supprimer
            </button>
          </div>
        </header>
        {!lieu.actif && (
          <p className="mt-2 rounded bg-pilou-rouge px-4 py-2 text-sm text-pilou-creme">
            Établissement inactif : il n'apparaît plus dans le formulaire et personne ne peut y jouer.
          </p>
        )}

        {messageErreur && (
          <p className="mt-4 rounded bg-pilou-rouge px-4 py-2 text-sm text-pilou-creme">{messageErreur}</p>
        )}
        {messageSucces && (
          <p className="mt-4 rounded bg-green-600 px-4 py-2 text-sm text-white">{messageSucces}</p>
        )}

        {/* ── Stats du jour ── */}
        <div className="mt-4 flex items-center justify-between">
          <p className="titre text-sm font-bold opacity-70">Aujourd'hui</p>
          <button type="button" onClick={charger} title="Rafraîchir"
            className="rounded border border-pilou-creme-fonce bg-white/70 px-2 py-1 text-xs hover:bg-white">
            🔄 Rafraîchir
          </button>
        </div>
        <section className="mt-2 grid grid-cols-2 gap-4">
          <div className="rounded bg-white/70 p-4 text-center shadow-sm">
            <p className="titre text-3xl font-bold text-pilou-rouge">{stats.parties}</p>
            <p className="text-sm opacity-70">parties aujourd'hui</p>
          </div>
          <div className="rounded bg-white/70 p-4 text-center shadow-sm">
            <p className="titre text-3xl font-bold text-pilou-or">{stats.gagnants}</p>
            <p className="text-sm opacity-70">gagnants aujourd'hui</p>
          </div>
        </section>

        {/* ── Réglages ── */}
        <section className="mt-6 rounded bg-white/70 p-4 shadow-sm">
          <h2 className="titre font-bold">Informations de l'établissement</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs opacity-70">Nom de l'établissement *
              <input type="text" className={`${CHAMP} mt-1 w-full`} value={nomResto}
                onChange={(e) => setNomResto(e.target.value)} />
            </label>
            <label className="text-xs opacity-70">Ville *
              <input type="text" className={`${CHAMP} mt-1 w-full`} value={villeResto}
                onChange={(e) => setVilleResto(e.target.value)} />
            </label>
            <label className="text-xs opacity-70">Téléphone
              <input type="tel" className={`${CHAMP} mt-1 w-full`} value={telephoneResto}
                onChange={(e) => setTelephoneResto(e.target.value)} placeholder="06 12 34 56 78" />
            </label>
            <label className="text-xs opacity-70">Contact (nom du gérant)
              <input type="text" className={`${CHAMP} mt-1 w-full`} value={contactResto}
                onChange={(e) => setContactResto(e.target.value)} placeholder="Prénom Nom" />
            </label>
          </div>

          <h2 className="titre mt-5 font-bold">Réglages du jeu</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs opacity-70">Taux de gain (%)
              <input type="text" className={`${CHAMP} mt-1 w-full`} value={tauxPct}
                onChange={(e) => setTauxPct(e.target.value)} />
            </label>
            <label className="text-xs opacity-70">Email d'alerte stock
              <input type="email" className={`${CHAMP} mt-1 w-full`} value={emailContact}
                onChange={(e) => setEmailContact(e.target.value)} />
            </label>
          </div>

          <h2 className="titre mt-5 font-bold">Accès établissement</h2>
          <p className="text-xs opacity-60 mt-1">
            Code que le gérant saisit pour accéder à ses statistiques et gagnants.
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label className="text-xs opacity-70">Code d'accès
              <input type="text" className={`${CHAMP} mt-1 w-full`} value={codeAcces}
                onChange={(e) => setCodeAcces(e.target.value)} placeholder="ex: pilou2024" />
            </label>
            <div className="text-xs opacity-70 flex flex-col justify-end">
              <p>URL à communiquer au gérant :</p>
              <a
                href={`/etablissement/${lieu.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-mono text-pilou-rouge underline break-all"
              >
                /etablissement/{lieu.slug}
              </a>
            </div>
          </div>
          <button type="button" onClick={envoyerIdentifiants}
            className="titre mt-3 rounded border border-pilou-rouge px-4 py-2 text-sm font-bold text-pilou-rouge hover:bg-pilou-rouge hover:text-pilou-creme">
            📧 Envoyer les identifiants par mail
          </button>
          <p className="mt-1 text-xs opacity-50">Envoie l'URL et le code d'accès à l'email de l'établissement.</p>
          <button type="button" onClick={enregistrerReglages}
            className="titre mt-3 rounded bg-pilou-rouge px-4 py-2 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
            Enregistrer
          </button>
          <p className="mt-2 text-xs opacity-60">
            Le taux de gain s'applique immédiatement aux prochaines parties.
          </p>
        </section>

        {/* ── Lots ── */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="titre text-lg font-bold text-pilou-rouge">Lots</h2>
          <button type="button" onClick={() => setFormLot(!formLot)}
            className="titre rounded bg-pilou-rouge px-3 py-1.5 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
            {formLot ? 'Annuler' : '+ Ajouter un lot'}
          </button>
        </div>

        {formLot && (
          <section className="mt-3 rounded bg-white/70 p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={CHAMP} placeholder="Nom du lot *" value={nl.nom}
                onChange={(e) => setNl((v) => ({ ...v, nom: e.target.value }))} />
              <input className={CHAMP} placeholder="Valeur en € TTC * (ex: 5)" value={nl.valeur}
                onChange={(e) => setNl((v) => ({ ...v, valeur: e.target.value }))} />
              <input className={`${CHAMP} sm:col-span-2`} placeholder="Description (visible des joueurs)"
                value={nl.description}
                onChange={(e) => setNl((v) => ({ ...v, description: e.target.value }))} />
              <input className={CHAMP} placeholder="Stock initial *" value={nl.stock}
                onChange={(e) => setNl((v) => ({ ...v, stock: e.target.value }))} />
              <input className={CHAMP} placeholder="Alerte stock (reste X → mail BDC) (ex: 5)" value={nl.seuil}
                onChange={(e) => setNl((v) => ({ ...v, seuil: e.target.value }))} />
              <label className="text-xs opacity-70 sm:col-span-2">% répartition des gains (ex: 50 pour 50%)
                <input type="number" min="1" max="100" className={`${CHAMP} mt-1 w-full`} value={nl.pct}
                  onChange={(e) => setNl((v) => ({ ...v, pct: e.target.value }))} />
              </label>
            </div>
            {erreurLot && <p className="mt-2 text-sm text-pilou-rouge">{erreurLot}</p>}
            <button type="button" onClick={creerLot}
              className="titre mt-3 rounded bg-pilou-rouge px-4 py-2 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
              Créer le lot
            </button>
          </section>
        )}

        <section className="mt-3 rounded bg-white/70 p-4 shadow-sm">
          {lots.length === 0 && <p className="text-sm opacity-60">Aucun lot pour cet établissement.</p>}
          {lots.map((lot) => (
            <LigneLot key={lot.id} lot={lot} totalPoids={totalPoids}
              tauxDeGain={lieu.taux_de_gain} onMaj={majLot} onSupprimer={supprimerLot} />
          ))}
          {lots.length > 0 && (() => {
            const totalPct = lots
              .filter((l) => l.actif && l.stock_restant > 0)
              .reduce((s, l) => s + l.poids, 0)
            const ok = totalPct === 100
            return (
              <div className={`mt-4 border-t border-pilou-creme-fonce pt-3 flex items-center justify-between`}>
                <p className="text-xs opacity-60">
                  « 1 chance sur N » = probabilité réelle par partie jouée.
                </p>
                <p className={`text-sm font-bold ${ok ? 'text-green-600' : 'text-pilou-rouge'}`}>
                  Total répartition : {totalPct}% {ok ? '✓' : '≠ 100%'}
                </p>
              </div>
            )
          })()}
        </section>

        {/* ── Participants & gagnants de cet établissement ── */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-2">
          <h2 className="titre text-lg font-bold text-pilou-rouge">Participants & gagnants</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={filtreGagnantsLieu}
              onChange={(e) => setFiltreGagnantsLieu(e.target.checked)}
              className="accent-pilou-rouge" />
            Gagnants uniquement
          </label>
        </div>
        <section className="mt-3 overflow-x-auto rounded bg-white/70 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-pilou-rouge text-left text-pilou-creme">
                <th className="p-2">Date</th>
                <th className="p-2">Joueur</th>
                <th className="p-2">Résultat</th>
                <th className="p-2 text-center" title="Lot remis (slider barman)">Remis</th>
              </tr>
            </thead>
            <tbody>
              {partiesLieu
                .filter((p) => !filtreGagnantsLieu || p.resultat === 'gagne')
                .map((p) => (
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
                  <td className="p-2 text-center">
                    {p.resultat === 'gagne' && (p.retire
                      ? <span className="text-green-600 font-bold" title="Lot remis">✕</span>
                      : <span className="opacity-30">—</span>)}
                  </td>
                </tr>
              ))}
              {partiesLieu.filter((p) => !filtreGagnantsLieu || p.resultat === 'gagne').length === 0 && (
                <tr><td colSpan="4" className="p-4 text-center opacity-60">Aucune participation pour le moment.</td></tr>
              )}
            </tbody>
          </table>
        </section>
        <p className="mt-2 text-xs opacity-50">
          Les 100 dernières participations de cet établissement. Pour l'historique complet,
          les filtres par période et les exports, voir{' '}
          <Link to="/admin/joueurs" className="underline">Joueurs & Gagnants</Link>.
        </p>
      </div>
    </main>
  )
}
