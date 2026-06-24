import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import LogoPilou from '../components/LogoPilou'

// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  dateDebut: '1er juin 2026',
  dateFin: '31 décembre 2026',
  urlJeu: 'https://www.lapilou.fr',
  produitsEligibles: ['Bière PILOU', 'Soft Brasserie du Comté'],
}
// ─────────────────────────────────────────────────────────────────────────────

// Encadré jaune pour tout ce qui attend une valeur définitive
function ACompleter({ children }) {
  return (
    <mark className="rounded bg-yellow-200 px-1 font-semibold text-pilou-encre">
      {children}
    </mark>
  )
}

function Titre({ children }) {
  return <h2 className="titre mt-10 mb-3 text-xl font-bold text-pilou-rouge">{children}</h2>
}

export default function Reglement() {
  const [lieux, setLieux] = useState([])
  const [lots, setLots] = useState([])

  useEffect(() => {
    supabase.from('v_lieux').select('nom, ville').order('nom')
      .then(({ data }) => setLieux(data ?? []))
    supabase.from('v_lots').select('nom, description, valeur_euros')
      .then(({ data }) => {
        // Afficher uniquement les lots BDC communs à tous les établissements
        const lotsBDC = ['Pièce Pilou', 'Visite Brasserie du Comté']
        const uniques = new Map()
        for (const lot of data ?? []) {
          const cle = `${lot.nom}|${lot.valeur_euros}`
          if (lotsBDC.includes(lot.nom) && !uniques.has(cle)) uniques.set(cle, lot)
        }
        setLots([...uniques.values()].sort((a, b) => b.valeur_euros - a.valeur_euros))
      })
  }, [])

  const euros = (v) =>
    Number(v).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  return (
    <main className="fond-papier min-h-screen px-6 py-10 text-pilou-encre">
      <div className="mx-auto max-w-2xl text-[15px] leading-relaxed">
        <LogoPilou variante="couleur" hauteur={56} />

        <h1 className="titre mt-8 text-center text-3xl font-bold leading-tight">
          Règlement du jeu
          <span className="block text-pilou-or">« Gagne ton Pilou… et plus ! »</span>
        </h1>

        <Titre>1. Organisateur du Jeu</Titre>
        <p>
          La société <strong>BRASSERIE DU COMTE</strong>, société par actions simplifiée au
          capital de 7 500,00 €, immatriculée au registre du commerce sous le numéro
          797 492 121 RCS Nice, dont le siège social est sis lieu-dit « Pra de la Majou »,
          Chemin de la Romegiero, 06450 Saint-Martin-Vésubie, représentée par son Président
          en exercice, Monsieur Edwards Dilly (ci-après « l'Organisateur »).
        </p>
        <p className="mt-2">
          Mail Service Consommateur :{' '}
          <a href="mailto:contact@brasserieducomte.fr" className="underline">
            contact@brasserieducomte.fr
          </a>
        </p>

        <Titre>2. Durée du Jeu</Titre>
        <p>
          Début : {CONFIG.dateDebut ?? <ACompleter>[date de début à définir]</ACompleter>}
          <br />
          Fin : {CONFIG.dateFin ?? <ACompleter>[date de fin à définir]</ACompleter>}
        </p>
        <p className="mt-2">
          L'Organisateur se réserve le droit de poursuivre le jeu au-delà de cette date et
          pourra le mettre en pause ou l'arrêter selon ses besoins d'organisation.
        </p>

        <Titre>3. Conditions de Participation</Titre>
        <p>
          <strong>Éligibilité :</strong> le Jeu est ouvert à toute personne physique majeure
          consommant un produit éligible de l'Organisateur dans l'un des établissements
          participants situés dans la zone de diffusion du Jeu, selon la liste des
          établissements participants figurant à l'article 4 du présent règlement, sous
          réserve du respect des conditions prévues au présent règlement.
        </p>
        <p className="mt-2">
          <strong>Exclusions :</strong> sont expressément exclus de toute participation au
          jeu les personnes mineures, ainsi que tous membres du personnel de l'Organisateur,
          ainsi que les membres du même foyer.
        </p>
        <p className="mt-2">
          <strong>Acceptation :</strong> le seul fait de participer à ce jeu implique
          l'acceptation pure et simple par le participant, sans réserve, du présent
          règlement.
        </p>
        <p className="mt-2">
          <strong>Délais de participation :</strong> la participation au jeu est limitée à
          UNE (1) participation par jour et par adresse e-mail. À ce titre, il est précisé
          qu'une même adresse e-mail ne pourra être utilisée qu'une seule fois par jour pour
          participer au Jeu, quel que soit le nombre de consommations éligibles réalisées,
          de supports de participation détenus ou d'établissements participants fréquentés
          au cours de la même journée.
        </p>
        <p className="mt-2">
          <strong>Vérification :</strong> l'Organisateur se réserve le droit de procéder à
          toutes vérifications concernant notamment l'identité, l'âge, les coordonnées des
          participants pour le respect du présent article comme de l'ensemble du Règlement,
          notamment pour écarter tout participant ayant commis un abus quelconque, sans
          toutefois qu'il ait l'obligation de procéder à une vérification systématique de
          l'ensemble des participants, pouvant limiter cette vérification aux gagnants.
        </p>

        <Titre>4. Modalités de Participation</Titre>
        <p>
          <strong>Consommation d'un produit éligible dans un établissement participant :</strong>{' '}
          pour participer, les participants doivent consommer des produits de l'Organisateur
          éligibles dans l'un des établissements participants afin qu'il leur soit remis un
          sous-bock, lequel constitue le support du Jeu présentant un QR code qu'il
          conviendra de scanner.
        </p>

        <p className="mt-2"><strong>Produits éligibles :</strong></p>
        <p>
          Sont considérés comme produits éligibles au Jeu les produits suivants de
          l'Organisateur : {CONFIG.produitsEligibles.join(', ')}
          {' '}<ACompleter>[autres produits éligibles à confirmer]</ACompleter>.
        </p>
        <p className="mt-2">
          L'Organisateur se réserve la possibilité de compléter ou modifier la liste des
          produits éligibles pendant la durée du Jeu, notamment pour tenir compte des
          produits effectivement distribués dans les établissements participants, sous
          réserve que cette modification soit portée à la connaissance des participants sur
          la page du Jeu ou par tout autre moyen approprié.
        </p>

        <p className="mt-2">
          <strong>Établissements participants :</strong>
        </p>
        {lieux.length > 0 ? (
          <ul className="mt-1 list-disc pl-6">
            {lieux.map((r, i) => (
              <li key={i}>{r.nom} — {r.ville}</li>
            ))}
          </ul>
        ) : (
          <p className="opacity-60">Chargement de la liste des établissements...</p>
        )}

        <p className="mt-2">
          <strong>Sous-bock :</strong> les sous-bocks Jeu contiennent un QR code permettant
          de participer. Le sous-bock ne constitue pas en lui-même un support gagnant.
        </p>

        <p className="mt-2">
          <strong>Participation en ligne :</strong> les participants doivent scanner le QR
          code à l'aide d'un appareil électronique compatible afin d'accéder à la page du
          jeu, hébergée à l'URL suivante :{' '}
          {CONFIG.urlJeu ?? <ACompleter>[URL définitive du jeu]</ACompleter>}, et renseigner
          leurs nom, prénom, adresse e-mail, numéro de téléphone portable et sélectionner le
          nom de l'établissement dans lequel la boisson a été consommée.
        </p>

        <p className="mt-2"><strong>Matériel nécessaire :</strong></p>
        <ul className="list-disc pl-6">
          <li>le sous-bock servi avec le produit éligible ;</li>
          <li>un smartphone ou tout appareil compatible avec la technologie QR code pour scanner le QR code ;</li>
          <li>un accès à Internet pour se connecter à la page du jeu.</li>
        </ul>

        <Titre>5. Désignation des Gagnants</Titre>
        <p>
          <strong>5.1. Principe de désignation des gagnants</strong>
        </p>
        <p>
          Le Jeu fonctionne selon un mécanisme de jeu à résultat instantané accessible en
          ligne via le QR code figurant sur le support promotionnel remis au participant
          dans un établissement participant selon les modalités visées à l'article 4.
        </p>
        <p className="mt-2">
          Après avoir, cumulativement : accédé à la page du Jeu, renseigné l'ensemble des
          informations obligatoires demandées, sélectionné l'établissement participant
          concerné, accepté le présent règlement et, le cas échéant, validé les cases de
          consentement proposées, le participant peut activer le mécanisme de jeu en
          cliquant sur le bouton « Faire tourner la pièce ».
        </p>
        <p className="mt-2">
          Le système de jeu affiche alors, de manière automatisée et aléatoire, une pièce
          virtuelle dont la face révélée à l'issue de la rotation indique si la
          participation est gagnante ou perdante. En cas de participation gagnante, le lot
          attribué est affiché à l'écran.
        </p>
        <p className="mt-2">
          La qualité de gagnant est déterminée immédiatement au moment de la participation,
          par le système informatique de gestion du Jeu, selon les paramètres de répartition
          des gains définis par l'Organisateur avant ou pendant la durée du Jeu, en fonction
          notamment des lots mis en jeu, des établissements participants et des
          disponibilités de dotation.
        </p>

        <p className="mt-4">
          <strong>5.2. Probabilités de gain</strong>
        </p>
        <p>
          Pour chaque participation valable, les probabilités d'obtention d'un résultat
          gagnant sont les suivantes, par lot :{' '}
          <ACompleter>
            [à compléter : « 1 chance sur N participations valables » pour chaque lot, selon
            les paramètres définitifs fixés par l'Organisateur]
          </ACompleter>
        </p>

        <p className="mt-4">
          <strong>5.3. Information des gagnants</strong>
        </p>
        <p>
          Le participant est immédiatement informé du résultat de sa participation par un
          message affiché à l'écran :
        </p>
        <ul className="list-disc pl-6">
          <li>soit qu'il n'a pas gagné ;</li>
          <li>
            soit un écran gagnant mentionnant le gain, le code de retrait, les nom et
            prénom du participant, la date, l'heure et le nom de l'établissement dans lequel
            il a participé.
          </li>
        </ul>
        <p className="mt-2">
          En cas de gain, un courriel de confirmation sera également adressé au gagnant,
          ainsi que, le cas échéant, à l'Organisateur et/ou à l'établissement participant
          concerné, afin de permettre la gestion et la remise du lot.
        </p>

        <p className="mt-4">
          <strong>5.4. Vérification et annulation</strong>
        </p>
        <p>
          L'Organisateur ne pourra en aucun cas être tenu responsable de tous cas où les
          participants auraient renseigné de mauvaises informations ou coordonnées empêchant
          la bonne information des gagnants.
        </p>
        <p className="mt-2">
          À cet égard, l'Organisateur se réserve le droit de procéder aux vérifications
          utiles relatives notamment à l'identité du participant, à ses coordonnées, à la
          limitation du nombre de participations autorisées, à la réalisation de la
          consommation dans l'établissement renseigné et, plus généralement, au respect du
          présent règlement.
        </p>
        <p className="mt-2">
          En cas d'irrégularité, de fraude, de tentative de fraude, de participation
          contraire au présent règlement ou d'anomalie technique ayant affecté la
          participation, l'Organisateur pourra annuler la participation litigieuse ou
          retirer le bénéfice du lot attribué, sans que le participant ne puisse prétendre à
          une quelconque indemnisation.
        </p>

        <Titre>6. Dotations</Titre>
        <p><strong>6.1. Description et valeurs des lots</strong></p>
        {lots.length > 0 ? (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-pilou-rouge text-pilou-creme">
                <th className="border border-pilou-creme-fonce p-2 text-left">Intitulé</th>
                <th className="border border-pilou-creme-fonce p-2 text-left">Description</th>
                <th className="border border-pilou-creme-fonce p-2 text-right">Valeur TTC*</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot, i) => (
                <tr key={i} className="bg-white/70">
                  <td className="border border-pilou-creme-fonce p-2 font-semibold">{lot.nom}</td>
                  <td className="border border-pilou-creme-fonce p-2">{lot.description}</td>
                  <td className="border border-pilou-creme-fonce p-2 text-right">{euros(lot.valeur_euros)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="opacity-60">Chargement des lots...</p>
        )}
        <p className="mt-2 text-sm">
          * La valeur des lots s'entend du prix en euros, toutes taxes comprises, fixé par
          l'Organisateur.
        </p>
        <p className="mt-2">
          Des lots complémentaires peuvent être proposés par certains établissements participants.
          La liste des lots disponibles pour chaque établissement est consultable directement
          sur la page de jeu, après sélection de l'établissement concerné.
        </p>
        <p className="mt-2">
          L'Organisateur se réserve le droit de modifier le contenu des lots au cours de la
          période à condition d'avoir une valorisation équivalente ou supérieure.
        </p>

        <p className="mt-4"><strong>6.2. Modalités de remise</strong></p>
        <p>
          Sauf mention contraire ci-dessous, les lots sont remis en mains propres au gagnant
          exclusivement auprès de l'établissement dans lequel il a participé.
        </p>
        <p className="mt-2">
          <strong>IMPORTANT :</strong> pour obtenir son lot, le gagnant devra impérativement
          se présenter <strong>le jour même de sa participation</strong> au Jeu et devra
          présenter à l'établissement dans lequel il a participé, pendant les horaires
          d'ouverture dudit établissement, le courriel de confirmation relatif au lot
          remporté ou l'écran gagnant. Le gagnant fera son affaire du déplacement jusqu'au
          lieu de remise des lots.
        </p>
        <p className="mt-2">
          Aux fins de récupération des lots, le gagnant, ou toute personne qu'il aura
          désignée, devra présenter une pièce d'identité (carte nationale d'identité,
          passeport, permis…), ainsi que, dans l'éventualité du retrait par un tiers, une
          procuration signée au nom du gagnant.
        </p>
        <p className="mt-2">
          Pour le lot « VISITE PRIVÉE », le gagnant sera contacté par l'Organisateur qui
          s'engage à prendre attache avec le gagnant dans les 15 jours à compter de la date
          du gain, afin de convenir d'une date de rendez-vous pour réaliser la visite. Le
          gagnant fera son affaire personnelle, ainsi que celle de ses accompagnants, du
          déplacement jusqu'au lieu de la visite, aucun frais de transport, d'hébergement,
          de restauration ou autre frais annexe n'étant pris en charge par l'Organisateur.
        </p>

        <p className="mt-4"><strong>6.3. Délais de remise</strong></p>
        <p>
          Sauf mention contraire, le gagnant doit retirer son lot{' '}
          <strong>LE JOUR MÊME de sa participation</strong>, avant la fermeture de
          l'établissement participant concerné.
        </p>
        <p className="mt-2">
          S'agissant du lot « VISITE PRIVÉE » : le gagnant disposera d'un délai de SIX (6)
          MOIS à compter de la date du gain pour réaliser ladite visite dans les conditions
          exposées ci-dessus.
        </p>
        <p className="mt-2">
          À défaut de respecter lesdits délais, le gagnant sera réputé avoir renoncé
          purement et simplement au lot.
        </p>

        <p className="mt-4"><strong>6.4. Renonciation</strong></p>
        <p>
          Dans l'hypothèse où le gagnant refuserait de prendre possession de tout ou partie
          du lot, pour quelque raison que ce soit, il perdra le bénéfice complet dudit lot
          et ne pourra prétendre à une quelconque indemnisation ou contrepartie.
        </p>

        <Titre>7. Protection des Données Personnelles</Titre>
        <p>
          <strong>Collecte des données :</strong> dans le cadre du Jeu, la société BRASSERIE
          DU COMTE, en qualité de responsable du traitement, collecte et traite les données
          personnelles des participants (nom, prénom, adresse e-mail, numéro de téléphone,
          établissement sélectionné) qui sont nécessaires pour la gestion du jeu.
        </p>
        <p className="mt-2">
          <strong>Utilisation des données :</strong> ces données seront utilisées
          exclusivement pour la gestion du jeu. Elles sont destinées à l'Organisateur et à
          ses prestataires techniques intervenant pour les besoins du jeu. Elles peuvent
          également être transmises à l'établissement participant concerné lorsque cette
          transmission est strictement nécessaire à la vérification du gain et à la remise
          du lot.
        </p>
        <p className="mt-2">
          Le participant peut, de manière facultative, consentir, lors de l'inscription, à
          recevoir les newsletters et offres promotionnelles de l'Organisateur en cochant la
          case « Je souhaite recevoir la newsletter de la Brasserie » visible avant le
          bouton « C'est parti ! ». Le cas échéant, le participant peut également consentir,
          par une case distincte, à ce que ses coordonnées soient transmises à
          l'établissement participant qu'il a sélectionné, afin de recevoir de sa part ses
          communications commerciales. Ce consentement est facultatif, distinct de la
          participation au Jeu et peut être retiré à tout moment auprès de l'établissement
          concerné.
        </p>
        <p className="mt-2">
          <strong>Conservation des données :</strong> les données collectées pour la gestion
          du Jeu sont conservées pendant la durée nécessaire à l'organisation du Jeu, à la
          remise des lots et à la gestion des réclamations, puis archivées pendant la durée
          nécessaire à la défense des droits de l'Organisateur.
        </p>
        <p className="mt-2">
          <strong>Droits des participants :</strong> conformément au RGPD, les participants
          disposent d'un droit d'accès, de rectification, de suppression et d'opposition sur
          leurs données personnelles. Pour exercer ces droits, ils peuvent contacter
          l'Organisateur à l'adresse e-mail suivante :{' '}
          <a href="mailto:contact@brasserieducomte.fr" className="underline">
            contact@brasserieducomte.fr
          </a>
        </p>
        <p className="mt-2">
          <strong>Opérations promotionnelles :</strong> du fait de l'acceptation de leur
          lot, les gagnants autorisent l'Organisateur à utiliser leurs nom et prénom, et ce
          à des fins promotionnelles sur tout support de son choix, pendant la durée du Jeu,
          sans que cette reproduction n'ouvre droit à une quelconque rémunération ou
          indemnisation autre que le prix gagné.
        </p>

        <Titre>8. Responsabilité</Titre>
        <p>
          <strong>Limitation de responsabilité :</strong> l'Organisateur ne saurait être
          tenu responsable pour tout préjudice trouvant son origine dans :
        </p>
        <ul className="list-disc pl-6">
          <li>
            toutes défaillances techniques ou informatiques liées à des problèmes de
            compatibilité relatifs au matériel et à la configuration informatique du
            participant ;
          </li>
          <li>
            toutes défaillances de l'accès ou du déroulement du jeu trouvant leur origine
            dans un événement extérieur à l'Organisateur ;
          </li>
          <li>tout préjudice trouvant son origine dans une intervention frauduleuse du participant ;</li>
          <li>
            toute indisponibilité du jeu trouvant son origine dans une défaillance du
            fournisseur réseau, de l'hébergeur des serveurs ou de tout acteur informatique
            permettant le bon fonctionnement du site, sur lequel l'Organisateur n'a aucun
            contrôle ;
          </li>
          <li>toutes informations erronées renseignées par les participants.</li>
        </ul>
        <p className="mt-2">
          <strong>Fraude :</strong> toute tentative de fraude entraînera l'annulation de la
          participation.
        </p>

        <Titre>9. Modification des Conditions</Titre>
        <p>
          L'Organisateur se réserve le droit de modifier, prolonger, écourter ou annuler le
          jeu à tout moment, sans préavis, en cas de force majeure ou de circonstances
          indépendantes de sa volonté.
        </p>

        <Titre>10. Consultation du Règlement</Titre>
        <p>
          Le présent Règlement est disponible et consultable en ligne pendant toute la durée
          du jeu, à l'URL suivante :{' '}
          {CONFIG.urlJeu ? (
            `${CONFIG.urlJeu}/reglement`
          ) : (
            <ACompleter>[URL définitive du jeu]/reglement</ACompleter>
          )}
        </p>

        <Titre>11. Litiges</Titre>
        <p>
          <strong>Résolution des conflits :</strong> toute contestation relative à
          l'interprétation ou à l'application du Règlement devra être formulée par lettre
          recommandée avec accusé de réception à l'adresse de l'Organisateur au plus tard
          dans les TRENTE (30) jours suivant la fin du Jeu, la date du cachet de la Poste
          faisant foi.
        </p>
        <p className="mt-2">
          L'Organisateur s'efforcera de répondre à toute réclamation dans un délai
          raisonnable à compter de sa réception.
        </p>
        <p className="mt-2">
          À défaut de résolution amiable, tout litige relatif au Jeu sera soumis au Tribunal
          Judiciaire de Nice.
        </p>

        <p className="mt-10 text-center text-xs opacity-60">
          L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
        </p>

        <div className="mt-8 text-center">
          <Link to="/jouer" className="titre inline-block rounded bg-pilou-rouge px-8 py-3
            text-lg font-bold text-pilou-creme transition hover:bg-pilou-rouge-fonce">
            Retour au jeu
          </Link>
        </div>
      </div>
    </main>
  )
}
