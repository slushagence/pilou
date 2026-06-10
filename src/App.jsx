import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Formulaire from './pages/Formulaire'
import Jeu from './pages/Jeu'
import Resultat from './pages/Resultat'
import Lots from './pages/Lots'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/jouer" element={<Formulaire />} />
        <Route path="/jeu" element={<Jeu />} />
        <Route path="/resultat" element={<Resultat />} />
        <Route path="/lots" element={<Lots />} />
      </Routes>
    </BrowserRouter>
  )
}
