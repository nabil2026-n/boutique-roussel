# Ticket 10 — Ancienne sauvegarde de panier et affichage « NaN € »

## 1. Symptôme

Un ancien panier sauvegardé en V1 peut provoquer l'affichage de « NaN € » dans le panier V2.

## 2. Étapes de reproduction et limite des données disponibles

Les véritables données V1 n'étaient pas disponibles. Le cas exact de « NaN € » n'a donc pas pu être reproduit avec l'ancienne sauvegarde réelle. La valeur de `localStorage` montrée pendant le diagnostic était une sauvegarde V2 vide :

```json
{
  "version": 2,
  "lignes": [],
  "codePromo": ""
}
```

Cette valeur ne reproduit pas le symptôme. Pour vérifier ce cas sans fabriquer une ancienne structure, il aurait fallu obtenir une sauvegarde V1 réelle.

## 3. Prompt de diagnostic retrouvé

Le prompt initial disponible dans l'historique demandait d'examiner `js/stockage.js` et `js/panier.js`, d'identifier la structure V2, de rechercher les indices de la structure V1, d'expliquer comment reproduire le problème sans inventer de données et de vérifier si le chargeur remplaçait ou ignorait les anciennes données. Il précisait de ne rien modifier et de ne pas proposer encore de correction.

Une demande de suivi a ensuite précisé le cahier des charges : les paniers V1 ne sont pas migrés, et l'analyse devait expliquer le comportement attendu d'une sauvegarde V1 ou sans version, le risque du repli `donnees.lignes || donnees`, une correction sans migration et les précautions contre la perte des données. Ces descriptions résument les demandes disponibles et ne sont pas présentées comme des citations garanties mot pour mot.

## 4. Hypothèses et diagnostic

### Hypothèses proposées

- **Une ancienne structure pourrait être transmise au calculateur V2 :** `chargerPanier()` utilisait `donnees.lignes || donnees` sans contrôler le numéro de version.
- **Une quantité manquante ou non numérique pourrait produire `NaN` :** `prixLigne()` multiplie le prix unitaire par `ligne.quantite`.
- **Une donnée non conforme à un tableau pourrait provoquer une autre erreur :** `sousTotal()` appelle `reduce()` sur les lignes. Cette piste explique un risque d'incompatibilité, mais pas nécessairement l'affichage de `NaN`.

Ces hypothèses ne permettent pas d'identifier la structure réelle des paniers V1.

## 5. Vérifications effectuées

### Faits vérifiés dans le code

- Avant correction, `chargerPanier()` ne vérifiait pas `version` et utilisait le repli `donnees.lignes || donnees`.
- La structure attendue en V2 est une enveloppe `{ version, lignes, codePromo }`, où chaque ligne de panier utilise `{ bouquetId, options, quantite }`.
- `prixLigne()` multiplie le prix unitaire par `ligne.quantite`; une quantité manquante ou non numérique est donc un risque de calcul invalide :

```js
return prixUnitaire(ligne) * ligne.quantite;
```

- `sousTotal()` utilise `reduce()` sur les lignes.

### Informations non vérifiables

La sauvegarde V1 réelle n'étant pas disponible, il n'a pas été possible de vérifier ses champs, de confirmer lequel pourrait manquer, ni de confirmer que la cause précise de `NaN` était une quantité absente ou non numérique.

## 6. Cause

La cause exacte de l'affichage « NaN € » n'a pas été confirmée. Le défaut de validation de version et l'acceptation d'une structure arbitraire constituaient un risque réel d'incompatibilité, mais les informations disponibles ne prouvent pas la forme des données V1 ni le champ qui aurait produit `NaN`.

## 7. Correction appliquée

Dans `js/stockage.js`, `chargerPanier()` accepte uniquement une sauvegarde avec `version === VERSION` et `lignes` sous forme de tableau. Une sauvegarde ancienne, sans version ou invalide est ignorée en mémoire et signalée par `sauvegardeProtegee`.

Dans `js/app.js`, cet état protège `localStorage` contre l'écrasement par le rafraîchissement initial ou par un simple changement de code postal ou de code promo. La protection est désactivée dans `quandAjoute()` et `quandActionPanier()` avant le rafraîchissement, ce qui autorise alors l'enregistrement du panier courant au format V2.

## 8. Évolution de la stratégie proposée

La première proposition consistait à éviter l'écrasement lors du seul rafraîchissement initial. Après examen de tous les appels à `rafraichir()`, la stratégie a été précisée : garder une protection d'état tant qu'aucune action sur le panier n'a eu lieu, puis la désactiver à l'ajout ou à une action sur une ligne. Cette approche protège également la sauvegarde V1 lors des rafraîchissements dus au code postal ou à la soumission d'un code promo. La stratégie affinée a été appliquée. Aucune proposition de l'IA n'est documentée comme ayant été rejetée.

## 9. Tests après correction

Les tests rapportés ont réussi :

- Une sauvegarde temporaire de version 1 est conservée après rechargement de la page.
- Après l'ajout d'un bouquet, une sauvegarde de version 2 est enregistrée avec une ligne.

Ces tests vérifient la protection et la création d'une sauvegarde V2; ils ne reproduisent pas l'affichage « NaN € » à partir des véritables données V1, qui étaient indisponibles.

## 10. Décision technique

Aucune migration des paniers V1 n'est effectuée. Les anciennes données sont ignorées pour l'affichage du panier et préservées dans `localStorage` jusqu'à une modification réelle du panier qui crée une nouvelle sauvegarde V2.

## 11. Réponse proposée à Madame Roussel

Bonjour Madame Roussel,

Les anciens paniers ne sont pas repris automatiquement par la nouvelle version. Pour éviter de perdre les données déjà enregistrées, elles restent conservées dans votre navigateur jusqu'à ce qu'un nouveau panier soit créé ou modifié. À ce moment-là, la nouvelle version enregistre le panier dans son propre format.

Bien cordialement,

L'équipe de la boutique
