-- ============================================================
-- Traduction des lots (nom + description) pour les joueurs
-- anglophones. Optionnel par lot : si nom_en est vide, le nom
-- français continue de s'afficher (aucune régression).
-- ============================================================

-- 1. Nouvelles colonnes sur la table lots
ALTER TABLE lots ADD COLUMN IF NOT EXISTS nom_en text;
ALTER TABLE lots ADD COLUMN IF NOT EXISTS description_en text;

-- 2. Vue v_lots : on ajoute les deux colonnes anglaises.
--    ⚠️ Vérifie la définition actuelle de v_lots dans Supabase avant de
--    lancer ce CREATE OR REPLACE (Table Editor → Views → v_lots → Definition) :
--    si elle contient d'autres colonnes que celles listées ici, ajoute-les
--    pour ne pas les perdre.
CREATE OR REPLACE VIEW v_lots AS
  SELECT
    l.id,
    l.lieu_id,
    l.nom,
    l.nom_en,
    l.description,
    l.description_en,
    l.valeur_euros
  FROM lots l
  JOIN lieux r ON r.id = l.lieu_id
  WHERE l.actif = true
    AND l.stock_restant > 0
    AND r.actif = true;

GRANT SELECT ON v_lots TO anon;

-- 3. Fonction jouer() : on renvoie aussi le nom anglais du lot gagné
--    (lot_en), pour que la page résultat puisse l'afficher si le joueur
--    est en anglais. Reprend intégralement la version du 09/07/2026
--    (patch_retrait_et_limite.sql), en ajoutant uniquement v_lot_nom_en
--    et 'lot_en' dans le retour JSON.
DROP FUNCTION IF EXISTS jouer(uuid,text,text,text,text,boolean,boolean,boolean,text);

CREATE OR REPLACE FUNCTION jouer(
  p_lieu_id                   uuid,
  p_prenom                    text,
  p_nom                       text,
  p_email                     text,
  p_telephone                 text    DEFAULT NULL,
  p_newsletter_brasserie      boolean DEFAULT false,
  p_newsletter_etablissement  boolean DEFAULT false,
  p_consentement_promo        boolean DEFAULT false,
  p_code_postal               text    DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_lieu            lieux%ROWTYPE;
  v_jour            date := (current_timestamp AT TIME ZONE 'Europe/Paris')::date;
  v_lot             lots%ROWTYPE;
  v_code            text;
  v_resultat        text;
  v_lot_nom         text;
  v_lot_nom_en      text;
  v_total_poids     integer;
  v_tirage          float;
  v_cumul           float := 0;
  v_tentatives      integer;
BEGIN
  SELECT * INTO v_lieu FROM lieux WHERE id = p_lieu_id AND actif = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'etablissement_inconnu');
  END IF;

  -- Règle 1 : un email ne joue qu'une fois par jour
  IF EXISTS (
    SELECT 1 FROM parties
    WHERE lower(email) = lower(p_email) AND jour = v_jour
  ) THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'deja_joue_aujourdhui');
  END IF;

  -- Règle 2 : max 3 participations par jour pour un même nom + prénom
  SELECT count(*) INTO v_tentatives FROM parties
  WHERE lower(trim(nom)) = lower(trim(p_nom))
    AND lower(trim(prenom)) = lower(trim(p_prenom))
    AND jour = v_jour;

  IF v_tentatives >= 3 THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'trop_de_tentatives');
  END IF;

  IF random() < v_lieu.taux_de_gain THEN
    v_resultat := 'gagne';
  ELSE
    v_resultat := 'perdu';
  END IF;

  IF v_resultat = 'gagne' THEN
    SELECT COALESCE(SUM(poids), 0) INTO v_total_poids
    FROM lots WHERE lieu_id = p_lieu_id AND actif = true AND stock_restant > 0;

    IF v_total_poids = 0 THEN
      v_resultat := 'perdu';
    ELSE
      v_tirage := random() * v_total_poids;
      FOR v_lot IN
        SELECT * FROM lots
        WHERE lieu_id = p_lieu_id AND actif = true AND stock_restant > 0
        ORDER BY id
      LOOP
        v_cumul := v_cumul + v_lot.poids;
        IF v_tirage < v_cumul THEN EXIT; END IF;
      END LOOP;

      UPDATE lots SET stock_restant = stock_restant - 1 WHERE id = v_lot.id;
      v_code := upper(substring(md5(random()::text) FROM 1 FOR 6));
      v_lot_nom := v_lot.nom;
      v_lot_nom_en := v_lot.nom_en;

      IF (v_lot.stock_restant - 1) <= v_lot.seuil_alerte THEN
        INSERT INTO alertes_stock (lot_id, lieu_id, lot_nom, lieu_nom, type, stock_restant, seuil_alerte)
        VALUES (
          v_lot.id, p_lieu_id, v_lot.nom, v_lieu.nom,
          CASE WHEN (v_lot.stock_restant - 1) = 0 THEN 'rupture' ELSE 'alerte' END,
          v_lot.stock_restant - 1, v_lot.seuil_alerte
        );
      END IF;
    END IF;
  END IF;

  INSERT INTO parties (
    lieu_id, prenom, nom, email, telephone, code_postal, jour, resultat,
    lot_id, lot_nom, code_retrait,
    newsletter_brasserie, newsletter_etablissement, consentement_promo
  ) VALUES (
    p_lieu_id, p_prenom, p_nom, p_email, p_telephone, p_code_postal, v_jour, v_resultat,
    CASE WHEN v_resultat = 'gagne' THEN v_lot.id ELSE NULL END,
    v_lot_nom, v_code,
    p_newsletter_brasserie, p_newsletter_etablissement, p_consentement_promo
  );

  RETURN jsonb_build_object(
    'ok', true,
    'resultat', v_resultat,
    'lot', v_lot_nom,
    'lot_en', v_lot_nom_en,
    'code_retrait', v_code,
    'prenom', p_prenom,
    'nom', p_nom,
    'lieu', v_lieu.nom || ' — ' || v_lieu.ville,
    'date_heure', to_char(now() AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY à HH24:MI')
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'deja_joue_aujourdhui');
  WHEN OTHERS THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'erreur_serveur', 'detail', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION jouer(uuid,text,text,text,text,boolean,boolean,boolean,text) TO anon, authenticated;
