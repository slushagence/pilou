import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../supabase'

// Tableau de bord Brasserie — session 1 :
//   • compteurs du jour (parties, gagnants)
//   • stocks par établissement, réajustables, lots activables/désactivables
//   • dernières alertes stock
// La création/édition des lots et établissements viendra dans une session suivante.

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([])
  const [lots, setLots] = useState([])
  const [alertes, setAlertes] = useState([])
  const [statsJour, setStatsJour] = useState({ parties: 0, gagnants: 0 })
  const [chargement, setChargement] = useState(true)
  const [messageErreur, setMessageErreur] = useState(null)
  // Saisies de réajustement en cours : { [lotId]: valeur }
  const [saisies, setSaisies] = useState({})

  const jourParis = useMemo(() => {
    // La date "métier" du jeu est le jour calendaire à Paris
    return new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date())
  }, [])

  async function chargerTout() {
    setMessageErreur(null)
    const [r1, r2, r3, r4, r5] = await Promise.all([
      supabase.from('restaurants').select('id, nom, ville, taux_de_gain, actif').order('nom'),
      supabase.from('lots').select('*').order('nom'),
      supabase.from('alertes_stock').select('*').order('created_at', { ascending: false }).limit(8),
      supabase.from('parties').select('id', { count: 'exact', head: true }).eq('jour', jourParis),
      supabase.from('parties').select('id', { count: 'exact', head: true })
        .eq('jour', jourParis).eq('resultat', 'gagne'),
    ])
    if (r1.error || r2.error) {
      setMessageErreur(
        "Impossible de charger les données. Vérifie que les tables sont exposées dans " +
        "Settings → Data API → Exposed tables (restaurants, lots, parties, alertes_stock)."
      )
    } else {
      setRestaurants(r1.data ?? [])
      setLots(r2.data ?? [])
      setAlertes(r3.data ?? [])
      setStatsJour({ parties: r4.count ?? 0, gagnants: r5.count ?? 0 })
    }
    setChargement(false)
  }

  useEffect(() => { chargerTout() }, [])

  async function reajusterStock(lot) {
    const valeur = parseInt(saisies[lot.id], 10)
    if (Number.isNaN(valeur) || valeur < 0) return
    const { error } = await supabase.from('lots')
      .update({ stock_restant: valeur }).eq('id', lot.id)
    if (!error) {
      setSaisies((s) => ({ ...s, [lot.id]: '' }))
      chargerTout()
    }
  }

  async function basculerActif(lot) {
    const { error } = await supabase.from('lots')
      .update({ actif: !lot.actif }).eq('id', lot.id)
    if (!error) chargerTout()
  }

  async function seDeconnecter() {
    await supabase.auth.signOut()
  }

  const dateAlerte = (iso) =>
    new Date(iso).toLocaleString('fr-FR', {
      dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris',
    })

  return (
    <main className="fond-papier min-h-screen px-6 py-8 text-pilou-encre">
      <div className="mx-auto max-w-3xl">
        {/* ── En-tête ── */}
        <header className="flex items-center justify-between">
          <div>
            <p className="titre text-xl font-bold text-pilou-rouge">
              Pilou <span className="text-xs align-top text-pilou-or">Nissa</span>
            </p>
            <h1 className="titre text-sm font-bold opacity-70">Back-office Brasserie</h1>
          </div>
          <button
            type="button"
            onClick={seDeconnecter}
            className="rounded border border-pilou-creme-fonce bg-white/70 px-3 py-1.5 text-sm
                       hover:bg-white"
          >
            Se déconnecter
          </button>
        </header>

        {messageErreur && (
          <p className="mt-6 rounded bg-pilou-rouge px-4 py-3 text-sm text-pilou-creme">
            {messageErreur}
          </p>
        )}
        {chargement && <p className="mt-6 text-sm opacity-60">Chargement...</p>}

        {/* ── Compteurs du jour ── */}
        <section className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded bg-white/70 p-4 text-center shadow-sm">
            <p className="titre text-3xl font-bold text-pilou-rouge">{statsJour.parties}</p>
            <p className="text-sm opacity-70">parties aujourd'hui</p>
          </div>
          <div className="rounded bg-white/70 p-4 text-center shadow-sm">
            <p className="titre text-3xl font-bold text-pilou-or">{statsJour.gagnants}</p>
            <p className="text-sm opacity-70">gagnants aujourd'hui</p>
          </div>
        </section>

        {/* ── Stocks par établissement ── */}
        <h2 className="titre mt-10 text-lg font-bold text-pilou-rouge">Stocks par établissement</h2>
        {restaurants.map((resto) => {
          const lotsDuResto = lots.filter((l) => l.restaurant_id === resto.id)
          return (
            <section key={resto.id} className="mt-4 rounded bg-white/70 p-4 shadow-sm">
              <div className="flex items-baseline justify-between">
                <h3 className="titre font-bold">
                  {resto.nom} <span className="font-normal opacity-60">— {resto.ville}</span>
                </h3>
                <p className="text-xs opacity-60">
                  Taux de gain : {Math.round(resto.taux_de_gain * 100)}%
                </p>
              </div>

              {lotsDuResto.length === 0 && (
                <p className="mt-2 text-sm opacity-60">Aucun lot configuré.</p>
              )}

              {lotsDuResto.map((lot) => {
                const epuise = lot.stock_restant === 0
                const sousSeuil = lot.stock_restant <= lot.seuil_alerte
                return (
                  <div
                    key={lot.id}
                    className="mt-3 flex flex-wrap items-center gap-3 border-t
                               border-pilou-creme-fonce pt-3 text-sm"
                  >
                    <div className="min-w-40 flex-1">
                      <p className={`font-semibold ${lot.actif ? '' : 'line-through opacity-50'}`}>
                        {lot.nom}
                      </p>
                      <p className="text-xs opacity-60">
                        seuil d'alerte : {lot.seuil_alerte} · poids : {lot.poids}
                      </p>
                    </div>

                    <p
                      className={`titre w-24 text-center font-bold ${
                        epuise ? 'text-pilou-rouge' : sousSeuil ? 'text-pilou-or' : ''
                      }`}
                    >
                      {lot.stock_restant} / {lot.stock_initial}
                      {epuise && <span className="block text-[10px]">ÉPUISÉ</span>}
                      {!epuise && sousSeuil && <span className="block text-[10px]">STOCK BAS</span>}
                    </p>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        placeholder="Nouveau"
                        className="w-20 rounded border border-pilou-creme-fonce bg-white px-2
                                   py-1 text-center"
                        value={saisies[lot.id] ?? ''}
                        onChange={(e) =>
                          setSaisies((s) => ({ ...s, [lot.id]: e.target.value }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => reajusterStock(lot)}
                        className="rounded bg-pilou-rouge px-2 py-1 text-xs font-bold
                                   text-pilou-creme hover:bg-pilou-rouge-fonce"
                      >
                        OK
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => basculerActif(lot)}
                      className={`rounded border px-2 py-1 text-xs ${
                        lot.actif
                          ? 'border-pilou-creme-fonce bg-white hover:bg-pilou-creme'
                          : 'border-pilou-rouge bg-pilou-rouge text-pilou-creme'
                      }`}
                    >
                      {lot.actif ? 'Désactiver' : 'Réactiver'}
                    </button>
                  </div>
                )
              })}
            </section>
          )
        })}

        {/* ── Alertes récentes ── */}
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

        <p className="mt-10 text-center text-xs opacity-50">
          Prochaines évolutions : création/édition des lots et des établissements,
          historique des parties, export des contacts newsletter.
        </p>
      </div>
    </main>
  )
}
