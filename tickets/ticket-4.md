# Ticket 4 — La taille d'une composition modifie une ligne déjà ajoutée

## 1. Symptôme initial

Après avoir ajouté « Pivoine poudrée » en taille « Petit », le premier article du panier passe à la taille « Grand » lorsque « Grand » est sélectionné dans une nouvelle composition.

## 2. Étapes de reproduction

1. Ouvrir la composition de « Pivoine poudrée » et choisir « Petit ».
2. Ajouter le bouquet au panier.
3. Ouvrir une nouvelle composition de « Pivoine poudrée ».
4. Sélectionner « Grand » sans encore cliquer sur « Ajouter ».
5. Constater que la taille du premier article du panier est déjà passée à « Grand ».

## 3. Prompt de diagnostic utilisé

« Pour le ticket 4, voici les faits confirmés :

- `js/composition.js` utilise un objet `options` unique au niveau du module.
- `ouvrirComposition()` et `lireFormulaire()` modifient directement cet objet.
- `js/panier.js`, dans `ajouterAuPanier()`, stocke actuellement `options` directement dans la ligne du panier.
- Dans le navigateur, après avoir ajouté « Pivoine poudrée » en taille « Petit », le premier article passe à « Grand » dès que je sélectionne « Grand » dans une nouvelle composition, avant le deuxième clic sur « Ajouter ».
- `memesOptions()` compare correctement taille, vase, carte et message.

Propose une correction minimale pour supprimer le partage de référence entre le formulaire et les lignes du panier.

Contraintes :
1. Préserver le comportement de fusion des compositions réellement identiques.
2. Ne modifier que le strict nécessaire.
3. Expliquer précisément la correction et ses conséquences.
4. Ne modifier aucun fichier pour le moment.
5. Présenter le diff proposé avant toute modification. »

## 4. Hypothèses proposées par l'IA

Ces hypothèses initiales ont été examinées; elles ne doivent pas être confondues avec les faits confirmés :

- **Partage d'une référence mutable :** le formulaire et une ligne du panier pourraient référencer le même objet `options`; modifier la composition changerait alors les options déjà ajoutées.
- **Fusion de compositions identiques :** `memesOptions()` et `ajouterAuPanier()` pourraient fusionner des ajouts si leurs propriétés sont identiques, ce qui pourrait ne pas correspondre à l'observation de deux lignes distinctes.
- **Panier restauré depuis le stockage :** un panier chargé depuis `localStorage` pourrait avoir des objets d'options indépendants des options du formulaire et produire un comportement différent.

## 5. Vérifications effectuées dans le code et dans le navigateur

### Faits vérifiés dans le code

- `js/composition.js` déclare un objet `options` unique au niveau du module.
- `ouvrirComposition()` réinitialise directement ses propriétés, et `lireFormulaire()` les met directement à jour selon les choix du formulaire.
- `ajouter()` transmet cet objet à `quandAjoute()`, puis `js/app.js` le transmet à `ajouterAuPanier()` dans `js/panier.js`.
- Avant correction, `ajouterAuPanier()` stockait directement `options` dans la ligne du panier.
- `memesOptions()` compare les valeurs de taille, vase, carte et message.

### Fait vérifié dans le navigateur

- Après un premier ajout en « Petit », la ligne existante passe à « Grand » dès que « Grand » est sélectionné dans une nouvelle composition, avant l'ajout de cette deuxième composition.

## 6. Cause racine

Le formulaire et la ligne du panier partageaient le même objet `options`. Comme le formulaire modifie cet objet lors de la sélection d'une nouvelle composition, les options de l'article déjà ajouté changeaient également.

## 7. Correction appliquée

Dans `js/panier.js`, à la création d'une nouvelle ligne, l'objet d'options est maintenant copié :

```js
lignes.push({ bouquetId, options: { ...options }, quantite: 1 });
```

La ligne conserve ainsi les choix faits au moment de l'ajout au lieu de partager l'objet mutable du formulaire.

## 8. Tests après correction

Les tests suivants ont été effectués et réussis :

- Le premier ajout en « Petit » reste en « Petit » après la sélection de « Grand ».
- Le deuxième ajout en « Grand » crée une ligne distincte.
- Un nouvel ajout identique en « Grand » augmente la quantité de cette ligne à 2.

## 9. Décision technique

La copie superficielle de l'objet `options` lors de la création d'une ligne a été retenue. Ses propriétés sont les valeurs simples taille, vase, carte et message; la copie sépare donc l'état du formulaire de celui enregistré dans le panier.

La logique `memesOptions()` et la fusion des compositions identiques restent inchangées. Des options différentes créent des lignes distinctes, tandis qu'un ajout aux options identiques augmente la quantité de la ligne existante.
