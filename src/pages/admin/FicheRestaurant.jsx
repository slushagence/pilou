import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../supabase'

// Fiche d'un établissement : édition de ses réglages (taux de gain, email
// d'alerte, actif) et gestion complète de ses lots, avec affichage des
// probabilités réelles calculées ("1 chance sur N") — les chiffres du règlement.

const CHAMP = 'rounded border border-pilou-creme-fonce bg-white px-3 py-2 text-sm'

function LigneLot({ lot, totalPoids, tauxDeGain, onMaj, onSupprimer }) {
  const [edition, setEdition] = useState(false)
  const [valeurs, setValeurs] = useState({})

  function ouvrirEdition() {
    setValeurs({
      nom: lot.nom,
      description: lot.description ?? '',
      valeur_euros: String(lot.valeur_euros),
      stock_restant: String(lot.stock_restant),
      stock_initial: String(lot.stock_initial),
      seuil_alerte: String(lot.seuil_alerte),
      poids: String(lot.poids),
    })
    setEdition(true)
  }

  async function enregistrer() {
    const maj = {
      nom: valeurs.nom.trim(),
      description: valeurs.description.trim() || null,
      valeur_euros: parseFloat(String(valeurs.valeur_euros).replace(',', '.')),
      stock_restant: parseInt(valeurs.stock_restant, 10),
      stock_initial: parseInt(valeurs.stock_initial, 10),
      seuil_alerte: parseInt(valeurs.seuil_alerte, 10),
      poids: parseInt(valeurs.poids, 10),
    }
    if (!maj.nom || Object.values(maj).some((v) => typeof v === 'number' && (Number.isNaN(v) || v < 0))) return
    if (maj.poids < 1) maj.poids = 1
    await onMaj(lot.id, maj)
    setEdition(false)
  }

  // Probabilité réelle de ce lot par partie jouée
  const disponible = lot.actif && lot.stock_restant > 0
  const proba = disponible && totalPoids > 0 ? tauxDeGain * (lot.poids / totalPoids) : 0
  const uneChanceSur = proba > 0 ? Math.round(1 / proba) : null

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
          <label className="text-xs opacity-70">Seuil d'alerte
            <input type="number" min="0" className={`${CHAMP} mt-1 w-full`} value={valeurs.seuil_alerte}
              onChange={(e) => setValeurs((v) => ({ ...v, seuil_alerte: e.target.value }))} />
          </label>
          <label className="text-xs opacity-70">Poids (part relative)
            <input type="number" min="1" className={`${CHAMP} mt-1 w-full`} value={valeurs.poids}
              onChange={(e) => setValeurs((v) => ({ ...v, poids: e.target.value }))} />
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
          seuil : {lot.seuil_alerte} · poids : {lot.poids}
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
  const [resto, setResto] = useState(null)
  const [lots, setLots] = useState([])
  const [messageErreur, setMessageErreur] = useState(null)

  // Édition des réglages de l'établissement
  const [tauxPct, setTauxPct] = useState('')
  const [emailContact, setEmailContact] = useState('')

  // Formulaire nouveau lot
  const [formLot, setFormLot] = useState(false)
  const [nl, setNl] = useState({ nom: '', description: '', valeur: '', stock: '', seuil: '5', poids: '10' })
  const [erreurLot, setErreurLot] = useState(null)

  async function charger() {
    const [r1, r2] = await Promise.all([
      supabase.from('restaurants').select('*').eq('id', id).single(),
      supabase.from('lots').select('*').eq('restaurant_id', id).order('created_at'),
    ])
    if (r1.error) { setMessageErreur("Établissement introuvable."); return }
    setResto(r1.data)
    setTauxPct(String(Math.round(r1.data.taux_de_gain * 100)))
    setEmailContact(r1.data.email_contact ?? '')
    setLots(r2.data ?? [])
  }

  useEffect(() => { charger() }, [id])

  async function enregistrerReglages() {
    const taux = parseFloat(String(tauxPct).replace(',', '.'))
    if (Number.isNaN(taux) || taux < 0 || taux > 100) {
      setMessageErreur('Le taux de gain doit être entre 0 et 100 %.'); return
    }
    setMessageErreur(null)
    await supabase.from('restaurants').update({
      taux_de_gain: taux / 100,
      email_contact: emailContact.trim() || null,
    }).eq('id', id)
    charger()
  }

  async function basculerActifResto() {
    await supabase.from('restaurants').update({ actif: !resto.actif }).eq('id', id)
    charger()
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
    const poids = parseInt(nl.poids, 10)
    if (!nl.nom.trim()) { setErreurLot('Le nom du lot est requis.'); return }
    if ([valeur, stock, seuil, poids].some(Number.isNaN) || valeur < 0 || stock < 0 || seuil < 0 || poids < 1) {
      setErreurLot('Vérifie les valeurs numériques (poids minimum : 1).'); return
    }
    const { error } = await supabase.from('lots').insert({
      restaurant_id: id,
      nom: nl.nom.trim(),
      description: nl.description.trim() || null,
      valeur_euros: valeur,
      stock_initial: stock,
      stock_restant: stock,
      seuil_alerte: seuil,
      poids,
    })
    if (error) { setErreurLot('La création a échoué. Réessaie.'); return }
    setNl({ nom: '', description: '', valeur: '', stock: '', seuil: '5', poids: '10' })
    setFormLot(false)
    charger()
  }

  if (!resto) {
    return (
      <main className="fond-papier flex min-h-screen items-center justify-center">
        <p className="text-pilou-encre opacity-60">{messageErreur ?? 'Chargement...'}</p>
      </main>
    )
  }

  const totalPoids = lots
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
            {resto.nom} <span className="text-base font-normal text-pilou-encre opacity-60">— {resto.ville}</span>
          </h1>
          <button type="button" onClick={basculerActifResto}
            className={`rounded border px-3 py-1.5 text-sm ${
              resto.actif ? 'border-pilou-creme-fonce bg-white/70 hover:bg-white'
              : 'border-pilou-rouge bg-pilou-rouge text-pilou-creme'}`}>
            {resto.actif ? 'Désactiver l\u2019établissement' : 'Réactiver l\u2019établissement'}
          </button>
        </header>
        {!resto.actif && (
          <p className="mt-2 rounded bg-pilou-rouge px-4 py-2 text-sm text-pilou-creme">
            Établissement inactif : il n'apparaît plus dans le formulaire et personne ne peut y jouer.
          </p>
        )}

        {messageErreur && (
          <p className="mt-4 rounded bg-pilou-rouge px-4 py-2 text-sm text-pilou-creme">{messageErreur}</p>
        )}

        {/* ── Réglages ── */}
        <section className="mt-6 rounded bg-white/70 p-4 shadow-sm">
          <h2 className="titre font-bold">Réglages du jeu</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs opacity-70">Taux de gain (%)
              <input type="text" className={`${CHAMP} mt-1 w-full`} value={tauxPct}
                onChange={(e) => setTauxPct(e.target.value)} />
            </label>
            <label className="text-xs opacity-70">Email d'alerte stock (facultatif)
              <input type="email" className={`${CHAMP} mt-1 w-full`} value={emailContact}
                onChange={(e) => setEmailContact(e.target.value)} />
            </label>
          </div>
          <button type="button" onClick={enregistrerReglages}
            className="titre mt-3 rounded bg-pilou-rouge px-4 py-2 text-sm font-bold text-pilou-creme hover:bg-pilou-rouge-fonce">
            Enregistrer les réglages
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
              <input className={CHAMP} placeholder="Seuil d'alerte (ex: 5)" value={nl.seuil}
                onChange={(e) => setNl((v) => ({ ...v, seuil: e.target.value }))} />
              <input className={CHAMP} placeholder="Poids (part relative, ex: 10)" value={nl.poids}
                onChange={(e) => setNl((v) => ({ ...v, poids: e.target.value }))} />
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
              tauxDeGain={resto.taux_de_gain} onMaj={majLot} onSupprimer={supprimerLot} />
          ))}
          {lots.length > 0 && (
            <p className="mt-4 border-t border-pilou-creme-fonce pt-3 text-xs opacity-60">
              « 1 chance sur N » = probabilité réelle par partie jouée (taux de gain × part du lot
              parmi les lots disponibles). Ce sont les chiffres à reporter dans le règlement du jeu.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
