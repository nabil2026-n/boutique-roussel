# Ticket 2 — Le bouton « + » augmente la quantité de plusieurs unités

## Symptôme

Un clic sur le bouton « + » du panier augmente la quantité de plusieurs unités au lieu d'une seule. Le nombre d'unités ajoutées semble augmenter à chaque clic.

## Étapes de reproduction

1. Ajouter un bouquet au panier.
2. Cliquer sur « + » une fois, puis observer la quantité.
3. Répéter le clic et observer si la quantité ajoutée augmente.

## Prompt de diagnostic utilisé

« Pour le ticket 2, le bouton « + » du panier augmente la quantité de plusieurs unités au lieu d'une seule. Le nombre d'unités ajoutées semble augmenter à chaque clic.

Analyse le code responsable de la gestion du bouton « + » et de la modification des quantités dans le panier.

**Avant de proposer une correction :**
1. Donne-moi plusieurs hypothèses expliquant ce comportement.
2. Pour chaque hypothèse, indique le fichier et la fonction concernés.
3. Explique comment vérifier chaque hypothèse dans le navigateur (console, breakpoints, événements) et dans le code.
4. Vérifie notamment si des écouteurs d'événements sont ajoutés plusieurs fois.
5. Ne modifie aucun fichier.
6. Ne propose aucune correction pour le moment. »

## Hypothèses proposées par l'IA

Ces pistes étaient des hypothèses à examiner, pas toutes des causes confirmées :

- **Accumulation d'écouteurs `click` :** `afficherPanier()` dans `js/affichage.js` ajoute un écouteur sur `#panier-liste`; `rafraichir()` dans `js/app.js` rappelle `afficherPanier()`.
- **Plusieurs appels à la modification de quantité :** `quandActionPanier()` dans `js/app.js` transmet un écart de `1` à `changerQuantite()` dans `js/panier.js`. Plusieurs appels lors d'un clic pourraient produire plusieurs incréments.
- **Chargement ou initialisation répétée de l'application :** possibilité à vérifier dans `index.html` et dans l'appel à `demarrer()` dans `js/app.js`.
- **Plusieurs événements déclenchés pour une action physique :** possibilité à vérifier avec les points d'arrêt d'événements dans le navigateur.

## Vérifications réalisées

### Faits vérifiés dans le navigateur

- Après le chargement initial, `#panier-liste` possède **1 écouteur `click`**.
- Après un seul clic sur « + », `#panier-liste` possède **4 écouteurs `click`**.

### Faits vérifiés dans le code

- `afficherPanier()` dans `js/affichage.js` ajoute un écouteur `click` à la liste du panier.
- `rafraichir()` dans `js/app.js` rappelle `afficherPanier()`.
- Le callback de cet écouteur appelle `surAction` pour l'action et l'index du bouton sélectionné.
- Pour l'action « + », `quandActionPanier()` appelle `changerQuantite(index, 1)`. Cette fonction, dans `js/panier.js`, ajoute l'écart reçu à la quantité.

## Cause racine

Les appels répétés à `afficherPanier()` ajoutaient de nouveaux écouteurs `click` au même élément `#panier-liste`. Les anciens écouteurs restaient attachés à la liste lorsque ses éléments enfants étaient remplacés. Un seul clic pouvait donc déclencher plusieurs traitements.

## Correction appliquée

Dans `js/affichage.js` uniquement :

- ajout des variables de module `listePanierEcoutee` et `surActionPanierCourante`;
- ajout de `gererClicPanier()` comme gestionnaire nommé;
- mise à jour de `surActionPanierCourante` à chaque appel de `afficherPanier()`;
- ajout de l'écouteur seulement lorsque la liste n'est pas encore l'élément écouté.

Les boutons conservent leurs attributs `data-action` et `data-index`; le gestionnaire transmet ces valeurs au callback courant.

## Résultats des tests

### Avant correction

- Le navigateur indiquait **1 écouteur** après le chargement et **4 écouteurs** après un seul clic sur « + ».
- Les tests séparés des boutons « − » et « Supprimer » avant correction ne sont pas documentés ici.

### Après correction

- Après actualisation de la page, `#panier-liste` avait **1 écouteur `click`**.
- Après plusieurs clics sur « + » et plusieurs rafraîchissements du panier, il y avait toujours **1 écouteur `click`**.
- Cinq clics sur « + » ont augmenté la quantité de **5 unités exactement**.
- Le bouton « − » a correctement diminué la quantité d'une unité.
- Le bouton « Supprimer » a correctement supprimé la ligne sélectionnée.
- **Test de régression du ticket 1 :** le code promo `noel10` en minuscules a été accepté.
