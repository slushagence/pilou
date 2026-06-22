import { useEffect, useState } from 'react'
import { useLocation, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'

export default function Lots() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [lots, setLots] = useState(null)

  const lieu = state?.lieu

  useEffect(() => {
    if (!lieu) return
    supabase
      .from('v_lots')
      .select('id, nom, description, valeur_euros')
      .eq('lieu_id', lieu.id)
      .order('valeur_euros', { ascending: false })
      .then(({ data }) => setLots(data ?? []))
  }, [lieu])

  if (!lieu) return <Navigate to="/jouer" replace />

  return (
    <main className="fond-papier min-h-screen px-6 py-10 text-pilou-encre">
      <div className="mx-auto max-w-md">
        <LogoPilou variante="couleur" hauteur={56} />

        <h1 className="titre mt-8 text-center text-3xl font-bold">
          Les lots à gagner
        </h1>
        <p className="mt-2 text-center text-sm opacity-75">
          {lieu.nom} — {lieu.ville}
        </p>

        {lots === null && <p className="mt-8 text-center text-sm opacity-60">Chargement...</p>}

        {lots !== null && lots.length === 0 && (
          <p className="mt-8 text-center text-sm opacity-75">
            Tous les lots de ce lieu ont été remportés... pour le moment !
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {lots?.map((lot) => (
            <li key={lot.id} className="rounded border border-pilou-creme-fonce bg-white/70 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="titre font-bold">{lot.nom}</p>
                <p className="shrink-0 text-sm font-semibold text-pilou-rouge">
                  {Number(lot.valeur_euros).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              {lot.description && <p className="mt-1 text-sm opacity-75">{lot.description}</p>}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="titre mt-8 w-full rounded bg-pilou-rouge py-3 text-lg font-bold text-pilou-creme
                     transition hover:bg-pilou-rouge-fonce"
        >
          Retour au jeu
        </button>
      </div>
    </main>
  )
}
