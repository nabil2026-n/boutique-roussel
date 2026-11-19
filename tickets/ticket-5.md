# Ticket 5 — La suppression d'une ligne retire aussi les suivantes

## 1. Symptôme observé

Lorsqu'on clique sur « Supprimer » sur une ligne du panier, cette ligne et toutes les lignes suivantes sont supprimées.

## 2. Étapes de reproduction

1. Ajouter plusieurs lignes distinctes au panier.
2. Cliquer sur « Supprimer » pour une ligne qui n'est pas la dernière.
3. Constater que cette ligne ainsi que les lignes suivantes disparaissent.

## 3. Prompt de diagnostic utilisé

« Analyse le Ticket 5 : lorsqu’on clique sur « Supprimer » sur une ligne du panier, cette ligne et toutes les lignes suivantes sont supprimées.

1. Examine le code concerné, notamment `supprimerLigne()` dans `js/panier.js` et son appel depuis `app.js`.
2. Propose plusieurs hypothèses expliquant ce comportement.
3. Pour chaque hypothèse, indique les éléments précis du code qui la soutiennent ou l’écartent.
4. Identifie la cause la plus probable et explique-la.

**Ne modifie aucun fichier. Ne propose pas encore de correction.** J’attends d’abord le diagnostic et les hypothèses. »

## 4. Hypothèses examinées

Ces pistes ont été examinées pendant le diagnostic; elles ne sont pas toutes des causes confirmées :

- **La fonction de suppression retire les lignes suivantes :** hypothèse directement soutenue par l'appel à `lignes.splice(index)` dans `supprimerLigne()`.
- **Un mauvais index est transmis :** piste examinée dans le chemin entre le bouton « Supprimer », `gererClicPanier()` dans `js/affichage.js` et `quandActionPanier()` dans `js/app.js`. Les fonctions lisent et transmettent l'index associé au bouton; le code consulté n'indique pas de décalage d'index.
- **Plusieurs écouteurs de clic déclenchent plusieurs suppressions :** piste examinée dans `afficherPanier()`. Le code actuel conserve un seul écouteur sur le même élément, ce qui écarte l'accumulation comme explication principale dans le fonctionnement normal.

## 5. Vérifications dans le code

- Dans `js/affichage.js`, le bouton « Supprimer » est créé avec l'index de la ligne.
- `gererClicPanier()` lit l'action et l'index, puis appelle le callback fourni.
- Dans `js/app.js`, `quandActionPanier()` appelle `supprimerLigne(index)` pour l'action `"supprimer"`, puis rafraîchit l'affichage.
- Dans `js/panier.js`, `changerQuantite(index, ecart)` appelle également `supprimerLigne(index)` lorsque la quantité devient nulle ou négative.
- Avant correction, `supprimerLigne(index)` utilisait `lignes.splice(index)` sans préciser le nombre d'éléments à retirer.

## 6. Cause racine

`lignes.splice(index)` supprime tous les éléments du tableau à partir de `index` jusqu'à la fin. Cela explique que la ligne choisie et toutes les suivantes soient supprimées.

## 7. Correction appliquée

Dans `js/panier.js`, l'appel a été remplacé par :

```js
lignes.splice(index, 1);
```

Le deuxième argument indique de supprimer un seul élément à cette position.

## 8. Compatibilité avec `changerQuantite()`

La correction reste compatible avec `changerQuantite()`. Lorsque la quantité d'une ligne atteint zéro ou moins, cette fonction passe son index à `supprimerLigne()`. La fonction retire alors uniquement cette ligne; les autres lignes du panier restent présentes.

## 9. Tests dans le navigateur

Les tests suivants ont été effectués et réussis :

- Suppression du deuxième élément : seul l'élément sélectionné a été supprimé.
- Suppression du premier élément : seul l'élément sélectionné a été supprimé.
- Clic sur « − » lorsque la quantité atteint zéro : seule la ligne concernée a été supprimée.

## 10. Décision technique

La correction a été limitée à l'ajout du nombre `1` au deuxième paramètre de `splice()`. Elle conserve la gestion existante des index et le comportement de suppression déclenché par `changerQuantite()`, tout en empêchant la suppression des lignes suivantes.
