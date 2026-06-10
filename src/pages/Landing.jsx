import { Link } from 'react-router-dom'
import PiecePilou from '../components/PiecePilou'

export default function Landing() {
  return (
    <main className="fond-papier min-h-screen flex flex-col items-center px-6 py-10 text-pilou-encre">
      {/* Logo (placeholder texte en attendant le PNG) */}
      <p className="titre text-3xl font-bold text-pilou-rouge">
        Pilou <span className="text-base align-top text-pilou-or">Nissa</span>
      </p>

      <div className="my-8">
        <PiecePilou taille={120} />
      </div>

      <h1 className="titre text-center text-5xl font-bold leading-tight">
        La <span className="text-pilou-rouge">Pilou</span>
        <span className="block text-2xl mt-1">Bière pression</span>
      </h1>

      <p className="titre mt-6 inline-block bg-pilou-rouge px-4 py-2 text-lg font-bold text-pilou-creme">
        Gagne ton Pilou... et plus !
      </p>

      <section className="mt-10 grid w-full max-w-md grid-cols-3 gap-4 text-center text-xs">
        <div>
          <p className="titre font-bold">Bière populaire accessible à tous</p>
          <p className="mt-1 opacity-75">Blonde, légère et conviviale.</p>
        </div>
        <div>
          <p className="titre font-bold">Un jeu 100% niçois légendaire</p>
          <p className="mt-1 opacity-75">Inspiré du célèbre jeu du Pilou.</p>
        </div>
        <div>
          <p className="titre font-bold">Disponible uniquement en fût</p>
          <p className="mt-1 opacity-75">La bière idéale pour les bars.</p>
        </div>
      </section>

      <Link
        to="/jouer"
        className="titre mt-12 block w-full max-w-md rounded bg-pilou-rouge py-4 text-center text-xl
                   font-bold text-pilou-creme shadow-lg transition hover:bg-pilou-rouge-fonce
                   focus:outline-2 focus:outline-offset-2 focus:outline-pilou-rouge"
      >
        Participer au jeu
      </Link>

      <p className="mt-4 text-xs opacity-60">
        Jeu réservé aux personnes majeures. L'abus d'alcool est dangereux pour la santé.
      </p>
    </main>
  )
}
