import { useLocation, Navigate, Link } from 'react-router-dom'
import PiecePilou from '../components/PiecePilou'

export default function Resultat() {
  const { state } = useLocation()
  if (!state?.reponse) return <Navigate to="/" replace />
  const { reponse, restaurant } = state
  const gagne = reponse.resultat === 'gagne'

  return (
    <main className="fond-rouge min-h-screen px-6 py-10 text-pilou-creme">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <p className="titre text-2xl font-bold">
          Pilou <span className="text-sm align-top text-pilou-or">Nissa</span>
        </p>

        {gagne ? (
          <>
            <h1 className="titre mt-8 text-4xl font-bold">
              Bravo {reponse.prenom} !
              <span className="block text-pilou-or">Tu as gagné</span>
            </h1>

            <div className="my-8">
              <PiecePilou taille={150} />
            </div>

            <p className="titre w-full rounded border-2 border-pilou-creme bg-pilou-creme/10 px-4 py-3 text-2xl font-bold">
              {reponse.lot}
            </p>

            <p className="mt-6 titre text-lg font-bold leading-snug">
              Présente ce résultat au bar
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
            </p>
          </>
        ) : (
          <>
            <h1 className="titre mt-8 text-4xl font-bold">
              Perdu...
              <span className="block text-pilou-or">ce sera pour la prochaine fois !</span>
            </h1>

            <div className="my-8 opacity-80">
              <PiecePilou taille={150} />
            </div>

            <p className="text-sm opacity-90">
              La pièce n'est pas tombée du bon côté cette fois-ci.
              Reviens tenter ta chance demain !
            </p>
          </>
        )}

        {/* Le récap qui sert de preuve au comptoir */}
        <div className="mt-8 w-full rounded bg-black/20 px-4 py-3 text-sm">
          <p className="titre font-bold opacity-90">
            {reponse.prenom} {reponse.nom}
          </p>
          <p className="opacity-80">{reponse.restaurant}</p>
          <p className="opacity-80">{reponse.date_heure}</p>
        </div>

        <Link to="/" className="mt-8 text-sm underline opacity-80 hover:opacity-100">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}
