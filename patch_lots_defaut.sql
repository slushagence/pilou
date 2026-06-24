-- Injecter les 2 lots BDC par défaut sur tous les lieux qui n'en ont pas encore
INSERT INTO lots (lieu_id, nom, description, valeur_euros, stock_initial, stock_restant, seuil_alerte, poids, actif)
SELECT 
  l.id,
  'Pièce Pilou',
  'La célèbre pièce de pilou, symbole du jeu niçois !',
  2.00,
  20, 20, 10,
  20,
  true
FROM lieux l
WHERE NOT EXISTS (
  SELECT 1 FROM lots WHERE lieu_id = l.id AND nom = 'Pièce Pilou'
);

INSERT INTO lots (lieu_id, nom, description, valeur_euros, stock_initial, stock_restant, seuil_alerte, poids, actif)
SELECT 
  l.id,
  'Visite Brasserie du Comté',
  'Visite exclusive de la Brasserie du Comté à Gilette',
  30.00,
  50, 50, 20,
  80,
  true
FROM lieux l
WHERE NOT EXISTS (
  SELECT 1 FROM lots WHERE lieu_id = l.id AND nom = 'Visite Brasserie du Comté'
);
