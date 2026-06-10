// La pièce Pilou — placeholder graphique en attendant le visuel définitif.
// Quand Marc fournira le PNG de la vraie pièce, il suffira de remplacer
// le contenu du <div> par <img src={piece} ... /> sans toucher au reste.

export default function PiecePilou({ enRotation = false, taille = 220 }) {
  return (
    <div
      aria-hidden="true"
      className={enRotation ? 'piece-en-rotation' : ''}
      style={{ width: taille, height: taille, perspective: '800px' }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* Tranche de la pièce */}
        <circle cx="100" cy="100" r="96" fill="#8d8d8d" />
        <circle cx="100" cy="100" r="92" fill="#c4c2bc" />
        {/* Anneau gravé */}
        <circle
          cx="100" cy="100" r="80"
          fill="none" stroke="#8d8d8d" strokeWidth="2" strokeDasharray="3 4"
        />
        {/* Le trou central, signature du vrai pilou */}
        <circle cx="100" cy="100" r="16" fill="#f2e8d5" stroke="#8d8d8d" strokeWidth="3" />
        {/* Inscriptions */}
        <text
          x="100" y="62" textAnchor="middle"
          fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="15"
          fill="#5d5b56" letterSpacing="2"
        >
          BRASSERIE
        </text>
        <text
          x="100" y="152" textAnchor="middle"
          fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="26"
          fill="#5d5b56" letterSpacing="3"
        >
          PILOU
        </text>
        <text
          x="100" y="170" textAnchor="middle"
          fontFamily="Oswald, sans-serif" fontWeight="500" fontSize="11"
          fill="#787671" letterSpacing="4"
        >
          NISSA
        </text>
      </svg>
    </div>
  )
}
