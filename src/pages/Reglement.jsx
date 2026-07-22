import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LogoPilou from '../components/LogoPilou'
import SelecteurLangue from '../components/SelecteurLangue'

// ─────────────────────────────────────────────────────────────────────────────
// Règlement conforme à la version du Cabinet Palazzetti du 10/07/2026
// (BDC - Règlement du Jeu 260710)
//
// La version anglaise ci-dessous est une traduction réalisée en interne,
// à titre indicatif pour les joueurs anglophones. Elle n'a pas été relue
// par un juriste. SEULE LA VERSION FRANÇAISE FAIT FOI en cas de litige,
// conformément au bandeau affiché en haut de la page en version anglaise.
// ─────────────────────────────────────────────────────────────────────────────

function Titre({ children }) {
  return <h2 className="titre mt-10 mb-3 text-xl font-bold text-pilou-rouge">{children}</h2>
}

function SousTitre({ children }) {
  return <h3 className="titre mt-6 mb-2 font-bold underline">{children}</h3>
}

function ReglementFR() {
  return (
    <>
      <p className="mt-4 text-xs opacity-70 text-center italic">
        Ce règlement est également disponible en anglais à titre indicatif. En cas de
        divergence, seule la présente version française fait foi.
      </p>

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
    </>
  )
}

