import { useEffect, useState } from 'react'
import { useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'
import SelecteurLangue from '../components/SelecteurLangue'

export default function Lots() {
  const { t, i18n } = useTranslation()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [lots, setLots] = useState(null)

  const lieu = state?.lieu

  useEffect(() => {
    if (!lieu) return
    supabase
      .from('v_lots')
      .select('id, nom, nom_en, description, description_en, valeur_euros')
      .eq('lieu_id', lieu.id)
      .order('valeur_euros', { ascending: false })
      .then(({ data }) => setLots(data ?? []))
  }, [lieu])

  if (!lieu) return <Navigate to="/jouer" replace />

  return (
    <main className="fond-papier min-h-screen px-6 py-10 text-pilou-encre">
      <div className="mx-auto max-w-md">
        <SelecteurLangue />
        <LogoPilou variante="couleur" hauteur={56} />

        <h1 className="titre mt-8 text-center text-3xl font-bold">
          {t('lots.titre')}
        </h1>
        <p className="mt-2 text-center text-sm opacity-75">
          {lieu.nom} — {lieu.ville}
        </p>

        {lots === null && <p className="mt-8 text-center text-sm opacity-60">{t('lots.chargement')}</p>}

        {lots !== null && lots.length === 0 && (
          <p className="mt-8 text-center text-sm opacity-75">
            {t('lots.aucun_lot')}
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {lots?.map((lot) => (
            <li key={lot.id} className="rounded border border-pilou-creme-fonce bg-white/70 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="titre font-bold">{(i18n.language === 'en' && lot.nom_en?.trim()) || lot.nom}</p>
                <p className="shrink-0 text-sm font-semibold text-pilou-rouge">
                  {Number(lot.valeur_euros).toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              {(() => {
                const description = (i18n.language === 'en' && lot.description_en?.trim()) || lot.description
                return description && <p className="mt-1 text-sm opacity-75">{description}</p>
              })()}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="titre mt-8 w-full rounded bg-pilou-rouge py-3 text-lg font-bold text-pilou-creme
                     transition hover:bg-pilou-rouge-fonce"
        >
          {t('lots.retour_jeu')}
        </button>
      </div>
    </main>
  )
}
