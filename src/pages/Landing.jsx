import { Link } from 'react-router-dom'
import LogoPilou from '../components/LogoPilou'
import PiecePilou from '../components/PiecePilou'
import heroBiere from '../assets/pilou/la-pilou-biere-pression.webp'

export default function Landing() {
  return (
    <main className="fond-papier min-h-screen flex flex-col items-center px-6 py-10 text-pilou-encre">
      <LogoPilou variante="couleur" hauteur={64} />

      <div className="my-6">
        <PiecePilou taille={110} />
      </div>

      {/* Le visuel-titre officiel */}
      <img
        src={heroBiere}
        alt="La Pilou — bière pression"
        className="w-full max-w-xs"
        draggable="false"
      />

      <p className="titre mt-6 inline-block -rotate-1 bg-pilou-rouge px-4 py-2 text-lg font-bold text-pilou-creme shadow">
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
        className="titre mt-10 block w-full max-w-md rounded bg-pilou-rouge py-4 text-center text-xl
                   font-bold text-pilou-creme shadow-lg transition hover:bg-pilou-rouge-fonce
                   focus:outline-2 focus:outline-offset-2 focus:outline-pilou-rouge"
      >
        Participer au jeu
      </Link>

      <p className="mt-4 text-xs opacity-60 text-center">
        Jeu réservé aux personnes majeures. L'abus d'alcool est dangereux pour la santé.
      </p>
    </main>
  )
}