function ReglementEN() {
  return (
    <>
      <div className="mt-6 rounded border-2 border-pilou-rouge bg-pilou-rouge/10 px-4 py-3 text-xs">
        <strong>This English translation is provided for convenience only and has not
        been reviewed by a lawyer.</strong> Only the French version of these rules is
        legally binding. In the event of any discrepancy or dispute, the French
        version prevails.
      </div>

      {/* ── 1. Organiser ── */}
      <Titre>1. Game Organiser</Titre>
      <p>
        BRASSERIE DU COMTE, a simplified joint-stock company (SAS) with capital of
        €7,500.00, registered with the Trade and Companies Register under number
        797 492 121 RCS Nice, whose registered office is located at lieu-dit
        "Pra de la Majou", Chemin de la Romegiero, 06450 Saint Martin Vésubie,
        represented by its acting Chairman, Mr. Edwards Dilly (hereinafter "the
        Organiser")
      </p>
      <p className="mt-2">
        <strong>Consumer Service Email:</strong>{' '}
        <a href="mailto:pilou@brasserieducomte.fr" className="underline">pilou@brasserieducomte.fr</a>
      </p>

      {/* ── 2. Duration ── */}
      <Titre>2. Duration of the Game</Titre>
      <p><strong>Start:</strong> 01/06/2026</p>
      <p><strong>End:</strong> 31/12/2026</p>
      <p className="mt-2">
        The Organiser reserves the right to continue the game beyond 31/12/2026 and
        may pause or stop it according to its organisational needs.
      </p>
      <p className="mt-2">
        Participation in the Game at each participating venue is however limited to
        the period during which the venue concerned actually takes part in the
        operation.
      </p>
      <p className="mt-2">
        The participation periods specific to each participating venue are indicated
        on the dedicated page listing participating venues, accessible via the link
        mentioned later in these rules, before the Game mechanism is launched.
      </p>
      <p className="mt-2">
        The Organiser reserves the right to add or remove participating venues
        during the Game, or to change the participation period, provided that this
        information is brought to the participant's attention by any appropriate
        means, in particular by updating the dedicated page of participating venues.
      </p>

      {/* ── 3. Conditions of participation ── */}
      <Titre>3. Conditions of Participation</Titre>

      <SousTitre>3.1. Eligibility</SousTitre>
      <p>
        The Game is open to any adult natural person, residing in or present in
        France, taking part on the occasion of consuming an eligible product of the
        Organiser at one of the venues participating in the Game, the list of which
        is accessible via the link mentioned in Article 4.3, subject to compliance
        with all the conditions set out in these rules.
      </p>

      <SousTitre>3.2. Exclusions</SousTitre>
      <p>
        Minors are expressly excluded from taking part in the game, as are all staff
        members of the Organiser and members of the same household.
      </p>

      <SousTitre>3.3. Acceptance</SousTitre>
      <p>
        Simply by taking part in this game, the participant purely and simply
        accepts, without reservation, these rules.
      </p>

      <SousTitre>3.4. Participation limits</SousTitre>
      <p>
        Participation in the game is limited to ONE (1) entry per day and per email
        address.
      </p>
      <p className="mt-2">
        It is also limited to THREE (3) entries per day for the same combination of
        surname and first name entered, across all email addresses combined.
      </p>
      <p className="mt-2">
        The participant undertakes to provide their real first and last name and not
        to artificially alter how they are entered in order to circumvent this
        limit.
      </p>
      <p className="mt-2">
        In this respect, it is specified that the same email address may only be
        used once per day to take part in the Game, regardless of the number of
        eligible consumptions made, participation supports held, or participating
        venues visited during the same day.
      </p>

      <SousTitre>3.5. Verification</SousTitre>
      <p>
        The Organiser reserves the right to carry out any checks, in particular
        regarding the identity, age and contact details of participants, and the
        validity of the email address provided, to ensure compliance with this
        article and with these Rules as a whole, in particular to exclude any
        Participant who has committed any abuse, without however being obliged to
        systematically verify all Participants, and may limit this verification to
        winners.
      </p>
      <p className="mt-2">
        It may in particular refuse an email address whose domain does not exist or
        is manifestly invalid.
      </p>

      {/* ── 4. Terms of participation ── */}
      <Titre>4. Terms of Participation</Titre>

      <SousTitre>4.1. Consuming an eligible product at a participating venue</SousTitre>
      <p>
        To take part, participants must consume eligible products of the Organiser
        at one of the participating venues (<em>see the list of participating venues
        accessible via the link set out below</em>) so that they are given a
        coaster, which serves as the Game's medium and features a QR code to be
        scanned.
      </p>

      <SousTitre>4.2. Eligible Products</SousTitre>
      <p>
        The following products of the Organiser are considered eligible for the
        Game:
      </p>
      <ul className="mt-1 list-disc pl-6">
        <li>PILOU beer;</li>
        <li>
          Non-alcoholic beverages of the Organiser, namely:
          <ul className="list-disc pl-6">
            <li>Lemonade;</li>
            <li>Cola.</li>
          </ul>
        </li>
      </ul>
      <p className="mt-3 font-bold uppercase">
        Important: the game is not reserved for the consumption of an alcoholic
        beverage. Participation in the game is also open on the occasion of
        consuming a non-alcoholic beverage of the organiser, when it is served by
        the participating venue concerned.
      </p>
      <p className="mt-2">
        The Organiser reserves the right to add to or change the list of eligible
        products during the Game, in particular to reflect the products actually
        served at participating venues, provided that this change is brought to
        participants' attention on the Game page or by any other appropriate means.
      </p>

      <SousTitre>4.3. Participating venues</SousTitre>
      <p>
        The list of Participating Venues can be viewed at the following URL:{' '}
        <a href="/etablissements" target="_blank" rel="noopener noreferrer"
           className="underline font-semibold">
          jeu.lapilou.fr/etablissements
        </a>
      </p>

      <SousTitre>4.4. Online participation</SousTitre>
      <p>
        Participants must scan the QR code using a compatible electronic device to
        access the game page, hosted at the following URL:
        https://jeu.lapilou.fr/jouer, and provide their surname, first name, valid
        email address, mobile phone number, and select the name of the venue where
        the Eligible Product was consumed.
      </p>

      <SousTitre>4.5. Equipment needed</SousTitre>
      <p>The following are needed to take part in the game:</p>
      <ul className="mt-1 list-disc pl-6">
        <li>The coaster served with the eligible product;</li>
        <li>A smartphone or any device compatible with QR CODE technology to scan the QR code;</li>
        <li>Internet access to connect to the game page.</li>
      </ul>
      <p className="mt-2">
        The Game's coasters contain a QR code allowing participation. They do not
        in themselves constitute a winning medium.
      </p>

      {/* ── 5. Designation of winners ── */}
      <Titre>5. Designation of Winners</Titre>

      <SousTitre>5.1. Principle for designating winners</SousTitre>
      <p>
        The Game operates on an instant-win mechanism accessible online via the QR
        code shown on the promotional item given to the participant at a
        participating venue under the terms set out in Article 4.
      </p>
      <p className="mt-2">
        After having, cumulatively: accessed the Game page, provided all the
        required mandatory information, selected the participating venue concerned,
        accepted these rules, and where applicable, ticked the consent boxes
        offered, the participant may activate the game mechanism by clicking the
        "<em>Flip the coin</em>" button.
      </p>
      <p className="mt-2">
        The Game's computer system then determines, automatically and randomly,
        whether the entry is a winning one or not, in accordance with the winning
        odds applicable to the selected participating venue and the prizes
        available at the time of participation.
      </p>
      <p className="mt-2">
        The result is then displayed to the participant by means of an animation
        showing a virtual coin spinning. In the event of a winning entry, the
        "PILOU" side is displayed and the prize awarded appears on screen. In the
        event of a non-winning entry, the "PHILA" side is displayed.
      </p>
      <p className="mt-2">
        Any change to the prize-distribution settings only takes effect for entries
        made after it is updated and does not affect rights already validly
        acquired by participants beforehand.
      </p>

      <SousTitre>5.2. Odds of winning</SousTitre>
      <p>
        For each valid entry, the odds of obtaining a winning result are determined
        according to the settings applicable to the participating venue selected by
        the participant at the time of their entry.
      </p>
      <p className="mt-2">
        These settings may in particular take into account the prizes available at
        the venue concerned, the participation period applicable to that venue, its
        activity, and, where applicable, any promotional operation or one-off event
        it is taking part in.
      </p>
      <p className="mt-2">
        The odds of obtaining a winning result applicable to the selected venue are
        brought to the participant's attention before their actual entry, according
        to the terms indicated on the Game interface.
      </p>
      <p className="mt-2">
        When an entry is a winning one, the type of prize awarded is determined
        among the prizes available for the selected participating venue, according
        to distribution odds previously set by the Organiser.
      </p>
      <p className="mt-2">
        As a result, the odds of obtaining a winning result as well as the
        prize-distribution terms may vary depending on the participating venue
        selected, the participation period and the prizes actually available.
      </p>
      <p className="mt-2">
        Any change to the winning settings only applies to entries made after it is
        implemented and cannot affect rights already validly acquired by
        participants beforehand.
      </p>

      <SousTitre>5.3. Informing winners</SousTitre>
      <p>
        The participant is immediately informed of the result of their entry by a
        message displayed on screen:
      </p>
      <ul className="mt-1 list-disc pl-6">
        <li>Either that they have not won;</li>
        <li>
          Or a winning screen mentioning the prize, the unique redemption code, the
          participant's surname and first name, the date, the time and the name of
          the venue where they took part.
        </li>
      </ul>
      <p className="mt-2">
        If the "Visit to the Brasserie du Comté" prize is won, a confirmation email
        will also be sent to the winner, as well as to the Organiser, to allow the
        prize to be managed and handed over.
      </p>
      <p className="mt-2">
        No confirmation email is sent for other prizes, which are handed over on
        presentation of the winning screen under the conditions set out in Article
        6.2.
      </p>

      <SousTitre>5.4. Verification and cancellation</SousTitre>
      <p>
        The Organiser cannot under any circumstances be held liable in cases where
        participants have provided incorrect information or contact details
        preventing winners from being properly informed.
      </p>
      <p className="mt-2">
        In this respect, the Organiser reserves the right to carry out any useful
        checks, in particular regarding the identity of participants, their contact
        details, the limit on the number of entries allowed, whether the
        consumption actually took place at the venue indicated and, more generally,
        compliance with these rules.
      </p>
      <p className="mt-2">
        In the event of irregularity, fraud, attempted fraud, participation
        contrary to these rules or a technical anomaly affecting the entry, the
        Organiser may cancel the disputed entry, or withdraw the benefit of the
        prize awarded, without the participant being able to claim any
        compensation whatsoever.
      </p>

      {/* ── 6. Prizes ── */}
      <Titre>6. Prizes</Titre>

      <SousTitre>6.1. Description and value of prizes</SousTitre>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse border border-pilou-encre text-xs">
          <thead>
            <tr className="bg-pilou-rouge text-pilou-creme">
              <th className="border border-pilou-encre p-2 text-left">Title</th>
              <th className="border border-pilou-encre p-2 text-left">Full details</th>
              <th className="border border-pilou-encre p-2 text-left">Value in euros, incl. tax*</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-pilou-encre p-2">A visit to the Brasserie du Comté</td>
              <td className="border border-pilou-encre p-2">
                1 visit to the Brasserie du Comté with tasting (alcoholic drinks or
                non-alcoholic alternative) for up to 6 people, by appointment
              </td>
              <td className="border border-pilou-encre p-2">€30.00</td>
            </tr>
            <tr>
              <td className="border border-pilou-encre p-2">PILOU COIN</td>
              <td className="border border-pilou-encre p-2">
                1 authentic PILOU coin, specially made.
              </td>
              <td className="border border-pilou-encre p-2">€2.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs">
        *The value of the prizes refers to the price in euros, all taxes included,
        set by the Organiser.
      </p>
      <p className="mt-2">
        The Organiser reserves the right to change the content of the prizes during
        the Game, provided they are replaced with prizes of equivalent or greater
        value, without prejudice to rights already validly acquired by participants
        before such a change.
      </p>
      <p className="mt-2">
        In the event of an exceptional unavailability of a prize at the time it is
        due to be handed over, the Organiser may offer the winner a substitute
        prize of at least equivalent value, without this substitution giving rise
        to any additional compensation.
      </p>
      <p className="mt-2">
        Additional prizes may also be offered by certain participating venues,
        subject to prior approval by the Organiser.
      </p>
      <p className="mt-2">
        These additional prizes only apply to the participating venue concerned.
        After selecting the participating venue and before launching the Game, the
        participant can view the prizes applicable to that venue, as well as their
        indicative value.
      </p>
      <p className="mt-2">
        Prizes are awarded within the limit of the stock available allocated to the
        selected participating venue. In the event of a winning entry, the prize
        awarded is determined among the prizes available for the venue concerned,
        according to the allocation rates applicable to that venue's prizes.
      </p>
      <p className="mt-2">
        Any prize whose stock is exhausted ceases to be awardable and is no longer
        shown among the available prizes.
      </p>
      <p className="mt-2">
        Unless stated otherwise and brought to the participant's attention before
        the Game is launched, the conditions for collecting prizes are those set
        out in these rules, namely collection at the counter of the participating
        venue concerned, on the same day as the entry.
      </p>

      <SousTitre>6.2. Collection terms</SousTitre>
      <p>
        Unless stated otherwise below, prizes are handed over in person to the
        winner exclusively at the venue where they took part.
      </p>
      <p className="mt-2">
        <strong className="underline">IMPORTANT:</strong> To obtain the prize, the
        winner must <strong>show up on the same day as their entry</strong> and
        must present, at the venue where they took part, during that venue's
        opening hours, the winning screen and, where applicable, the confirmation
        email relating to the prize won. The winner is responsible for travelling
        to the prize collection location.
      </p>
      <p className="mt-2">
        To obtain their prize, the winner must present the winning screen and allow
        authorised staff at the participating venue to record the prize's handover
        using the feature provided for this purpose on that screen.
      </p>
      <p className="mt-2">
        This validation takes place at the time the prize is actually handed over.
        It permanently records the handover and makes the winning screen and the
        unique code unusable for any further handover.
      </p>
      <p className="mt-2">
        Should the winner fail to present the winning screen or allow the handover
        to be recorded, the participating venue may refuse to hand over the prize.
      </p>
      <p className="mt-2">
        The Organiser and/or the participating venue may ask the winner to prove
        their identity where necessary to verify the win or hand over the prize.
      </p>
      <p className="mt-2">
        Where a prize consists of an alcoholic beverage, it is handed over strictly
        to adults only. The participating venue may require proof of age and refuse
        to hand over the prize in case of doubt or insufficient proof.
      </p>
      <p className="mt-2">
        For the "Visit to the Brasserie du Comté" prize, the winner will be
        contacted by the Organiser, who undertakes to get in touch with the winner
        within 15 days of the date the prize was won, in order to arrange a date
        for the visit.
      </p>
      <p className="mt-2">
        The winner is personally responsible, as are their guests, for travelling
        to the visit location; no transport, accommodation, catering or other
        incidental costs are covered by the Organiser.
      </p>

      <SousTitre>6.3. Collection deadlines</SousTitre>
      <p>
        Unless stated otherwise, the winner must collect their prize{' '}
        <strong>ON THE SAME DAY</strong> as their entry, before the participating
        venue concerned closes.
      </p>
      <p className="mt-2">
        For the "Visit to the Brasserie du Comté" prize: the winner will have a
        period of SIX (6) MONTHS from the date the prize was won to complete the
        visit under the conditions set out above.
      </p>
      <p className="mt-2">
        Should these deadlines not be met, the winner will be deemed to have purely
        and simply waived the prize.
      </p>

      <SousTitre>6.4. Waiver</SousTitre>
      <p>
        Should the winner refuse to take possession of all or part of the prize,
        for whatever reason, they will lose the full benefit of that prize and will
        not be entitled to any compensation or consideration.
      </p>

      {/* ── 7. Data protection ── */}
      <Titre>7. Protection of Personal Data</Titre>

      <SousTitre>7.1. Data collection</SousTitre>
      <p>
        As part of the Game, BRASSERIE DU COMTE, as data controller, collects and
        processes participants' personal data (surname, first name, email address,
        phone number, postal code, selected venue) which are necessary for managing
        the game.
      </p>

      <SousTitre>7.2. Use of data</SousTitre>
      <p>
        This data will be used exclusively for managing the game. It is intended
        for the Organiser and its technical service providers involved in running
        the game. It may also be passed on to the participating venue concerned
        where this is strictly necessary to verify the win and hand over the
        prize.
      </p>
      <p className="mt-2">
        Participants may, on an optional basis, consent when registering to
        receive the Organiser's newsletters and promotional offers by ticking the
        "I would like to receive the Brasserie's newsletter" box, shown just
        before the "Let's go!" button.
      </p>
      <p className="mt-2">
        Where applicable, the participant may also consent, via a separate box, to
        their contact details being passed on to the participating venue they
        selected, so as to receive its marketing communications.
      </p>
      <p className="mt-2">
        This consent is optional, separate from participation in the Game, and may
        be withdrawn at any time from the venue concerned.
      </p>

      <SousTitre>7.3. Data retention</SousTitre>
      <p>
        Data collected for managing the Game is kept for the time needed to
        organise the Game, hand over prizes and manage complaints, then archived
        for the time needed to defend the Organiser's rights.
      </p>

      <SousTitre>7.4. Participants' rights</SousTitre>
      <p>
        In accordance with the GDPR, participants have the right to access,
        rectify, delete and object to their personal data. To exercise these
        rights, they can contact the Organiser at the following email address:{' '}
        <a href="mailto:pilou@brasserieducomte.fr" className="underline">pilou@brasserieducomte.fr</a>
      </p>

      <SousTitre>7.5. Promotional operations</SousTitre>
      <p>
        When registering for the Game, the participant may, by means of an
        optional checkbox separate from acceptance of the rules, authorise the
        Organiser to use, in the event of winning, their first and last name for
        communication purposes relating to the Game, for its duration, without
        this use giving rise to any payment or compensation other than the prize
        won.
      </p>
      <p className="mt-2">
        The absence of consent has no effect on participation in the Game, the
        odds, or the handover of a prize. The participant may withdraw their
        consent at any time by contacting the organiser at the following address:{' '}
        <a href="mailto:pilou@brasserieducomte.fr" className="underline">pilou@brasserieducomte.fr</a>
      </p>

      {/* ── 8. Liability ── */}
      <Titre>8. Liability</Titre>
      <p>The Organiser cannot be held liable for any harm arising from:</p>
      <ul className="mt-1 list-disc pl-6">
        <li>
          Any technical or IT failures linked to compatibility issues relating to
          the participant's hardware and computer setup;
        </li>
        <li>
          Any failure of access to or running of the game arising from an event
          beyond the Organiser's control;
        </li>
        <li>Any harm arising from fraudulent action by the participant;</li>
        <li>
          Any unavailability of the game arising from a failure of the network
          provider, server host, or any IT actor enabling the site to run
          properly, over which the Organiser has no control;
        </li>
        <li>Any incorrect information provided by participants;</li>
      </ul>
      <p className="mt-2">
        Any attempted fraud will result in the entry being cancelled.
      </p>

      {/* ── 9. Changes ── */}
      <Titre>9. Changes to Conditions</Titre>
      <p>
        The Organiser reserves the right to change, extend, shorten or cancel the
        game at any time, without notice, in the event of force majeure or
        circumstances beyond its control.
      </p>

      {/* ── 10. Consulting the rules ── */}
      <Titre>10. Consulting the Rules</Titre>
      <p>
        These Rules are available and can be consulted online throughout the
        duration of the game, on the Organiser's website, at the URL:
        https://jeu.lapilou.fr/reglement
      </p>

      {/* ── 11. Disputes ── */}
      <Titre>11. Disputes</Titre>
      <p>
        Any dispute regarding the interpretation or application of the Rules must
        be submitted by registered letter with acknowledgement of receipt to the
        Organiser's address no later than THIRTY (30) days after the end of the
        Game, the postmark date being proof of date.
      </p>
      <p className="mt-2">
        The Organiser will make every effort to respond to any complaint within a
        reasonable time of receiving it.
      </p>
      <p className="mt-2">
        Failing an amicable resolution, any dispute relating to the Game will be
        submitted to the Nice Judicial Court.
      </p>
    </>
  )
}

export default function Reglement() {
  const { t, i18n } = useTranslation()
  const enAnglais = i18n.language === 'en'

  return (
    <main className="fond-papier min-h-screen px-6 py-10 text-pilou-encre">
      <div className="mx-auto max-w-2xl text-sm leading-relaxed">
        <div className="text-center">
          <LogoPilou variante="couleur" hauteur={56} />
        </div>

        <SelecteurLangue />

        <h1 className="titre mt-2 text-center text-3xl font-bold leading-tight">
          {enAnglais ? 'Game rules' : 'Règlement du jeu'}
          <span className="block text-pilou-rouge">« Gagne ton Pilou… ou plus ! »</span>
        </h1>

        {enAnglais ? <ReglementEN /> : <ReglementFR />}

        <p className="mt-8 text-center text-xs opacity-70">
          {t('landing.mention_legale')}
        </p>

        <div className="mt-10 text-center">
          <Link to="/jouer" className="titre inline-block rounded bg-pilou-rouge px-8 py-3
            text-lg font-bold text-pilou-creme shadow-lg transition hover:bg-pilou-rouge-fonce">
            {t('landing.cta')}
          </Link>
        </div>
      </div>
    </main>
  )
}
