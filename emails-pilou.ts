// ============================================================================
// PILOU — Edge Function "emails-pilou"
// Reçoit les webhooks de la base de données et envoie les emails via Brevo :
//   1. parties passe à "gagne"  → bon de retrait au joueur
//                               → notification à l'établissement
//                               → si lot "Visite Brasserie" → boutique@brasserieducomte.fr
//   2. insertion dans alertes_stock → alerte à la Brasserie + l'établissement
//
// Secrets à configurer dans Supabase (Edge Functions → Secrets) :
//   BREVO_API_KEY    : la clé API créée dans Brevo
//   EMAIL_EXPEDITEUR : l'adresse expéditrice validée dans Brevo
//   EMAIL_BRASSERIE  : le destinataire des alertes stock
//   EMAIL_BOUTIQUE   : boutique@brasserieducomte.fr (lots visite brasserie)
//   WEBHOOK_SECRET   : une chaîne aléatoire partagée avec les webhooks
// ============================================================================

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const EMAIL_EXPEDITEUR = Deno.env.get('EMAIL_EXPEDITEUR')
const EMAIL_BRASSERIE = Deno.env.get('EMAIL_BRASSERIE')
const EMAIL_BOUTIQUE = Deno.env.get('EMAIL_BOUTIQUE') ?? 'boutique@brasserieducomte.fr'
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')

const ROUGE = '#a32018'
const CREME = '#f2e8d5'
const ENCRE = '#2b1e16'

