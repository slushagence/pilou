import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from '../../supabase'
import Login from './Login'
import Dashboard from './Dashboard'
import FicheRestaurant from './FicheRestaurant'
import Joueurs from './Joueurs'

// Porte d'entrée du back-office : login si aucune session, sinon les pages admin.
export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: ecouteur } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => ecouteur.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <main className="fond-papier flex min-h-screen items-center justify-center">
        <p className="text-pilou-encre opacity-60">Chargement...</p>
      </main>
    )
  }

  if (!session) return <Login />

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="lieu/:id" element={<FicheRestaurant />} />
      <Route path="joueurs" element={<Joueurs />} />
    </Routes>
  )
}
