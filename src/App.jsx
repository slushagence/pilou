import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Formulaire from './pages/Formulaire'
import Jeu from './pages/Jeu'
import Resultat from './pages/Resultat'
import Lots from './pages/Lots'
import Reglement from './pages/Reglement'
import Admin from './pages/admin/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/jouer" element={<Formulaire />} />
        <Route path="/jeu" element={<Jeu />} />
        <Route path="/resultat" element={<Resultat />} />
        <Route path="/lots" element={<Lots />} />
        <Route path="/reglement" element={<Reglement />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}