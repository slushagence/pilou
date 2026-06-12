import pieceIconique from '../assets/pilou/piece-iconique.webp'
import pieceGagne from '../assets/pilou/piece-gagne.webp'
import piecePerdu from '../assets/pilou/piece-perdu.webp'

const FACES = {
  piece: pieceIconique,
  gagne: pieceGagne,
  perdu: piecePerdu,
}

// La pièce Pilou. face: "piece" (iconique) | "gagne" | "perdu".
// enRotation déclenche l'animation de lancer.
export default function PiecePilou({ face = 'piece', enRotation = false, taille = 220 }) {
  return (
    <div
      aria-hidden="true"
      className={enRotation ? 'piece-en-rotation' : ''}
      style={{ width: taille, height: taille, perspective: '800px' }}
    >
      <img
        src={FACES[face] ?? pieceIconique}
        alt=""
        width={taille}
        height={taille}
        draggable="false"
        style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))' }}
      />
    </div>
  )
}
