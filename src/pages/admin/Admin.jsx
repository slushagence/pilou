import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Login from './Login'
import Dashboard from './Dashboard'

// Porte d'entrée du back-office : affiche le login tant qu'aucune session
// Supabase Auth n'est active, puis le tableau de bord.
export default function Admin() {
  const [session, setSession] = useState(undefined) // undefined = en cours de vérification

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: ecouteur } = supabase.auth.onAuthStateChange((_evenement, s) => {
      setSession(s)
    })
    return () => ecouteur.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <main className="fond-papier flex min-h-screen items-center justify-center">
        <p className="text-pilou-encre opacity-60">Chargement...</p>
      </main>
    )
  }

  return session ? <Dashboard /> : <Login />
}
