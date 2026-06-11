// ============================================================================
// PILOU — Edge Function "emails-pilou"
// Reçoit les webhooks de la base de données et envoie les emails via Brevo :
//   1. parties passe à "gagne"  → bon de retrait au joueur
//   2. insertion dans alertes_stock → alerte à la Brasserie
//
// Secrets à configurer dans Supabase (Edge Functions → Secrets) :
//   BREVO_API_KEY    : la clé API créée dans Brevo
//   EMAIL_EXPEDITEUR : l'adresse expéditrice validée dans Brevo
//   EMAIL_BRASSERIE  : le destinataire des alertes stock
//   WEBHOOK_SECRET   : une chaîne aléatoire partagée avec les webhooks
// ============================================================================

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const EMAIL_EXPEDITEUR = Deno.env.get('EMAIL_EXPEDITEUR')
const EMAIL_BRASSERIE = Deno.env.get('EMAIL_BRASSERIE')
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')

// Petites aides visuelles aux couleurs Pilou
const ROUGE = '#a32018'
const CREME = '#f2e8d5'
const ENCRE = '#2b1e16'

async function envoyerEmail(destinataire, sujet, html) {
  const reponse = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Pilou Nissa', email: EMAIL_EXPEDITEUR },
      to: [{ email: destinataire }],
      subject: sujet,
      htmlContent: html,
    }),
  })
  if (!reponse.ok) {
    console.error('Erreur Brevo', reponse.status, await reponse.text())
  }
  return reponse.ok
}

// Retrouve le nom du restaurant via la vue publique (pour le bon de retrait)
async function nomRestaurant(restaurantId) {
  try {
    const url = `${Deno.env.get('SUPABASE_URL')}/rest/v1/v_restaurants?id=eq.${restaurantId}&select=nom,ville`
    const reponse = await fetch(url, {
      headers: {
        apikey: Deno.env.get('SUPABASE_ANON_KEY'),
        authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
    })
    const lignes = await reponse.json()
    return lignes?.[0] ? `${lignes[0].nom} — ${lignes[0].ville}` : 'ton établissement'
  } catch {
    return 'ton établissement'
  }
}

function emailGagnant(partie, restaurant) {
  const date = new Date(partie.created_at).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  })
  return `
  <div style="background:${CREME};padding:32px 16px;font-family:Arial,sans-serif;color:${ENCRE}">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
      <div style="background:${ROUGE};padding:24px;text-align:center">
        <h1 style="margin:0;color:${CREME};font-size:26px;letter-spacing:1px">
          BRAVO ${partie.prenom.toUpperCase()} !
        </h1>
        <p style="margin:8px 0 0;color:#e3a72f;font-size:18px;font-weight:bold">TU AS GAGNÉ</p>
      </div>
      <div style="padding:24px;text-align:center">
        <p style="font-size:22px;font-weight:bold;margin:0 0 16px;color:${ROUGE}">
          ${partie.lot_nom}
        </p>
        <p style="margin:0 0 8px">
          Présente cet email (ou l'écran du jeu) au bar
          <strong>aujourd'hui, avant la fermeture</strong>, pour remporter ton gain.
        </p>
        <p style="margin:0 0 8px;font-size:13px;color:#777">
          Une pièce d'identité pourra t'être demandée (article 6 du règlement du jeu).
        </p>
        <p style="margin:16px 0 4px;font-size:13px;color:#777">Ton code de retrait</p>
        <p style="margin:0;font-size:28px;font-weight:bold;letter-spacing:6px;color:${ENCRE}">
          ${partie.code_retrait}
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="margin:0;font-size:13px;color:#777">
          ${partie.prenom} ${partie.nom}<br>
          ${restaurant}<br>
          ${date}
        </p>
      </div>
      <div style="background:${CREME};padding:12px;text-align:center;font-size:11px;color:#999">
        L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
      </div>
    </div>
  </div>`
}

function emailAlerte(alerte) {
  const rupture = alerte.type === 'rupture'
  return `
  <div style="font-family:Arial,sans-serif;color:${ENCRE};max-width:480px">
    <h2 style="color:${ROUGE};margin:0 0 16px">
      ${rupture ? '🔴 Rupture de stock' : '🟠 Stock bas'} — Jeu Pilou
    </h2>
    <p style="margin:0 0 8px">
      <strong>${alerte.lot_nom}</strong><br>
      ${alerte.restaurant_nom}
    </p>
    <p style="margin:0 0 16px">
      Stock restant : <strong>${alerte.stock_restant}</strong>
      (seuil d'alerte : ${alerte.seuil_alerte})
    </p>
    <p style="margin:0;font-size:13px;color:#777">
      ${rupture
        ? 'Ce lot ne peut plus être gagné. Pensez à réapprovisionner puis à remettre le stock à jour dans le back-office.'
        : 'Pensez à prévoir le réapprovisionnement de ce lot.'}
    </p>
  </div>`
}

Deno.serve(async (req) => {
  // Vérifie que l'appel vient bien de nos webhooks
  if (req.headers.get('x-pilou-secret') !== WEBHOOK_SECRET) {
    return new Response('non autorisé', { status: 401 })
  }

  const payload = await req.json()

  // ── Cas 1 : un joueur vient de gagner (la partie passe de "perdu" à "gagne")
  if (payload.table === 'parties' && payload.type === 'UPDATE') {
    const partie = payload.record
    const avant = payload.old_record
    if (partie.resultat === 'gagne' && avant?.resultat !== 'gagne' && partie.code_retrait) {
      const restaurant = await nomRestaurant(partie.restaurant_id)
      await envoyerEmail(
        partie.email,
        `🪙 Bravo ${partie.prenom}, tu as gagné : ${partie.lot_nom} !`,
        emailGagnant(partie, restaurant),
      )
    }
  }

  // ── Cas 2 : alerte de stock pour la Brasserie
  if (payload.table === 'alertes_stock' && payload.type === 'INSERT') {
    const alerte = payload.record
    await envoyerEmail(
      EMAIL_BRASSERIE,
      `${alerte.type === 'rupture' ? 'Rupture' : 'Stock bas'} : ${alerte.lot_nom} (${alerte.restaurant_nom})`,
      emailAlerte(alerte),
    )
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  })
})
