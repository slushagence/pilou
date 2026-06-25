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
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Pilou Nissa', email: EMAIL_EXPEDITEUR },
      to: [{ email: destinataire }],
      subject: sujet,
      htmlContent: html,
      textContent: sujet,
    }),
  })
  if (!reponse.ok) console.error('Erreur Brevo', reponse.status, await reponse.text())
  return reponse.ok
}

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
  } catch { return null }
}

function estLotVisiteBrasserie(nomLot) {
  const n = (nomLot ?? '').toLowerCase()
  return n.includes('visite') || n.includes('brasserie') || n.includes('boutique')
}

function emailGagnant(partie, lieu) {
  const date = new Date(partie.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })
  const nomLieu = lieu ? `${lieu.nom} — ${lieu.ville}` : 'ton lieu'
  const baseUrl = 'https://ojkvliarxbhoknlliriv.supabase.co/storage/v1/object/public/pilou-assets'
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#a32018;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#a32018;min-height:100vh;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">

        <!-- Logo Pilou -->
        <tr><td align="center" style="padding-bottom:24px;">
          <img src="${baseUrl}/logo-pilou-blanc.png" alt="Pilou Nissa" height="60" style="display:block;">
        </td></tr>

        <!-- Titre -->
        <tr><td align="center" style="padding-bottom:8px;">
          <p style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
            BRAVO<br>${partie.prenom.toUpperCase()} !
          </p>
          <p style="margin:8px 0 0;color:#e3a72f;font-size:24px;font-weight:bold;text-transform:uppercase;">
            TU AS GAGNÉ
          </p>
        </td></tr>

        <!-- Pièce gagnée -->
        <tr><td align="center" style="padding:24px 0;">
          <img src="${baseUrl}/piece-gagne.webp" alt="Gagné" width="160" style="display:block;margin:0 auto;">
        </td></tr>

        <!-- Nom du lot -->
        <tr><td align="center" style="padding-bottom:24px;">
          <table cellpadding="0" cellspacing="0" style="border:2px solid #ffffff;border-radius:4px;">
            <tr><td style="padding:12px 32px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;text-align:center;">
                ${partie.lot_nom}
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Instructions -->
        <tr><td align="center" style="padding-bottom:16px;">
          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:bold;text-transform:uppercase;line-height:1.8;">
            PRÉSENTE CE RÉSULTAT AU BAR<br>
            <span style="color:#e3a72f;">AUJOURD'HUI, AVANT LA FERMETURE</span><br>
            POUR REMPORTER TON GAIN
          </p>
        </td></tr>

        <!-- Code de retrait -->
        <tr><td align="center" style="padding-bottom:8px;">
          <p style="margin:0;color:#ffffff;font-size:13px;">Code de retrait :
            <span style="color:#e3a72f;font-size:22px;font-weight:bold;letter-spacing:4px;"> ${partie.code_retrait}</span>
          </p>
        </td></tr>

        <!-- Mention pièce identité -->
        <tr><td align="center" style="padding-bottom:24px;">
          <p style="margin:0;color:#ffffff;font-size:12px;opacity:0.8;text-align:center;max-width:320px;margin:0 auto;">
            Tu vas aussi recevoir un email avec ton bon de retrait. Une pièce d'identité pourra t'être demandée.
          </p>
        </td></tr>

        <!-- Récap joueur -->
        <tr><td style="padding-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#7d1812;border-radius:4px;">
            <tr><td align="center" style="padding:16px;">
              <p style="margin:0;color:#ffffff;font-size:14px;font-weight:bold;text-transform:uppercase;">
                ${partie.prenom.toUpperCase()} ${partie.nom.toUpperCase()}
              </p>
              <p style="margin:4px 0 0;color:#ffffff;font-size:13px;opacity:0.8;">${nomLieu}</p>
              <p style="margin:4px 0 0;color:#ffffff;font-size:13px;opacity:0.8;">${date}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Enfant -->
        <tr><td align="center" style="padding-bottom:24px;">
          <img src="${baseUrl}/pilou-enfant.webp" alt="" width="120" style="display:block;margin:0 auto;">
        </td></tr>

        <!-- Logo BDC -->
        <tr><td align="center" style="padding-bottom:16px;">
          <img src="${baseUrl}/logo-bdc_blanc.png" alt="Brasserie du Comté" width="80" style="display:block;margin:0 auto;">
        </td></tr>

        <!-- Lien lapilou.fr -->
        <tr><td align="center" style="padding-bottom:32px;">
          <p style="margin:0 0 4px;color:#ffffff;font-size:14px;font-weight:bold;">
            🍺 <em>Qu'es la Pilou ?</em> 🍺
          </p>
          <a href="https://www.lapilou.fr" style="color:#ffffff;font-size:13px;font-weight:bold;text-transform:uppercase;text-decoration:underline;">
            VISITEZ NOTRE SITE POUR EN SAVOIR PLUS !
          </a>
        </td></tr>

        <!-- Mention légale -->
        <tr><td align="center">
          <p style="margin:0;color:#ffffff;font-size:11px;opacity:0.6;">
            L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function emailNotifEtablissement(partie, lieu) {
  const date = new Date(partie.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })
  const nomLieu = lieu ? `${lieu.nom} — ${lieu.ville}` : '—'
  return `
  <div style="font-family:Arial,sans-serif;color:${ENCRE};max-width:480px">
    <h2 style="color:${ROUGE};margin:0 0 16px">🪙 Nouveau gagnant — Jeu Pilou</h2>
    <p><strong>Lot :</strong> ${partie.lot_nom}</p>
    <p><strong>Code de retrait :</strong> <span style="font-size:20px;font-weight:bold;letter-spacing:4px">${partie.code_retrait}</span></p>
    <p><strong>Gagnant :</strong> ${partie.prenom} ${partie.nom}</p>
    <p><strong>Email :</strong> ${partie.email}</p>
    <p><strong>Téléphone :</strong> ${partie.telephone ?? '—'}</p>
    <p><strong>Établissement :</strong> ${nomLieu}</p>
    <p><strong>Date :</strong> ${date}</p>
    <p style="font-size:13px;color:#777">Le gagnant va se présenter au bar aujourd'hui avec son écran ou cet email. Vérifiez le code, la date et l'établissement avant de remettre le lot.</p>
  </div>`
}

