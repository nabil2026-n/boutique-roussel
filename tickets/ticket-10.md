# Ticket 10 — Ancienne sauvegarde de panier et affichage « NaN € »

## 1. Symptôme

Un ancien panier sauvegardé en V1 peut provoquer l'affichage de « NaN € » dans le panier V2.

## 2. Diagnostic

Dans `js/stockage.js`, `chargerPanier()` acceptait les données sauvegardées sans vérifier leur version et utilisait le repli `donnees.lignes || donnees`. Une ancienne structure pouvait donc être transmise au panier de la V2.

Dans `js/prix.js`, `prixLigne()` multiplie le prix unitaire par `ligne.quantite`. Le calcul dépend donc d'une quantité numérique :

```js
return prixUnitaire(ligne) * ligne.quantite;
```

## 3. Cause

La cause exacte de `NaN` n'a pas pu être confirmée, car les véritables données V1 n'étaient pas disponibles pour examen ou reproduction. La structure acceptée sans validation et la dépendance du calcul à `quantite` numérique indiquaient toutefois un risque d'incompatibilité.

## 4. Correction appliquée

Dans `js/stockage.js`, `chargerPanier()` accepte uniquement une sauvegarde avec `version === VERSION` et `lignes` sous forme de tableau. Une sauvegarde ancienne, sans version ou invalide est ignorée en mémoire et signalée par `sauvegardeProtegee`.

Dans `js/app.js`, cet état protège `localStorage` contre l'écrasement lors du rafraîchissement initial. La protection est désactivée lorsqu'un ajout ou une action modifie le panier; les rafraîchissements ultérieurs peuvent alors sauvegarder les données V2.

## 5. Tests après correction

Les tests suivants ont été effectués et réussis :

- Une sauvegarde temporaire de version 1 est conservée après rechargement de la page.
- Après l'ajout d'un bouquet, une sauvegarde de version 2 est enregistrée avec une ligne.

## 6. Décision technique

Aucune migration des paniers V1 n'est effectuée. Les anciennes données sont ignorées pour l'affichage du panier et préservées dans `localStorage` jusqu'à une modification réelle du panier qui crée une nouvelle sauvegarde V2.
