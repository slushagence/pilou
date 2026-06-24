import { useLocation, Navigate, Link } from 'react-router-dom'
import LogoPilou from '../components/LogoPilou'
import PiecePilou from '../components/PiecePilou'
import enfant from '../assets/pilou/pilou-enfant.webp'
import logoBDC from '../assets/pilou/logo-bdc_blanc.png'

export default function Resultat() {
  const { state } = useLocation()
  if (!state?.reponse) return <Navigate to="/" replace />
  const { reponse, lieu } = state
  const gagne = reponse.resultat === 'gagne'

  return (
    <main className="fond-rouge min-h-screen px-6 py-10 text-pilou-creme">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <LogoPilou variante="blanc" hauteur={56} />

        {gagne ? (
          <>
            <h1 className="titre mt-6 text-4xl font-bold">
              Bravo {reponse.prenom} !
              <span className="block text-pilou-or">Tu as gagné</span>
            </h1>

            <div className="my-6">
              <PiecePilou face="gagne" taille={170} />
            </div>

            <p className="titre w-full rounded border-2 border-pilou-creme bg-pilou-creme/10 px-4 py-3 text-2xl font-bold">
              {reponse.lot}
            </p>

            <p className="mt-6 titre text-lg font-bold leading-snug">
              Présente ce résultat au bar
              <span className="block text-pilou-or">aujourd'hui, avant la fermeture</span>
              <span className="block">pour remporter ton gain</span>
            </p>

            <p className="mt-4 text-sm opacity-90">
              Code de retrait :{' '}
              <span className="titre text-xl font-bold tracking-widest text-pilou-or">
                {reponse.code_retrait}
              </span>
            </p>
            <p className="mt-1 text-xs opacity-70">
              Tu vas aussi recevoir un email avec ton bon de retrait.
              Une pièce d'identité pourra t'être demandée.
            </p>
          </>
        ) : (
          <>
            <h1 className="titre mt-6 text-4xl font-bold">
              Perdu...
              <span className="block text-pilou-or">ce sera pour la prochaine fois !</span>
            </h1>

            <div className="my-6">
              <PiecePilou face="perdu" taille={170} />
            </div>

            <p className="text-sm opacity-90">
              La pièce n'est pas tombée du bon côté cette fois-ci.
              Reviens tenter ta chance demain !
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
          Retour à l'accueil
        </Link>

        <img src={logoBDC} alt="Brasserie du Comté"
          className="mt-6 w-20 object-contain opacity-80"
          draggable="false" />

        <a
          href="https://www.lapilou.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm font-semibold text-pilou-creme underline hover:opacity-80"
        >
          <><i>Qu'es la Pilou ?</i> Visitez notre site pour en savoir plus !</>
        </a>
      </div>
    </main>
  )
}
