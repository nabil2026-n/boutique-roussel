# Ticket 6 — Livraison payante au seuil de gratuité

## 1. Symptôme

La livraison reste facturée **5,90 €** alors que le sous-total affiché est de **60,00 €**.

## 2. Étapes de reproduction

1. Ajouter des produits pour obtenir un sous-total affiché exactement à **60,00 €**.
2. Saisir le code postal `37000`.
3. Constater que la livraison est encore facturée **5,90 €** au lieu d'être gratuite.

## 3. Diagnostic et hypothèses examinées

Les éléments du code indiquaient que :

- le seuil de gratuité est chargé depuis `data/livraison.json`;
- `fraisLivraison()` compare le montant reçu au seuil;
- `app.js` calcule le sous-total, calcule séparément une éventuelle remise, puis transmet le sous-total à `fraisLivraison()`.

**Hypothèse examinée :** le sous-total affiché à deux décimales pourrait être légèrement inférieur à 60 en valeur numérique, en raison de la précision des nombres décimaux JavaScript. Cette hypothèse a été vérifiée dans le navigateur.

## 4. Vérifications effectuées

### Faits vérifiés dans le code

- `data/livraison.json` fixe `seuilGratuite` à `60`; la zone de Tours contient le code postal `37000` et des frais de `5.9`.
- `js/livraison.js`, dans `fraisLivraison()`, vérifie le code postal, puis compare le montant au seuil avec `montant >= regles.seuilGratuite`.
- `js/prix.js`, dans `sousTotal()`, additionne les prix des lignes du panier.
- `js/app.js`, dans `rafraichir()`, passe à `fraisLivraison()` la variable `montant`, calculée avant la remise. La remise est calculée séparément.

### Fait vérifié dans le navigateur

Avec un sous-total affiché de **60,00 €**, l'expression `montant.toPrecision(17)` a retourné :

```text
59.999999999999993
```

Cette valeur est strictement inférieure à `60`.

## 5. Cause racine

La représentation des nombres décimaux en JavaScript peut produire une valeur légèrement différente du montant attendu. Dans ce cas, le montant interne était `59.999999999999993`, même si l'interface affichait `60,00 €`. La comparaison directe avec le seuil `60` échouait donc.

## 6. Correction appliquée

Dans `js/livraison.js`, la comparaison du montant et du seuil a été effectuée au centime près :

```js
Math.round(montant * 100) >= Math.round(regles.seuilGratuite * 100)
```

La comparaison porte ainsi sur des montants arrondis aux centimes, l'unité utilisée pour les prix en euros.

## 7. Règles de livraison conservées

- Le seuil de gratuité reste fixé à **60 €** dans les données.
- Le montant transmis à `fraisLivraison()` reste le sous-total avant remise.
- La vérification de zone, les frais hors seuil et les autres règles de livraison n'ont pas été modifiés.

## 8. Tests après correction

Les tests suivants ont été effectués et réussis :

- Sous-total de **60,00 €** : livraison gratuite.
- Sous-total de **59,99 €** : livraison facturée selon les frais de la zone.

## 9. Décision technique

La comparaison au centime près corrige l'effet de précision observé au seuil sans modifier le seuil métier ni l'utilisation du sous-total avant remise. Les autres règles de livraison restent inchangées.
