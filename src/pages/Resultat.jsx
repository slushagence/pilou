import { useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LogoPilou from '../components/LogoPilou'
import PiecePilou from '../components/PiecePilou'
import SliderRetrait from '../components/SliderRetrait'
import SelecteurLangue from '../components/SelecteurLangue'
import enfant from '../assets/pilou/pilou-enfant.webp'
import logoBDC from '../assets/pilou/logo-bdc_blanc.png'

// Permet à l'établissement de personnaliser la mise en forme de son message :
// **texte** est mis en avant en text-pilou-or, un retour à la ligne (touche
// Entrée, ou l'ancien marqueur <br>) insère un saut de ligne. Jamais de HTML
// brut injecté (pas de dangerouslySetInnerHTML) — uniquement ces marqueurs
// précis, reconnus et rendus explicitement ci-dessous.
function texteAvecMiseEnAvant(texte) {
  return texte.split(/\n|<br>/).map((ligne, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {ligne.split(/\*\*(.+?)\*\*/g).map((morceau, j) =>
        j % 2 === 1
          ? <span key={j} className="text-pilou-or">{morceau}</span>
          : morceau
      )}
    </span>
  ))
}

export default function Resultat() {
  const { t, i18n } = useTranslation()
  const { state } = useLocation()
  const [retire, setRetire] = useState(false)
  if (!state?.reponse) return <Navigate to="/" replace />
  const { reponse, lieu } = state
  const gagne = reponse.resultat === 'gagne'

  // Message de retrait : version anglaise si dispo et langue EN, sinon
  // version française de l'établissement, sinon le texte générique traduit.
  const messageRetrait =
    (i18n.language === 'en' && lieu?.message_retrait_en?.trim()) ||
    lieu?.message_retrait ||
    t('resultat.message_defaut')

  // ── Écran "lot remis" : remplace l'écran gagnant après le slide du barman ──
  if (retire) {
    return (
      <main className="fond-rouge min-h-screen px-6 py-10 text-pilou-creme">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <SelecteurLangue sombre />
          <LogoPilou variante="blanc" hauteur={56} />

          <p className="mt-10 text-6xl animate-bounce">🍻</p>

          <h1 className="titre mt-4 text-4xl font-bold">
            {t('resultat.lot_remis_titre')}
            <span className="block text-pilou-or">{t('resultat.lot_remis_viva', { prenom: reponse.prenom })}</span>
          </h1>

          <p className="mt-6 titre text-lg font-bold">
            {t('resultat.lot_remis_texte')}
          </p>
          <p className="mt-2 text-sm opacity-80">
            {t('resultat.lot_remis_texte2')}
          </p>

          <div className="mt-8 w-full rounded bg-black/25 px-4 py-3 text-sm">
            <p className="titre font-bold opacity-90">{(i18n.language === 'en' && reponse.lot_en?.trim()) || reponse.lot}</p>
            <p className="opacity-80">{reponse.prenom} {reponse.nom}</p>
            <p className="opacity-80">{lieu?.nom} — {lieu?.ville}</p>
            <p className="opacity-60 text-xs mt-1">{t('resultat.code_remis', { code: reponse.code_retrait })}</p>
          </div>

          <img src={enfant} alt="" draggable="false" className="mt-6 w-48 opacity-95" />

          <Link to="/" className="mt-4 text-sm underline opacity-80 hover:opacity-100">
            {t('resultat.retour_accueil')}
          </Link>

          <img src={logoBDC} alt="Brasserie du Comté"
            className="mt-6 w-20 object-contain opacity-80"
            draggable="false" />

          <a
            href="https://www.lapilou.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-base font-bold text-pilou-creme uppercase underline hover:opacity-80 text-center block"
          >
            🍺 <i>{t('commun.lien_site_titre')}</i> 🍺<br/>{t('commun.lien_site_cta')}
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="fond-rouge min-h-screen px-6 py-10 text-pilou-creme">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <SelecteurLangue sombre />
        <LogoPilou variante="blanc" hauteur={56} />

        {gagne ? (
          <>
            <h1 className="titre mt-6 text-4xl font-bold">
              {t('resultat.gagne_titre', { prenom: reponse.prenom })}
              <span className="block text-pilou-or">{t('resultat.gagne_sous_titre')}</span>
            </h1>

            <div className="my-6">
              <PiecePilou face="gagne" taille={170} />
            </div>

            <p className="titre w-full rounded border-2 border-pilou-creme bg-pilou-creme/10 px-4 py-3 text-2xl font-bold">
              {(i18n.language === 'en' && reponse.lot_en?.trim()) || reponse.lot}
            </p>

            <p className="mt-6 titre text-lg font-bold leading-snug">
              {texteAvecMiseEnAvant(messageRetrait)}
            </p>

            <p className="mt-4 text-sm opacity-90">
              {t('resultat.code_retrait')}{' '}
              <span className="titre text-xl font-bold tracking-widest text-pilou-or">
                {reponse.code_retrait}
              </span>
            </p>
            <p className="mt-1 text-xs opacity-70">
              {/(visite|brasserie)/i.test(reponse.lot ?? '')
                ? t('resultat.piece_identite_visite')
                : t('resultat.piece_identite')}
            </p>

            {/* Slider barman : marque le lot comme remis */}
            <SliderRetrait codeRetrait={reponse.code_retrait} onRetire={() => setRetire(true)} />
          </>
        ) : (
          <>
            <h1 className="titre mt-6 text-4xl font-bold">
              {t('resultat.perdu_titre')}
              <span className="block text-pilou-or">{t('resultat.perdu_sous_titre')}</span>
            </h1>

            <div className="my-6">
              <PiecePilou face="perdu" taille={170} />
            </div>

            <p className="text-sm opacity-90">
              {t('resultat.perdu_texte')}
            </p>
          </>
        )}

        {/* Le récap qui sert de preuve au comptoir */}
        <div className="mt-8 w-full rounded bg-black/25 px-4 py-3 text-sm">
          <p className="titre font-bold opacity-90">
            {reponse.prenom} {reponse.nom}
          </p>
          <p className="opacity-80">{lieu?.nom} — {lieu?.ville}</p>
          <p className="opacity-80">{reponse.date_heure}</p>
        </div>

        <img src={enfant} alt="" draggable="false" className="mt-6 w-48 opacity-95" />

        <Link to="/" className="mt-4 text-sm underline opacity-80 hover:opacity-100">
          {t('resultat.retour_accueil')}
        </Link>

        <img src={logoBDC} alt="Brasserie du Comté"
          className="mt-6 w-20 object-contain opacity-80"
          draggable="false" />

        <a
          href="https://www.lapilou.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-base font-bold text-pilou-creme uppercase underline hover:opacity-80 text-center block"
        >
          🍺 <i>{t('commun.lien_site_titre')}</i> 🍺<br/>{t('commun.lien_site_cta')}
        </a>
      </div>
    </main>
  )
}