function emailVisiteBrasserie(partie, lieu) {
  const date = new Date(partie.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })
  const nomLieu = lieu ? `${lieu.nom} — ${lieu.ville}` : '—'
  return `
  <div style="font-family:Arial,sans-serif;color:${ENCRE};max-width:480px">
    <h2 style="color:${ROUGE};margin:0 0 16px">🏭 Lot Visite Brasserie gagné — Pilou</h2>
    <p><strong>Lot :</strong> ${partie.lot_nom}</p>
    <p><strong>Code de retrait :</strong> <span style="font-size:20px;font-weight:bold;letter-spacing:4px">${partie.code_retrait}</span></p>
    <p><strong>Gagnant :</strong> ${partie.prenom} ${partie.nom}</p>
    <p><strong>Email :</strong> ${partie.email}</p>
    <p><strong>Téléphone :</strong> ${partie.telephone ?? '—'}</p>
    <p><strong>Établissement :</strong> ${nomLieu}</p>
    <p><strong>Date :</strong> ${date}</p>
    <p style="font-size:13px;color:#777">À contacter personnellement pour organiser la visite.</p>
  </div>`
}

function emailAlerte(alerte) {
  const rupture = alerte.type === 'rupture'
  return `
  <div style="font-family:Arial,sans-serif;color:${ENCRE};max-width:480px">
    <h2 style="color:${ROUGE};margin:0 0 16px">${rupture ? '🔴 Rupture de stock' : '🟠 Stock bas'} — Jeu Pilou</h2>
    <p><strong>${alerte.lot_nom}</strong><br>${alerte.lieu_nom}</p>
    <p>Stock restant : <strong>${alerte.stock_restant}</strong> (seuil : ${alerte.seuil_alerte})</p>
    <p style="font-size:13px;color:#777">${rupture ? 'Ce lot ne peut plus être gagné. Pensez à réapprovisionner.' : 'Pensez à prévoir le réapprovisionnement.'}</p>
  </div>`
}