async function envoyerEmail(destinataire, sujet, html) {
  if (!destinataire) return false
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

// Retrouve le lieu complet (nom, ville, email_contact)
async function infoLieu(lieuId) {
  try {
    const url = `${Deno.env.get('SUPABASE_URL')}/rest/v1/lieux?id=eq.${lieuId}&select=nom,ville,email_contact`
    const reponse = await fetch(url, {
      headers: {
        apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
    })
    const lignes = await reponse.json()
    return lignes?.[0] ?? null
  } catch {
    return null
  }
}

// Détecte si le lot est lié à une visite brasserie
function estLotVisiteBrasserie(nomLot) {
  const n = (nomLot ?? '').toLowerCase()
  return n.includes('visite') || n.includes('brasserie') || n.includes('boutique')
}

function emailGagnant(partie, lieu) {
  const date = new Date(partie.created_at).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  })
  const nomLieu = lieu ? `${lieu.nom} — ${lieu.ville}` : 'ton lieu'
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
          ${nomLieu}<br>
          ${date}
        </p>
      </div>
      <div style="background:${CREME};padding:12px;text-align:center;font-size:11px;color:#999">
        L'abus d'alcool est dangereux pour la santé. À consommer avec modération.<br><a href='https://www.lapilou.fr' style='color:#999'>www.lapilou.fr</a>
      </div>
    </div>
  </div>`
}

function emailNotifEtablissement(partie, lieu) {
  const date = new Date(partie.created_at).toLocaleString('fr-FR', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris',
  })
  const nomLieu = lieu ? `${lieu.nom} — ${lieu.ville}` : '—'
  return `
  <div style="font-family:Arial,sans-serif;color:${ENCRE};max-width:480px">
    <h2 style="color:${ROUGE};margin:0 0 16px">🪙 Nouveau gagnant — Jeu Pilou</h2>
    <p style="margin:0 0 4px"><strong>Lot :</strong> ${partie.lot_nom}</p>
    <p style="margin:0 0 4px"><strong>Code de retrait :</strong>
      <span style="font-size:20px;font-weight:bold;letter-spacing:4px"> ${partie.code_retrait}</span>
    </p>
    <p style="margin:0 0 4px"><strong>Gagnant :</strong> ${partie.prenom} ${partie.nom}</p>
    <p style="margin:0 0 4px"><strong>Email :</strong> ${partie.email}</p>
    <p style="margin:0 0 4px"><strong>Téléphone :</strong> ${partie.telephone ?? '—'}</p>
    <p style="margin:0 0 4px"><strong>Établissement :</strong> ${nomLieu}</p>
    <p style="margin:0 0 16px"><strong>Date :</strong> ${date}</p>
    <p style="margin:0;font-size:13px;color:#777">
      Le gagnant va se présenter au bar aujourd'hui avec son écran ou cet email.
      Vérifiez le code, la date et l'établissement avant de remettre le lot.
    </p>
  </div>`
}

function emailVisiteBrasserie(partie, lieu) {
  const date = new Date(partie.created_at).toLocaleString('fr-FR', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris',
  })
  const nomLieu = lieu ? `${lieu.nom} — ${lieu.ville}` : '—'
  return `
  <div style="font-family:Arial,sans-serif;color:${ENCRE};max-width:480px">
    <h2 style="color:${ROUGE};margin:0 0 16px">🏭 Lot Visite Brasserie gagné — Pilou</h2>
    <p style="margin:0 0 4px"><strong>Lot :</strong> ${partie.lot_nom}</p>
    <p style="margin:0 0 4px"><strong>Code de retrait :</strong>
      <span style="font-size:20px;font-weight:bold;letter-spacing:4px"> ${partie.code_retrait}</span>
    </p>
    <p style="margin:0 0 4px"><strong>Gagnant :</strong> ${partie.prenom} ${partie.nom}</p>
    <p style="margin:0 0 4px"><strong>Email :</strong> ${partie.email}</p>
    <p style="margin:0 0 4px"><strong>Téléphone :</strong> ${partie.telephone ?? '—'}</p>
    <p style="margin:0 0 4px"><strong>Établissement :</strong> ${nomLieu}</p>
    <p style="margin:0 0 16px"><strong>Date :</strong> ${date}</p>
    <p style="margin:0;font-size:13px;color:#777">
      À contacter personnellement pour organiser la visite.
    </p>
  </div>`
}

function emailAlerte(alerte, emailEtablissement) {
  const rupture = alerte.type === 'rupture'
  return `
  <div style="font-family:Arial,sans-serif;color:${ENCRE};max-width:480px">
    <h2 style="color:${ROUGE};margin:0 0 16px">
      ${rupture ? '🔴 Rupture de stock' : '🟠 Stock bas'} — Jeu Pilou
    </h2>
    <p style="margin:0 0 8px">
      <strong>${alerte.lot_nom}</strong><br>
      ${alerte.lieu_nom}
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
  if (req.headers.get('x-pilou-secret') !== WEBHOOK_SECRET) {
    return new Response('non autorisé', { status: 401 })
  }

  const payload = await req.json()

  // ── Cas 1 : un joueur vient de gagner
  if (payload.table === 'parties' && payload.type === 'UPDATE') {
    const partie = payload.record
    const avant = payload.old_record
    if (partie.resultat === 'gagne' && avant?.resultat !== 'gagne' && partie.code_retrait) {
      const lieu = await infoLieu(partie.lieu_id)

      // 1a. Mail au joueur
      await envoyerEmail(
        partie.email,
        `🪙 Bravo ${partie.prenom}, tu as gagné : ${partie.lot_nom} !`,
        emailGagnant(partie, lieu),
      )

      // 1b. Notification à l'établissement
      if (lieu?.email_contact) {
        await envoyerEmail(
          lieu.email_contact,
          `🪙 Nouveau gagnant Pilou — ${partie.lot_nom} (code : ${partie.code_retrait})`,
          emailNotifEtablissement(partie, lieu),
        )
      }

      // 1c. Si lot "Visite Brasserie" → boutique@brasserieducomte.fr
      if (estLotVisiteBrasserie(partie.lot_nom)) {
        await envoyerEmail(
          EMAIL_BOUTIQUE,
          `🏭 Lot Visite Brasserie gagné — ${partie.prenom} ${partie.nom}`,
          emailVisiteBrasserie(partie, lieu),
        )
      }
    }
  }

  // ── Cas 2 : alerte de stock → BDC + établissement
  if (payload.table === 'alertes_stock' && payload.type === 'INSERT') {
    const alerte = payload.record
    const sujet = `${alerte.type === 'rupture' ? 'Rupture' : 'Stock bas'} : ${alerte.lot_nom} (${alerte.lieu_nom})`
    const html = emailAlerte(alerte)

    // BDC
    await envoyerEmail(EMAIL_BRASSERIE, sujet, html)

    // Établissement concerné
    const lieu = await infoLieu(alerte.lieu_id)
    if (lieu?.email_contact) {
      await envoyerEmail(lieu.email_contact, sujet, html)
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  })
})
