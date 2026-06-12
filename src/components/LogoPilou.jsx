import logoCouleur from '../assets/pilou/logo-pilou.png'
import logoBlanc from '../assets/pilou/logo-pilou-blanc.png'

// Le logo Pilou Nissa. variante "couleur" sur fond clair, "blanc" sur fond rouge.
export default function LogoPilou({ variante = 'couleur', hauteur = 56 }) {
  return (
    <img
      src={variante === 'blanc' ? logoBlanc : logoCouleur}
      alt="Pilou Nissa"
      style={{ height: hauteur, width: 'auto' }}
      className="mx-auto"
    />
  )
}