Deno.serve(async (req) => {
  // CORS pour les appels depuis le navigateur
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
      },
    })
  }

  const payload = await req.json()

  // ── Identifiants établissement (appelé depuis l'admin, pas de secret requis)
  if (payload.type === 'identifiants') {
    const { email, nom, ville, slug, code_acces } = payload
    const baseUrl = Deno.env.get('APP_URL') ?? 'https://pilou-roan.vercel.app'
    const url = `${baseUrl}/etablissement/${slug}`
    const html = `
    <div style="font-family:Arial,sans-serif;color:#2b1e16;max-width:480px">
      <h2 style="color:#a32018;margin:0 0 16px">🪙 Accès à votre espace PILOU</h2>
      <p>Bonjour,</p>
      <p>Voici vos identifiants pour accéder à votre espace établissement <strong>${nom} — ${ville}</strong> :</p>
      <p><strong>URL :</strong><br><a href="${url}" style="color:#a32018">${url}</a></p>
      <p style="margin:16px 0 4px"><strong>Code d'accès :</strong></p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px;color:#2b1e16">${code_acces}</p>
      <p style="font-size:13px;color:#777">En cas de problème, contactez-nous à <a href="mailto:${EMAIL_BRASSERIE}" style="color:#a32018">${EMAIL_BRASSERIE}</a>.</p>
    </div>`
    const ok = await envoyerEmail(email, `🪙 Vos accès PILOU — ${nom}`, html)
    return new Response(JSON.stringify({ ok }), {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  // ── Vérification du webhook secret pour tous les autres cas
  if (req.headers.get('x-pilou-secret') !== WEBHOOK_SECRET) {
    return new Response('non autorisé', { status: 401 })
  }

  // ── Cas 1 : un joueur vient de gagner (INSERT)
  if (payload.table === 'parties' && payload.type === 'INSERT') {
    const partie = payload.record
    if (partie.resultat === 'gagne' && partie.code_retrait) {
      const lieu = await infoLieu(partie.lieu_id)

      await envoyerEmail(
        partie.email,
        `🪙 Bravo ${partie.prenom}, tu as gagné : ${partie.lot_nom} !`,
        emailGagnant(partie, lieu),
      )

      if (lieu?.email_contact) {
        await envoyerEmail(
          lieu.email_contact,
          `🪙 Nouveau gagnant Pilou — ${partie.lot_nom} (code : ${partie.code_retrait})`,
          emailNotifEtablissement(partie, lieu),
        )
      }

      if (estLotVisiteBrasserie(partie.lot_nom)) {
        await envoyerEmail(
          EMAIL_BOUTIQUE,
          `🏭 Lot Visite Brasserie gagné — ${partie.prenom} ${partie.nom}`,
          emailVisiteBrasserie(partie, lieu),
        )
      }
    }
  }

  // ── Cas 2 : alerte de stock
  if (payload.table === 'alertes_stock' && payload.type === 'INSERT') {
    const alerte = payload.record
    const sujet = `${alerte.type === 'rupture' ? 'Rupture' : 'Stock bas'} : ${alerte.lot_nom} (${alerte.lieu_nom})`
    const html = emailAlerte(alerte)
    await envoyerEmail(EMAIL_BRASSERIE, sujet, html)
    const lieu = await infoLieu(alerte.lieu_id)
    if (lieu?.email_contact) await envoyerEmail(lieu.email_contact, sujet, html)
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } })
})
