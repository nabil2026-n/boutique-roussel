# Ticket 3 — « Le petit mot » absent du filtre « Merci »

## 1. Symptôme

Le bouquet « Le petit mot » n'apparaissait pas lorsque le filtre d'occasion « Merci » était sélectionné, alors qu'il apparaissait avec le filtre « Toutes ».

## 2. Étapes de reproduction

1. Ouvrir le catalogue.
2. Sélectionner le filtre d'occasion « Merci » et constater que « Le petit mot » est absent.
3. Sélectionner « Toutes » et constater que « Le petit mot » est visible.

## 3. Prompt de diagnostic utilisé

« Pour le ticket 3 :

La bouquet « Le petit mot » n'apparaît pas lorsque le filtre d'occasion « Merci » est sélectionné, alors qu'il apparaît lorsque toutes les occasions sont affichées.

Analyse le fonctionnement du catalogue et du filtrage.

Avant de proposer une correction :
1. Donne-moi plusieurs hypothèses expliquant ce comportement.
2. Indique pour chaque hypothèse le fichier, la fonction et les données concernés.
3. Vérifie notamment la valeur de l'occasion associée au bouquet « Le petit mot » dans data/catalogue.json.
4. Analyse la comparaison entre l'occasion du bouquet et le filtre sélectionné dans le code.
5. Explique comment vérifier chaque hypothèse dans le navigateur et dans le code.
6. Ne modifie aucun fichier.
7. Ne propose aucune correction pour le moment. »

## 4. Hypothèses proposées par l'IA

Ces pistes étaient des hypothèses à examiner avant vérification :

- La valeur de l'occasion pour « Le petit mot » pourrait ne pas correspondre exactement à l'identifiant du filtre, notamment en raison de la casse.
- La valeur transmise par l'événement du filtre pourrait différer de l'identifiant attendu.
- Le navigateur pourrait charger des données différentes de celles du fichier du projet, par exemple depuis une réponse mise en cache.

## 5. Vérifications dans le code et dans le navigateur

### Faits vérifiés

- **Données :** dans `data/catalogue.json`, le tableau d'occasions de « Le petit mot » contient `"Merci"` avec un `M` majuscule.
- **Navigateur :** la valeur du filtre « Merci » est `"merci"` en minuscules.
- **Code :** la comparaison initiale dans `js/affichage.js`, fonction `afficherCatalogue()`, utilisait `bouquet.occasions.includes(occasion)`, une comparaison sensible à la casse.
- **Affichage avant correction :** « Le petit mot » était absent du filtre « Merci » et visible avec « Toutes ».

### Hypothèses non confirmées séparément

Les autres pistes proposées — valeur d'événement différente de celle attendue ou données chargées différentes du fichier — ne sont pas documentées comme ayant fait l'objet de vérifications distinctes. Elles ne sont pas retenues comme cause.

## 6. Cause racine

Il y avait une différence de casse entre `"Merci"` dans `data/catalogue.json` et `"merci"` dans la valeur du filtre. La recherche stricte effectuée par `includes()` ne considérait pas ces chaînes comme identiques.

## 7. Correction appliquée

Dans `js/affichage.js`, fonction `afficherCatalogue()`, la condition de filtre a été modifiée : `includes()` a été remplacé par `some()` avec une comparaison en minuscules via `toLowerCase()`.

La comparaison normalisée permet de faire correspondre `"Merci"` et `"merci"`. Le cas spécial du filtre `"toutes"` reste inchangé.

## 8. Tests après correction

Les tests suivants ont été effectués et réussis :

- Le filtre « Merci » affiche « Le petit mot ».
- Le filtre « Amour » affiche une carte.
- Le filtre « Toutes » affiche les 6 bouquets.

## 9. Décision technique

La correction est appliquée dans `js/affichage.js`, au niveau du filtrage du catalogue. Les données de `data/catalogue.json` et les autres fichiers ne sont pas modifiés pour ce ticket.
