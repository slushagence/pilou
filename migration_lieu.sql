-- ============================================================
-- PILOU — Migration : restaurants → lieux
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. Renommer la table principale
ALTER TABLE restaurants RENAME TO lieux;

-- 2. Renommer la colonne restaurant_id dans les tables liées
ALTER TABLE lots RENAME COLUMN restaurant_id TO lieu_id;
ALTER TABLE parties RENAME COLUMN restaurant_id TO lieu_id;
ALTER TABLE alertes_stock RENAME COLUMN restaurant_id TO lieu_id;

-- 3. Renommer restaurant_nom dans alertes_stock
ALTER TABLE alertes_stock RENAME COLUMN restaurant_nom TO lieu_nom;

-- 4. Recréer la vue v_lieux (anciennement v_restaurants)
DROP VIEW IF EXISTS v_restaurants;
CREATE OR REPLACE VIEW v_lieux AS
  SELECT id, nom, ville, slug
  FROM lieux
  WHERE actif = true
  ORDER BY nom;

-- Accès public anonyme
GRANT SELECT ON v_lieux TO anon;

-- 5. Recréer la vue v_lots avec lieu_id
DROP VIEW IF EXISTS v_lots;
CREATE OR REPLACE VIEW v_lots AS
  SELECT
    l.id,
    l.lieu_id,
    l.nom,
    l.description,
    l.valeur_euros
  FROM lots l
  JOIN lieux r ON r.id = l.lieu_id
  WHERE l.actif = true
    AND l.stock_restant > 0
    AND r.actif = true;

GRANT SELECT ON v_lots TO anon;

-- 6. Recréer la fonction jouer() avec p_lieu_id
DROP FUNCTION IF EXISTS jouer(uuid,text,text,text,text,boolean,boolean);

CREATE OR REPLACE FUNCTION jouer(
  p_lieu_id        uuid,
  p_prenom         text,
  p_nom            text,
  p_email          text,
  p_telephone      text    DEFAULT NULL,
  p_newsletter_brasserie      boolean DEFAULT false,
  p_newsletter_etablissement  boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_lieu            lieux%ROWTYPE;
  v_jour            date := current_date AT TIME ZONE 'Europe/Paris';
  v_lot             lots%ROWTYPE;
  v_code            text;
  v_resultat        text;
  v_lot_nom         text;
  v_total_poids     integer;
  v_tirage          float;
  v_cumul           float := 0;
BEGIN
  -- Récupère le lieu
  SELECT * INTO v_lieu FROM lieux WHERE id = p_lieu_id AND actif = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'etablissement_inconnu');
  END IF;

  -- Vérifie participation du jour
  IF EXISTS (
    SELECT 1 FROM parties
    WHERE email = p_email AND jour = v_jour AND lieu_id = p_lieu_id
  ) THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'deja_joue_aujourdhui');
  END IF;

  -- Tirage gain/perte
  IF random() < v_lieu.taux_de_gain THEN
    v_resultat := 'gagne';
  ELSE
    v_resultat := 'perdu';
  END IF;

  -- Si gagnant, tirage du lot
  IF v_resultat = 'gagne' THEN
    SELECT COALESCE(SUM(poids), 0) INTO v_total_poids
    FROM lots
    WHERE lieu_id = p_lieu_id AND actif = true AND stock_restant > 0;

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
        IF v_tirage < v_cumul THEN
          EXIT;
        END IF;
      END LOOP;

      -- Décrémente le stock
      UPDATE lots SET stock_restant = stock_restant - 1 WHERE id = v_lot.id;

      -- Génère le code de retrait
      v_code := upper(substring(md5(random()::text) FROM 1 FOR 6));
      v_lot_nom := v_lot.nom;

      -- Alerte stock si seuil atteint
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

  -- Enregistre la partie
  INSERT INTO parties (
    lieu_id, prenom, nom, email, telephone, jour, resultat,
    lot_id, lot_nom, code_retrait,
    newsletter_brasserie, newsletter_etablissement
  ) VALUES (
    p_lieu_id, p_prenom, p_nom, p_email, p_telephone, v_jour, v_resultat,
    CASE WHEN v_resultat = 'gagne' THEN v_lot.id ELSE NULL END,
    v_lot_nom, v_code,
    p_newsletter_brasserie, p_newsletter_etablissement
  );

  RETURN jsonb_build_object(
    'ok', true,
    'resultat', v_resultat,
    'lot', v_lot_nom,
    'code_retrait', v_code,
    'prenom', p_prenom,
    'nom', p_nom,
    'lieu', v_lieu.nom || ' — ' || v_lieu.ville,
    'date_heure', to_char(now() AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY à HH24:MI')
  );
END;
$$;

