-- ============================================================
-- 1. Fonction marquer_retire : le barman glisse le slider
--    → le lot est marqué comme remis (irréversible côté joueur)
-- ============================================================
CREATE OR REPLACE FUNCTION marquer_retire(p_code_retrait text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_partie parties%ROWTYPE;
BEGIN
  SELECT * INTO v_partie FROM parties
  WHERE code_retrait = upper(trim(p_code_retrait)) AND resultat = 'gagne';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'code_inconnu');
  END IF;

  IF v_partie.retire THEN
    RETURN jsonb_build_object('ok', false, 'erreur', 'deja_retire');
  END IF;

  UPDATE parties SET retire = true WHERE id = v_partie.id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION marquer_retire(text) TO anon, authenticated;

-- ============================================================
-- 2. Fonction jouer() : ajout limite 3 tentatives / jour
--    pour un même nom + prénom (anti-triche multi-emails)
-- ============================================================
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
