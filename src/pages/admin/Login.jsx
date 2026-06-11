import { useState } from 'react'
import { supabase } from '../../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function seConnecter() {
    setErreur(null)
    setEnCours(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: motDePasse,
    })
    setEnCours(false)
    if (error) {
      setErreur('Identifiants incorrects. Vérifie l\u2019email et le mot de passe.')
    }
    // Si la connexion réussit, Admin.jsx bascule automatiquement sur le Dashboard
  }

  return (
    <main className="fond-rouge flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-lg bg-pilou-creme p-8 shadow-2xl">
        <p className="titre text-center text-2xl font-bold text-pilou-rouge">
          Pilou <span className="text-sm align-top text-pilou-or">Nissa</span>
        </p>
        <h1 className="titre mt-2 text-center text-lg font-bold text-pilou-encre">
          Back-office Brasserie du Comte
        </h1>

        <label htmlFor="email" className="titre mt-8 block text-sm font-bold text-pilou-encre">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="mt-1 w-full rounded border border-pilou-creme-fonce bg-white px-3 py-2.5
                     text-pilou-encre focus:outline-2 focus:outline-pilou-rouge"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        <label htmlFor="motdepasse" className="titre mt-4 block text-sm font-bold text-pilou-encre">
          Mot de passe
        </label>
        <input
          id="motdepasse"
          type="password"
          className="mt-1 w-full rounded border border-pilou-creme-fonce bg-white px-3 py-2.5
                     text-pilou-encre focus:outline-2 focus:outline-pilou-rouge"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && seConnecter()}
          autoComplete="current-password"
        />

        {erreur && <p className="mt-3 text-sm text-pilou-rouge">{erreur}</p>}

        <button
          type="button"
          onClick={seConnecter}
          disabled={enCours}
          className="titre mt-6 w-full rounded bg-pilou-rouge py-3 text-lg font-bold
                     text-pilou-creme transition hover:bg-pilou-rouge-fonce disabled:opacity-60"
        >
          {enCours ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </main>
  )
}
