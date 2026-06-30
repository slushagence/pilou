import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Formulaire from './pages/Formulaire'
import Jeu from './pages/Jeu'
import Resultat from './pages/Resultat'
import Lots from './pages/Lots'
import Reglement from './pages/Reglement'
import Admin from './pages/admin/Admin'
import Etablissements from './pages/Etablissements'
import EtablissementAcces from './pages/EtablissementAcces'

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
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/etablissement/:slug" element={<EtablissementAcces />} />
        <Route path="/etablissements" element={<Etablissements />} />
      </Routes>
    </BrowserRouter>
  )
}
