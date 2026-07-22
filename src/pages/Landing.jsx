

import { Link } from 'react-router-dom'
import homeApp from '../assets/pilou/home_app.png'
import logoBDC from '../assets/pilou/logo-bdc.png'

export default function Landing() {
  return (
    <main className="fond-papier min-h-screen flex flex-col items-center px-6 py-10 text-pilou-encre">

      {/* Visuel principal */}
      <img
        src={homeApp}
        alt="La Pilou — Bière Pression — Gagne ton Pilou et plus !"
        className="w-full max-w-sm mix-blend-multiply"
        draggable="false"
      />
      {/* Bouton CTA */}
      <Link
        to="/jouer"
        className="titre mt-6 block w-full max-w-sm rounded py-4 text-center text-xl
                   font-bold text-white shadow-lg transition hover:opacity-90 uppercase tracking-wide
                   focus:outline-2 focus:outline-offset-2"
        style={{ backgroundColor: '#f39629' }}
      >
        Participer au jeu
      </Link>

      {/* Logo BDC */}
      <img
        src={logoBDC}
        alt="Brasserie du Comté"
        className="mt-8 w-28 object-contain mix-blend-multiply"
        draggable="false"
      />

      <p className="mt-4 text-xs opacity-60 text-center">
        Jeu réservé aux personnes majeures. L'abus d'alcool est dangereux pour la santé.
      </p>

      <a
        href="https://www.lapilou.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-base font-bold text-pilou-rouge uppercase underline hover:opacity-80 text-center block"
      >
        🍺 <i>Qu'es la Pilou ?</i> 🍺<br/>VISITEZ NOTRE SITE POUR EN SAVOIR PLUS !
      </a>
    </main>
  )
}
