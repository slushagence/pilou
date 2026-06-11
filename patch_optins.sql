-- ============================================================================
-- PILOU — Patch "opt-ins newsletter" (article 7 du règlement du jeu)
-- Ajoute les deux consentements facultatifs au formulaire de participation.
-- À exécuter dans le SQL Editor de Supabase. Sans danger pour les données.
--
-- ⚠️ APRÈS EXÉCUTION : vérifier dans Project Settings → Data API →
--    Exposed functions que "jouer" est toujours exposée (la nouvelle
--    signature peut nécessiter de réactiver le toggle).
-- ============================================================================

-- 1. Les deux colonnes de consentement dans l'historique des parties
alter table public.parties
  add column if not exists newsletter_brasserie boolean not null default false,
  add column if not exists newsletter_etablissement boolean not null default false;

-- 2. L'ancienne signature disparaît (sinon les deux coexisteraient)
drop function if exists public.jouer(uuid, text, text, text, text);

-- 3. La fonction de jeu, identique à la version testée, avec les 2 consentements
create or replace function public.jouer(
  p_restaurant_id uuid,
  p_prenom        text,
  p_nom           text,
  p_email         text,
  p_telephone     text default null,
  p_newsletter_brasserie     boolean default false,
  p_newsletter_etablissement boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_restaurant   restaurants%rowtype;
  v_jour         date := (now() at time zone 'Europe/Paris')::date;
  v_partie_id    uuid;
  v_gagne        boolean;
  v_lot          record;
  v_total_poids  integer;
  v_tirage       numeric;
  v_cumul        integer := 0;
  v_code         text;
  v_nouveau_stock integer;
begin
  if p_prenom is null or trim(p_prenom) = ''
     or p_nom is null or trim(p_nom) = ''
     or p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('ok', false, 'erreur', 'formulaire_invalide');
  end if;

  select * into v_restaurant
  from restaurants
  where id = p_restaurant_id and actif = true;

  if not found then
    return jsonb_build_object('ok', false, 'erreur', 'etablissement_inconnu');
  end if;

  begin
    insert into parties (restaurant_id, prenom, nom, email, telephone, jour, resultat,
                         newsletter_brasserie, newsletter_etablissement)
    values (p_restaurant_id, trim(p_prenom), trim(p_nom),
            lower(trim(p_email)), nullif(trim(p_telephone), ''), v_jour, 'perdu',
            coalesce(p_newsletter_brasserie, false),
            coalesce(p_newsletter_etablissement, false))
    returning id into v_partie_id;
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'erreur', 'deja_joue_aujourdhui');
  end;

  v_gagne := random() < v_restaurant.taux_de_gain;

  if not v_gagne then
    return jsonb_build_object(
      'ok', true, 'resultat', 'perdu',
      'partie_id', v_partie_id,
      'restaurant', v_restaurant.nom,
      'prenom', trim(p_prenom), 'nom', trim(p_nom),
      'date_heure', to_char(now() at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI')
    );
  end if;

  perform 1
  from lots
  where restaurant_id = p_restaurant_id and actif = true and stock_restant > 0
  for update;

  select coalesce(sum(poids), 0) into v_total_poids
  from lots
  where restaurant_id = p_restaurant_id and actif = true and stock_restant > 0;

  if v_total_poids = 0 then
    return jsonb_build_object(
      'ok', true, 'resultat', 'perdu',
      'partie_id', v_partie_id,
      'restaurant', v_restaurant.nom,
      'prenom', trim(p_prenom), 'nom', trim(p_nom),
      'date_heure', to_char(now() at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI')
    );
  end if;

  v_tirage := random() * v_total_poids;

  for v_lot in
    select id, nom, poids, seuil_alerte
    from lots
    where restaurant_id = p_restaurant_id and actif = true and stock_restant > 0
    order by id
  loop
    v_cumul := v_cumul + v_lot.poids;
    exit when v_tirage < v_cumul;
  end loop;

  update lots
  set stock_restant = stock_restant - 1
  where id = v_lot.id and stock_restant > 0
  returning stock_restant into v_nouveau_stock;

  if v_nouveau_stock = v_lot.seuil_alerte or v_nouveau_stock = 0 then
    insert into alertes_stock (lot_id, restaurant_id, lot_nom, restaurant_nom,
                               type, stock_restant, seuil_alerte)
    values (v_lot.id, p_restaurant_id, v_lot.nom, v_restaurant.nom,
            case when v_nouveau_stock = 0 then 'rupture' else 'seuil' end,
            v_nouveau_stock, v_lot.seuil_alerte);
  end if;

  v_code := generer_code_retrait();

  update parties
  set resultat = 'gagne', lot_id = v_lot.id, lot_nom = v_lot.nom, code_retrait = v_code
  where id = v_partie_id;

  return jsonb_build_object(
    'ok', true, 'resultat', 'gagne',
    'partie_id', v_partie_id,
    'lot', v_lot.nom,
    'code_retrait', v_code,
    'restaurant', v_restaurant.nom,
    'prenom', trim(p_prenom), 'nom', trim(p_nom),
    'date_heure', to_char(now() at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI')
  );
end;
$$;

-- 4. Droits : seule la nouvelle signature est exécutable par le public
revoke all on function public.jouer(uuid, text, text, text, text, boolean, boolean) from public;
grant execute on function public.jouer(uuid, text, text, text, text, boolean, boolean)
  to anon, authenticated;

-- 5. Recharge le cache de l'API
notify pgrst, 'reload schema';
