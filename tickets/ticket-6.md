# Ticket 6 — Livraison payante au seuil de gratuité

## 1. Symptôme

La livraison reste facturée **5,90 €** alors que le sous-total affiché est de **60,00 €**.

## 2. Étapes de reproduction

1. Ajouter des produits pour obtenir un sous-total affiché exactement à **60,00 €**.
2. Saisir le code postal `37000`.
3. Constater que la livraison est encore facturée **5,90 €** au lieu d'être gratuite.

## 3. Diagnostic et hypothèses examinées

### Prompt de diagnostic retrouvé

Le prompt suivant est disponible dans l'historique de l'échange :

> Analyse le Ticket 6 : le sous-total affiché est de 60,00 €, mais la livraison reste facturée 5,90 €. Le résultat attendu est une livraison gratuite dès 60,00 €, y compris exactement 60,00 €.
>
> Examine notamment `js/livraison.js`, `js/app.js` et les données de livraison. Propose plusieurs hypothèses, vérifie comment le seuil est comparé et si le calcul utilise le montant avant ou après remise, puis identifie la cause la plus probable avec les lignes concernées. Ne modifie aucun fichier et ne propose pas encore de correction.

Cette citation restitue la demande de diagnostic disponible; elle n'est pas présentée comme une transcription garantie mot pour mot.

### Hypothèses examinées

- **Précision des nombres décimaux :** le montant numérique pourrait être légèrement inférieur à 60 malgré l'affichage à deux décimales. C'était l'explication avancée et la valeur a été vérifiée dans la console, mais les relevés consignés sont contradictoires (voir ci-dessous).
- **Montant après remise :** cette piste a été examinée dans le code. `app.js` calcule le sous-total, calcule la remise séparément et transmet le sous-total avant remise à `fraisLivraison()`. Le calcul après remise n'explique donc pas le comportement décrit dans le code consulté.
- **Seuil ou zone de livraison :** le code et `data/livraison.json` ont été examinés : le seuil est 60 € et la zone de Tours inclut `37000` avec 5,90 € de frais.

## 4. Vérifications effectuées

### Faits vérifiés dans le code

- `data/livraison.json` fixe `seuilGratuite` à `60`; la zone de Tours contient le code postal `37000` et des frais de `5.9`.
- `js/livraison.js`, dans `fraisLivraison()`, vérifie le code postal, puis compare le montant au seuil avec `montant >= regles.seuilGratuite`.
- `js/prix.js`, dans `sousTotal()`, additionne les prix des lignes du panier.
- `js/app.js`, dans `rafraichir()`, passe à `fraisLivraison()` la variable `montant`, calculée avant la remise. La remise est calculée séparément.

### Information rapportée sur la vérification navigateur

L'historique contient un relevé rapporté par la cliente : avec deux articles, la valeur observée de `montant` était `119.99999999999999`, décrite comme environ `59.999999999999995 €` par article.

La fiche précédente mentionnait aussi `59.999999999999993` comme résultat de `montant.toPrecision(17)` pour un sous-total affiché de 60,00 €. Cette valeur précise n'est pas étayée par le relevé rapporté dans l'historique. Les deux valeurs ne sont pas cohérentes entre elles; il n'est donc pas possible de retenir une valeur numérique exacte sous 60 comme fait vérifié. Le relevé à `119.99999999999999` est supérieur à 60 et, à lui seul, ne confirme pas l'échec de `montant >= 60`.

## 5. Cause racine

La précision des nombres décimaux JavaScript a été identifiée comme cause possible et a motivé la correction au centime. Toutefois, les données disponibles ne confirment pas précisément que la valeur transmise lors du symptôme était inférieure à 60 : le relevé chiffré consigné dans l'historique est contradictoire avec la valeur précédemment inscrite dans cette fiche. La cause numérique exacte du cas de reproduction reste donc à confirmer.

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

La comparaison au centime près est la correction appliquée pour traiter l'effet de précision signalé, sans modifier le seuil métier ni l'utilisation du sous-total avant remise. L'historique ne documente pas de proposition alternative de l'IA rejetée ou modifiée pour ce ticket.

## 10. Réponse proposée à Madame Roussel

Bonjour Madame Roussel,

Nous avons vérifié le calcul de la livraison gratuite au seuil de 60 €. Une difficulté de précision dans le calcul informatique a été identifiée comme une cause possible, et le calcul a été adapté pour comparer les montants au centime. Le seuil reste fixé à 60 €, et il est toujours évalué avant l'application d'une remise.

Bien cordialement,

L'équipe de la boutique

## 11. Éléments restant à confirmer

La valeur exacte de `montant` lors du cas qui affichait 60,00 € n'est pas établie de façon cohérente dans l'historique. La fiche ne peut donc pas confirmer à partir des informations disponibles que cette valeur était précisément inférieure à 60 avant la correction.
