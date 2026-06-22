import { Link } from 'react-router-dom'
import LogoPilou from '../components/LogoPilou'
import heroBiere from '../assets/pilou/la-pilou-biere-pression.webp'
import pieceIconique from '../assets/pilou/piece-iconique-grande.jpg'
import logoBDC from '../assets/pilou/logo-bdc.png'

export default function Landing() {
  return (
    <main className="fond-papier min-h-screen flex flex-col items-center px-6 py-10 text-pilou-encre">

      {/* Logo Pilou Nissa */}
      <LogoPilou variante="couleur" hauteur={72} />

      {/* Grande pièce iconique */}
      <div className="mt-6 w-full max-w-xs">
        <img
          src={pieceIconique}
          alt="La pièce Pilou — Brasserie du Comté"
          className="w-full object-contain drop-shadow-xl"
          draggable="false"
        />
      </div>

      {/* Visuel titre LA PILOU BIÈRE PRESSION */}
      <img
        src={heroBiere}
        alt="La Pilou — Bière Pression"
        className="mt-4 w-full max-w-xs"
        draggable="false"
      />

      {/* Bandeau accroche */}
      <p className="titre mt-6 w-full max-w-md text-center bg-pilou-rouge px-4 py-3 text-xl font-bold text-pilou-creme tracking-wide uppercase shadow">
        Gagne ton Pilou... et plus !
      </p>

      {/* Logo BDC */}
      <img
        src={logoBDC}
        alt="Brasserie du Comté"
        className="mt-8 w-28 object-contain opacity-90"
        draggable="false"
      />

      {/* Bouton CTA */}
      <Link
        to="/jouer"
        className="titre mt-8 block w-full max-w-md rounded bg-pilou-rouge py-4 text-center text-xl
                   font-bold text-pilou-creme shadow-lg transition hover:bg-pilou-rouge-fonce uppercase tracking-wide
                   focus:outline-2 focus:outline-offset-2 focus:outline-pilou-rouge"
      >
        Participer au jeu
      </Link>

      <p className="mt-4 text-xs opacity-60 text-center">
        Jeu réservé aux personnes majeures. L'abus d'alcool est dangereux pour la santé.
      </p>

      <a
        href="https://www.lapilou.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-xs underline opacity-50 hover:opacity-80"
      >
        www.lapilou.fr
      </a>
    </main>
  )
}
