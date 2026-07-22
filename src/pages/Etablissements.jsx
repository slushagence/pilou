import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'
import SelecteurLangue from '../components/SelecteurLangue'

export default function Etablissements() {
  const { t, i18n } = useTranslation()
  const [lieux, setLieux] = useState(null)
  const [derniereMaj, setDerniereMaj] = useState(null)

  useEffect(() => {
    supabase
      .from('v_lieux')
      .select('id, nom, ville')
      .order('ville')
      .then(({ data }) => {
        setLieux(data ?? [])
        setDerniereMaj(new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR'))
      })
  }, [i18n.language])

  return (
    <main className="fond-papier min-h-screen px-6 py-10 text-pilou-encre">
      <div className="mx-auto max-w-md">
        <SelecteurLangue />
        <LogoPilou variante="couleur" hauteur={56} />

        <h1 className="titre mt-8 text-center text-2xl font-bold text-pilou-rouge">
          {t('etablissements.titre')}
        </h1>
        {derniereMaj && (
          <p className="mt-1 text-center text-xs opacity-50">
            {t('etablissements.derniere_maj', { date: derniereMaj })}
          </p>
        )}

        {lieux === null && (
          <p className="mt-8 text-center text-sm opacity-60">{t('etablissements.chargement')}</p>
        )}

        <ul className="mt-6 space-y-2">
          {lieux?.map((lieu) => (
            <li key={lieu.id}
              className="rounded border border-pilou-creme-fonce bg-white/70 px-4 py-3 text-sm">
              <p className="font-semibold">{lieu.nom}</p>
              <p className="opacity-60">{lieu.ville}</p>
            </li>
          ))}
        </ul>

        {lieux?.length === 0 && (
          <p className="mt-8 text-center text-sm opacity-60">
            {t('etablissements.aucun')}
          </p>
        )}

        <Link to="/" className="mt-8 block text-center text-sm underline opacity-60 hover:opacity-100">
          {t('etablissements.retour_accueil')}
        </Link>
      </div>
    </main>
  )
}
