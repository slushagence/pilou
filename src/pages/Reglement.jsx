import { Link } from 'react-router-dom'
import LogoPilou from '../components/LogoPilou'

// ─────────────────────────────────────────────────────────────────────────────
// Règlement conforme à la version du Cabinet Palazzetti du 10/07/2026
// (BDC - Règlement du Jeu 260710)
// ─────────────────────────────────────────────────────────────────────────────

function Titre({ children }) {
  return <h2 className="titre mt-10 mb-3 text-xl font-bold text-pilou-rouge">{children}</h2>
}

function SousTitre({ children }) {
  return <h3 className="titre mt-6 mb-2 font-bold underline">{children}</h3>
}

export default function Reglement() {
  return (
    <main className="fond-papier min-h-screen px-6 py-10 text-pilou-encre">
      <div className="mx-auto max-w-2xl text-sm leading-relaxed">
        <div className="text-center">
          <LogoPilou variante="couleur" hauteur={56} />
        </div>

        <h1 className="titre mt-8 text-center text-3xl font-bold leading-tight">
          Règlement du jeu
          <span className="block text-pilou-rouge">« Gagne ton Pilou… ou plus ! »</span>
        </h1>

        {/* ── 1. Organisateur ── */}
        <Titre>1. Organisateur du Jeu</Titre>
        <p>
          La société BRASSERIE DU COMTE, société par actions simplifiée au capital de
          7.500,00 €, immatriculée au registre du commerce sous le numéro 797 492 121
          RCS Nice, dont le siège social est sis lieu-dit « Pra de la Majou », Chemin de
          la Romegiero, 06 450 Saint Martin Vésubie, représentée par son Président en
          exercice, Monsieur Edwards Dilly (Ci-après « L'Organisateur »)
        </p>
        <p className="mt-2">
          <strong>Mail Service Consommateur :</strong>{' '}
          <a href="mailto:pilou@brasserieducomte.fr" className="underline">pilou@brasserieducomte.fr</a>
        </p>

        {/* ── 2. Durée ── */}
        <Titre>2. Durée du Jeu</Titre>
        <p><strong>Début :</strong> 01/06/2026</p>
        <p><strong>Fin :</strong> 31/12/2026</p>
        <p className="mt-2">
          L'Organisateur se réserve le droit de poursuivre le jeu au-delà du 31/12/2026
          et pourra le mettre en pause ou l'arrêter selon ses besoins d'organisation.
        </p>
        <p className="mt-2">
          La participation au Jeu dans chaque établissement participant est toutefois
          limitée à la période pendant laquelle l'établissement concerné participe
          effectivement à l'opération.
        </p>
        <p className="mt-2">
          Les périodes de participations propres à chaque établissement participant sont
          indiquées sur la page dédiée à la liste des établissements participants,
          accessible via le lien dédié indiqué ci-après dans le présent règlement, avant
          le lancement du mécanisme de Jeu.
        </p>
        <p className="mt-2">
          L'Organisateur se réserve la possibilité d'ajouter ou de retirer des
          établissements participants au cours de la durée du Jeu, ou de modifier la
          période de participation, sous réserve que cette information soit portée à la
          connaissance du participant par tout moyen approprié, notamment par mise à
          jour de la page dédiée aux établissements participants.
        </p>

        {/* ── 3. Conditions de participation ── */}
        <Titre>3. Conditions de Participation</Titre>

        <SousTitre>3.1. Éligibilité</SousTitre>
        <p>
          Le Jeu est ouvert à toute personne physique majeure, résidant ou se trouvant
          en France, participant à l'occasion de la consommation d'un produit éligible
          de l'Organisateur dans l'un des établissements participants au Jeu, dont la
          liste est accessible via le lien indiqué à l'article 4.3, sous réserve du
          respect de l'ensemble des conditions prévues au présent règlement.
        </p>

        <SousTitre>3.2. Exclusions</SousTitre>
        <p>
          Sont expressément exclues de toute participation au jeu les personnes
          mineures, ainsi que tous membres du personnel de l'Organisateur, ainsi que les
          membres du même foyer.
        </p>

        <SousTitre>3.3. Acceptation</SousTitre>
        <p>
          Le seul fait de participer à ce jeu implique l'acceptation pure et simple par
          le participant, sans réserve, du présent règlement.
        </p>

        <SousTitre>3.4. Délais de participation</SousTitre>
        <p>
          La participation au jeu est limitée à UNE (1) participation par jour et par
          adresse électronique.
        </p>
        <p className="mt-2">
          Elle est également limitée à TROIS (3) participations par jour pour une même
          combinaison de nom et prénom renseignés, toutes adresses électroniques
          confondues.
        </p>
        <p className="mt-2">
          Le participant s'engage à renseigner ses véritables nom et prénom et à ne pas
          modifier artificiellement leur saisie afin de contourner cette limitation.
        </p>
        <p className="mt-2">
          A ce titre, il est précisé qu'une même adresse électronique ne pourra être
          utilisée qu'une seule fois par jour pour participer au Jeu, quel que soit le
          nombre de consommations éligibles réalisées, de supports de participation
          détenus ou d'établissements participants fréquentés au cours de la même
          journée.
        </p>

        <SousTitre>3.5. Vérification</SousTitre>
        <p>
          L'Organisateur se réserve le droit de procéder à toutes vérifications
          concernant notamment l'identité, l'âge, les coordonnées des participants, la
          validité de l'adresse électronique renseignée, pour s'assurer du respect du
          présent article comme de l'ensemble du présent Règlement, notamment pour
          écarter tout Participant ayant commis un abus quelconque, sans toutefois
          qu'il ait l'obligation de procéder à une vérification systématique de
          l'ensemble des Participants, pouvant limiter cette vérification aux gagnants.
        </p>
        <p className="mt-2">
          Il pourra notamment refuser une adresse électronique dont le domaine est
          inexistant ou manifestement invalide.
        </p>

        {/* ── 4. Modalités de participation ── */}
        <Titre>4. Modalités de Participation</Titre>

        <SousTitre>4.1. Consommation d'un produit éligible dans un établissement participant</SousTitre>
        <p>
          Pour participer, les participants doivent consommer des produits de
          l'Organisateur éligibles dans l'un des établissements participants
          (<em>voir la liste des établissements participants accessible via le lien
          exposé ci-après</em>) afin qu'il leur soit remis un sous-bock, lequel
          constitue le support du Jeu présentant un QR code qu'il conviendra de scanner.
        </p>

        <SousTitre>4.2. Produits Eligibles</SousTitre>
        <p>
          Sont considérés comme produits éligibles au Jeu les produits suivants de
          l'Organisateur :
        </p>
        <ul className="mt-1 list-disc pl-6">
          <li>Bière PILOU ;</li>
          <li>
            Boissons sans alcool de l'Organisateur, à savoir :
            <ul className="list-disc pl-6">
              <li>Limonade ;</li>
              <li>Cola.</li>
            </ul>
          </li>
        </ul>
        <p className="mt-3 font-bold uppercase">
          Important : le jeu n'est pas réservé à la consommation d'une boisson
          alcoolisée. La participation au jeu est également ouverte à l'occasion de la
          consommation d'une boisson sans alcool de l'organisateur, lorsque celle-ci
          est distribuée par l'établissement participant concerné.
        </p>
        <p className="mt-2">
          L'Organisateur se réserve la possibilité de compléter ou modifier la liste
          des produits éligibles pendant la durée du Jeu, notamment pour tenir compte
          des produits effectivement distribués dans les établissements participants,
          sous réserve que cette modification soit portée à la connaissance des
          participants sur la page du Jeu ou par tout autre moyen approprié.
        </p>

        <SousTitre>4.3. Etablissements participants</SousTitre>
        <p>
          La liste des Etablissements Participants est consultable à l'url suivante :{' '}
          <a href="/etablissements" target="_blank" rel="noopener noreferrer"
             className="underline font-semibold">
            jeu.lapilou.fr/etablissements
          </a>
        </p>

        <SousTitre>4.4. Participation en ligne</SousTitre>
        <p>
          Les participants doivent scanner le QR code à l'aide d'un appareil
          électronique compatible afin d'accéder à la page du jeu, hébergée à l'url
          ci-après : https://jeu.lapilou.fr/jouer, et renseigner leurs nom, prénom,
          adresse électronique valide, numéro de téléphone portable et sélectionner le
          nom de l'établissement dans lequel le Produit Eligible a été consommé.
        </p>

        <SousTitre>4.5. Matériel nécessaire</SousTitre>
        <p>Sont nécessaires à la participation du jeu :</p>
        <ul className="mt-1 list-disc pl-6">
          <li>Le sous-bock servi avec le produit éligible ;</li>
          <li>Un smartphone ou tout appareil compatible avec la technologie QR CODE pour scanner le QR code ;</li>
          <li>Un accès à Internet pour se connecter à la page du jeu.</li>
        </ul>
        <p className="mt-2">
          Les sous-bocks du Jeu contiennent un QR code permettant de participer. Ils ne
          constituent pas en eux-mêmes un support gagnant.
        </p>

        {/* ── 5. Désignation des gagnants ── */}
        <Titre>5. Désignation des Gagnants</Titre>

        <SousTitre>5.1. Principe de désignation des gagnants</SousTitre>
        <p>
          Le Jeu fonctionne selon un mécanisme de jeu à résultat instantané accessible
          en ligne via le QR code figurant sur le support promotionnel remis au
          participant dans un établissement participant selon les modalités visées à
          l'article 4.
        </p>
        <p className="mt-2">
          Après avoir, cumulativement : accédé à la page du Jeu, renseigné l'ensemble
          des informations obligatoires demandées, sélectionné l'établissement
          participant concerné, accepté le présent règlement, et le cas échéant, validé
          les cases de consentement proposées, le participant peut activer le mécanisme
          de jeu en cliquant sur le bouton « <em>Faire tourner la pièce</em> ».
        </p>
        <p className="mt-2">
          Le système informatique de gestion du Jeu détermine alors, de manière
          automatisée et aléatoire, si la participation est gagnante ou non,
          conformément aux probabilités de gain applicables à l'établissement
          participant sélectionné et aux lots disponibles au moment de la participation.
        </p>
        <p className="mt-2">
          Le résultat est ensuite affiché au participant au moyen d'une animation
          représentant une pièce virtuelle en rotation. En cas de participation
          gagnante, la face « PILOU » s'affiche et le lot attribué apparaît à l'écran.
          En cas de participation non gagnante, la face « PHILA » s'affiche.
        </p>
        <p className="mt-2">
          Toute modification des paramètres de répartition des gains ne produit effet
          que pour les participations postérieures à sa mise à jour et ne remet pas en
          cause les droits régulièrement acquis par les participants antérieurement.
        </p>

        <SousTitre>5.2. Probabilités de gain</SousTitre>
        <p>
          Pour chaque participation valable, les probabilités d'obtention d'un résultat
          gagnant sont déterminées selon les paramètres applicables à l'établissement
          participant sélectionné par le participant au moment de sa participation.
        </p>
        <p className="mt-2">
          Ces paramètres peuvent notamment tenir compte des lots disponibles dans
          l'établissement concerné, de la durée de participation applicable audit
          établissement, de son activité, ainsi que, le cas échéant, de toute opération
          promotionnelle ou évènement ponctuel auquel il participe.
        </p>
        <p className="mt-2">
          La probabilité d'obtention d'un résultat gagnant applicable à l'établissement
          sélectionné est portée à la connaissance du participant avant sa
          participation effective, selon les modalités indiquées sur l'interface du Jeu.
        </p>
        <p className="mt-2">
          Lorsqu'une participation est gagnante, le type de lot attribué est déterminé
          parmi les lots disponibles pour l'établissement participant sélectionné,
          selon des probabilités de répartition préalablement définies par
          l'Organisateur.
        </p>
        <p className="mt-2">
          En conséquence, la probabilité d'obtention d'un résultat gagnant ainsi que
          les modalités de répartition des lots peuvent varier selon l'établissement
          participant sélectionné, la période de participation et les lots
          effectivement disponibles.
        </p>
        <p className="mt-2">
          Toute modification des paramètres de gain ne s'applique qu'aux participations
          postérieures à sa mise en œuvre et ne saurait remettre en cause les droits
          régulièrement acquis par les participants antérieurement.
        </p>

        <SousTitre>5.3. Information des gagnants</SousTitre>
        <p>
          Le participant est immédiatement informé du résultat de sa participation par
          un message affichant à l'écran :
        </p>
        <ul className="mt-1 list-disc pl-6">
          <li>Soit qu'il n'a pas gagné ;</li>
          <li>
            Soit un écran gagnant mentionnant le gain, le code unique de retrait, les
            nom et prénom du participant, la date, l'heure et le nom de l'établissement
            dans lequel il a participé.
          </li>
        </ul>
        <p className="mt-2">
          En cas de gain du lot « Visite de la Brasserie du Comté », un courriel de
          confirmation sera également adressé au gagnant, ainsi qu'à l'Organisateur
          afin de permettre la gestion et la remise du lot.
        </p>
        <p className="mt-2">
          Aucun courriel de confirmation n'est adressé au titre des autres lots, dont
          la remise intervient sur présentation de l'écran gagnant dans les conditions
          prévues à l'article 6.2.
        </p>

        <SousTitre>5.4. Vérification et annulation</SousTitre>
        <p>
          L'Organisateur ne pourra en aucun cas être tenu responsable de tous cas où
          les participants auraient renseigné de mauvaises informations ou coordonnées
          empêchant la bonne information des gagnants.
        </p>
        <p className="mt-2">
          A cet égard, l'Organisateur se réserve le droit de procéder aux vérifications
          utiles relatives notamment à l'identité des participants, à leurs
          coordonnées, à la limitation du nombre de participations autorisées, à la
          réalisation de la consommation dans l'établissement renseigné et, plus
          généralement, au respect du présent règlement.
        </p>
        <p className="mt-2">
          En cas d'irrégularité, de fraude, de tentative de fraude, de participation
          contraire au présent règlement ou d'anomalie technique ayant affecté la
          participation, l'Organisateur pourra annuler la participation litigieuse, ou
          retirer le bénéfice du lot attribué, sans que le participant ne puisse
          prétendre à une quelconque indemnisation.
        </p>

        {/* ── 6. Dotations ── */}
        <Titre>6. Dotations</Titre>

        <SousTitre>6.1. Description et valeurs des lots</SousTitre>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse border border-pilou-encre text-xs">
            <thead>
              <tr className="bg-pilou-rouge text-pilou-creme">
                <th className="border border-pilou-encre p-2 text-left">Intitulé</th>
                <th className="border border-pilou-encre p-2 text-left">Info complète</th>
                <th className="border border-pilou-encre p-2 text-left">Valeur en euros TTC*</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-pilou-encre p-2">Une visite de la Brasserie du Comté</td>
                <td className="border border-pilou-encre p-2">
                  1 Visite de la Brasserie du Comté avec dégustation (boissons
                  alcoolisées ou alternative non-alcoolisées) pour 6 personnes max sur RDV
                </td>
                <td className="border border-pilou-encre p-2">30,00 €</td>
              </tr>
              <tr>
                <td className="border border-pilou-encre p-2">PIECE PILOU</td>
                <td className="border border-pilou-encre p-2">
                  1 Pièce authentique de PILOU, spécialement fabriquée.
                </td>
                <td className="border border-pilou-encre p-2">2,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs">
          *La valeur des lots s'entend du prix en euros, toutes taxes comprises fixé
          par l'Organisateur.
        </p>
        <p className="mt-2">
          L'Organisateur se réserve le droit de modifier le contenu des lots au cours
          de la durée du Jeu, sous réserve de leur remplacement par des lots de valeur
          équivalente ou supérieure, sans préjudice des droits régulièrement acquis par
          les participants avant ladite modification.
        </p>
        <p className="mt-2">
          En cas d'indisponibilité exceptionnelle d'un lot au moment de sa remise,
          l'Organisateur pourra proposer au gagnant un lot de substitution d'une valeur
          au moins équivalente, sans que cette substitution n'ouvre droit à une
          quelconque indemnisation complémentaire.
        </p>
        <p className="mt-2">
          Des lots complémentaires peuvent également être proposés par certains
          établissements participants, sous réserve de leur validation préalable par
          l'Organisateur.
        </p>
        <p className="mt-2">
          Ces lots complémentaires ne sont applicables qu'à l'établissement participant
          concerné. Après sélection de l'établissement participant et avant le
          lancement du Jeu, le participant peut consulter les lots applicables à cet
          établissement, ainsi que leur valeur indicative.
        </p>
        <p className="mt-2">
          Les lots sont attribués dans la limite des stocks disponibles affectés à
          l'établissement participant sélectionné. En cas de participation gagnante,
          le lot attribué est déterminé parmi les lots disponibles pour l'établissement
          concerné, selon les taux d'attribution applicables aux lots dudit
          établissement.
        </p>
        <p className="mt-2">
          Tout lot dont le stock est épuisé cesse d'être attribuable et n'est plus
          présenté parmi les lots disponibles.
        </p>
        <p className="mt-2">
          Sauf mention contraire portée à la connaissance du participant avant le
          lancement du Jeu, les conditions de retrait des lots sont celles prévues au
          présent règlement, à savoir un retrait au comptoir de l'établissement
          participant concerné, le jour même de la participation.
        </p>

        <SousTitre>6.2. Modalité de remise</SousTitre>
        <p>
          Sauf mention contraire ci-dessous, les lots sont remis en mains propres au
          gagnant exclusivement auprès de l'établissement dans lequel il a participé.
        </p>
        <p className="mt-2">
          <strong className="underline">IMPORTANT :</strong> Pour obtenir le lot, le
          gagnant devra impérativement se <strong>présenter le jour même de sa
          participation</strong> au Jeu et devra présenter à l'établissement dans
          lequel il a participé, pendant les horaires d'ouverture de l'établissement
          concerné l'écran gagnant, et le cas échéant, le courriel de confirmation
          relatif au lot remporté. Le gagnant fera son affaire du déplacement jusqu'au
          lieu de remise des lots.
        </p>
        <p className="mt-2">
          Pour obtenir son lot, le gagnant devra présenter l'écran gagnant et permettre
          au personnel habilité de l'établissement participant d'enregistrer la remise
          du lot au moyen de la fonctionnalité prévue à cet effet sur cet écran.
        </p>
        <p className="mt-2">
          Cette validation intervient au moment de la remise effective du lot. Elle
          entraîne l'enregistrement définitif de la remise et rend l'écran gagnant
          ainsi que le code unique inutilisables pour toute nouvelle remise.
        </p>
        <p className="mt-2">
          À défaut pour le gagnant de présenter l'écran gagnant ou de permettre
          l'enregistrement de la remise, l'établissement participant pourra refuser de
          lui remettre le lot.
        </p>
        <p className="mt-2">
          L'Organisateur et/ou l'établissement participant pourront demander au gagnant
          de justifier de son identité lorsque cela est nécessaire à la vérification du
          gain ou à la remise du lot.
        </p>
        <p className="mt-2">
          Lorsqu'un lot consiste en une boisson alcoolisée, sa remise est strictement
          réservée aux personnes majeures. L'établissement participant pourra exiger la
          présentation d'un justificatif d'âge et refuser la remise du lot en cas de
          doute ou d'absence de justification suffisante.
        </p>
        <p className="mt-2">
          Pour le lot « Visite de la Brasserie du Comté », le gagnant sera contacté par
          l'Organisateur qui s'engage à prendre attache avec le gagnant dans les 15
          jours à compter de la date du gain, afin de convenir d'une date de
          rendez-vous pour réaliser la visite.
        </p>
        <p className="mt-2">
          Le gagnant fera son affaire personnelle, ainsi que celle de ses accompagnants,
          du déplacement jusqu'au lieu de la visite, aucun frais de transport,
          d'hébergement, de restauration ou autre frais annexe n'étant pris en charge
          par l'Organisateur.
        </p>

        <SousTitre>6.3. Délais de remise</SousTitre>
        <p>
          Sauf mention contraire, le gagnant doit retirer son lot{' '}
          <strong>LE JOUR MÊME</strong> de sa participation, avant la fermeture de
          l'établissement participant concerné.
        </p>
        <p className="mt-2">
          S'agissant du lot « Visite de la Brasserie du Comté » : Le gagnant disposera
          d'un délai de SIX (6) MOIS à compter de la date du gain pour réaliser ladite
          visite dans les conditions exposées ci-dessus.
        </p>
        <p className="mt-2">
          A défaut de respecter lesdits délais, le gagnant sera réputé avoir renoncé
          purement et simplement au lot.
        </p>

        <SousTitre>6.4. Renonciation</SousTitre>
        <p>
          Dans l'hypothèse où le gagnant refuserait de prendre possession de tout ou
          partie du lot, pour quelque raison que ce soit, il perdra le bénéfice complet
          dudit lot et ne pourra prétendre à une quelconque indemnisation ou
          contrepartie.
        </p>

        {/* ── 7. RGPD ── */}
        <Titre>7. Protection des Données Personnelles</Titre>

        <SousTitre>7.1. Collecte des données</SousTitre>
        <p>
          Dans le cadre du Jeu, la société BRASSERIE DU COMTE, en qualité de
          responsable du traitement, collecte et traite les données personnelles des
          participants (nom, prénom, adresse électronique, numéro de téléphone, code
          postal, établissement sélectionné) qui sont nécessaires pour la gestion du
          jeu.
        </p>

        <SousTitre>7.2. Utilisation des données</SousTitre>
        <p>
          Ces données seront utilisées exclusivement pour la gestion du jeu. Elles sont
          destinées à l'Organisateur et à ses prestataires techniques intervenant pour
          les besoins du jeu. Elles peuvent également être transmises à l'établissement
          participant concerné lorsque cette transmission est strictement nécessaire à
          la vérification du gain et à la remise du lot.
        </p>
        <p className="mt-2">
          Le participant peut de manière facultative, consentir, lors de l'inscription,
          à recevoir les newsletters et offres promotionnelles de l'Organisateur en
          cochant la case « je souhaite recevoir la Newsletter de la Brasserie » qui
          est visible juste avant le bouton « C'est parti ! ».
        </p>
        <p className="mt-2">
          Le cas échéant, le participant peut également consentir, par une case
          distincte, à ce que ses coordonnées soient transmises à l'établissement
          participant qu'il a sélectionné, afin de recevoir de sa part ses
          communications commerciales.
        </p>
        <p className="mt-2">
          Ce consentement est facultatif, distinct de la participation au Jeu et peut
          être retiré à tout moment auprès de l'établissement concerné.
        </p>

        <SousTitre>7.3. Conservation des données</SousTitre>
        <p>
          Les données collectées pour la gestion du Jeu sont conservées pendant la
          durée nécessaire à l'organisation du Jeu, à la remise des lots et à la
          gestion des réclamations, puis archivées pendant la durée nécessaire à la
          défense des droits de l'Organisateur.
        </p>

        <SousTitre>7.4. Droits des participants</SousTitre>
        <p>
          Conformément au RGPD, les participants disposent d'un droit d'accès, de
          rectification, de suppression et d'opposition sur leurs données personnelles.
          Pour exercer ces droits, ils peuvent contacter l'Organisateur à l'adresse
          e-mail suivante :{' '}
          <a href="mailto:pilou@brasserieducomte.fr" className="underline">pilou@brasserieducomte.fr</a>
        </p>

        <SousTitre>7.5. Opérations promotionnelles</SousTitre>
        <p>
          Lors de son inscription au Jeu, le participant pourra, au moyen d'une case à
          cocher facultative et distincte de l'acceptation du règlement, autoriser
          l'Organisateur à utiliser, en cas de gain, son nom et prénom à des fins de
          communication relatives au Jeu, pendant la durée de celui-ci, sans que cette
          utilisation n'ouvre droit à rémunération ou indemnisation autre que le lot
          remporté.
        </p>
        <p className="mt-2">
          L'absence de consentement est sans incidence sur la participation au Jeu, les
          chances ou la remise d'un lot. Le participant pourra retirer son consentement
          à tout moment en contactant l'organisateur à l'adresse suivante :{' '}
          <a href="mailto:pilou@brasserieducomte.fr" className="underline">pilou@brasserieducomte.fr</a>
        </p>

        {/* ── 8. Responsabilité ── */}
        <Titre>8. Responsabilité</Titre>
        <p>
          L'Organisateur ne saurait être tenu responsable pour tout préjudice trouvant
          son origine dans :
        </p>
        <ul className="mt-1 list-disc pl-6">
          <li>
            Toutes défaillances techniques ou informatiques liées à des problèmes de
            compatibilité relatif au matériel et à la configuration informatique du
            participant ;
          </li>
          <li>
            Toutes défaillances de l'accès ou du déroulement du jeu trouvant leur
            origine dans un évènement extérieur à l'Organisateur ;
          </li>
          <li>
            Tout préjudice trouvant son origine dans une intervention frauduleuse du
            participant ;
          </li>
          <li>
            Toute indisponibilité du jeu trouvant son origine dans une défaillance du
            fournisseur réseau, de l'hébergeur des serveurs ou tout acteur informatique
            permettant le bon fonctionnement du site, sur lequel l'Organisateur n'a
            aucun contrôle ;
          </li>
          <li>Toutes informations erronées renseignées par les participants ;</li>
        </ul>
        <p className="mt-2">
          Toute tentative de fraude entraînera l'annulation de la participation.
        </p>

        {/* ── 9. Modification ── */}
        <Titre>9. Modification des Conditions</Titre>
        <p>
          L'Organisateur se réserve le droit de modifier, prolonger, écourter ou
          annuler le jeu à tout moment, sans préavis, en cas de force majeure ou de
          circonstances indépendantes de sa volonté.
        </p>

        {/* ── 10. Consultation ── */}
        <Titre>10. Consultation du Règlement</Titre>
        <p>
          Le présent Règlement est disponible et consultable en ligne pendant toute la
          durée du jeu, sur le site internet de l'Organisateur, à l'URL :
          https://jeu.lapilou.fr/reglement
        </p>

        {/* ── 11. Litiges ── */}
        <Titre>11. Litiges</Titre>
        <p>
          Toute contestation relative à l'interprétation ou à l'application du
          Règlement devra être formulée par lettre recommandée avec accusé de réception
          à l'adresse de l'Organisateur au plus tard dans les TRENTE (30) jours suivant
          la fin du Jeu, la date du cachet de la Poste faisant foi.
        </p>
        <p className="mt-2">
          L'Organisateur s'efforcera de répondre à toute réclamation dans un délai
          raisonnable à compter de sa réception.
        </p>
        <p className="mt-2">
          À défaut de résolution amiable, tout litige relatif au Jeu sera soumis au
          Tribunal Judiciaire de Nice.
        </p>

        <p className="mt-8 text-center text-xs opacity-70">
          L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
        </p>

        <div className="mt-10 text-center">
          <Link to="/jouer" className="titre inline-block rounded bg-pilou-rouge px-8 py-3
            text-lg font-bold text-pilou-creme shadow-lg transition hover:bg-pilou-rouge-fonce">
            Participer au jeu
          </Link>
        </div>
      </div>
    </main>
  )
}
