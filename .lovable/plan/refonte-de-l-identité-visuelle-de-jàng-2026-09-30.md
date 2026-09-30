# Refonte de l’identité visuelle de Jàng

## Résultat attendu
- Appliquer un fond papier quadrillé discret à l’ensemble du site et la nouvelle palette vert/encre.
- Installer les quatre familles Google Fonts avec leurs rôles précis : titres, texte, formules et annotations.
- Refaire le logo avec « apprendre » manuscrit en rouge, masqué sous 480 px.
- Recomposer uniquement l’accueil : nouveau titre souligné au stylo, surtitre, deux boutons et promesses sur une ligne.
- Remplacer l’illustration par un téléphone montrant la correction détaillée demandée.
- Jouer la démonstration une fois au chargement, proposer « Rejouer la démo » et supprimer les mouvements si l’utilisateur les désactive.
- Conserver strictement les textes des pages Exercices et Contact ainsi que toute la logique du chat.

## Détails techniques
- Le papier quadrillé et toutes les animations seront réalisés en CSS/SVG, sans image ni bibliothèque supplémentaire.
- La démonstration du téléphone sera un composant React autonome avec une séquence CSS contrôlée par un bouton.
- Le passage en deux colonnes se fera à 880 px exactement.
- Les couleurs seront centralisées dans les variables du thème, y compris les trois matières et le rouge réservé aux annotations/corrections.
- Les fichiers ajoutés pour la demande d’animations abandonnée seront retirés avant la validation.

## Vérification
- Contrôler l’accueil à 448 px et au-delà de 880 px.
- Contrôler que la démo se rejoue et reste entièrement visible au repos.
- Contrôler le mode de réduction des animations.
- Vérifier que les pages Exercices et Contact conservent leurs textes et que le chat reste fonctionnel.
