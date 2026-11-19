# Ticket 8 — Le créneau de livraison affiché ne correspond pas au choix

## 1. Symptôme

Le client sélectionne « Après-midi », mais la confirmation de commande affiche toujours « Matin ».

## 2. Étapes de reproduction avant correction

1. Ajouter un bouquet au panier.
2. Saisir un code postal desservi et choisir un jour de livraison.
3. Sélectionner le créneau « Après-midi ».
4. Cliquer sur « Commander ».
5. Constater que la confirmation affiche « Matin ».

## 3. Hypothèses proposées par l'IA

Ces pistes étaient des hypothèses à examiner avant vérification :

- La fonction de confirmation pourrait lire le premier bouton radio plutôt que celui qui est sélectionné.
- L'état sélectionné du bouton radio pourrait ne pas être mis à jour comme attendu dans le navigateur.
- Les données ou leur ordre pourraient associer les créneaux à des libellés différents de ceux attendus.

## 4. Vérification dans le navigateur

Après avoir sélectionné « Après-midi », l'expression suivante a été exécutée dans la console :

```js
document.querySelector('input[name="moment"]:checked')?.value
```

Elle a renvoyé :

```text
"apres-midi"
```

Le navigateur indique donc bien que le créneau « Après-midi » est sélectionné.

## 5. Cause racine

Dans `commander()` de `js/app.js`, le code utilisait :

```js
document.querySelector("input[name=moment]")
```

Cette sélection récupérait le premier radio du groupe, « Matin », sans vérifier qu'il était sélectionné.

## 6. Correction appliquée

Dans `js/app.js`, `commander()` récupère désormais le radio sélectionné :

```js
const moment = document.querySelector('input[name="moment"]:checked');
```

Une vérification arrête la commande et affiche un message si aucun créneau n'est sélectionné :

```js
if (!moment) {
  message.textContent = "Choisissez un moment de livraison.";
  return;
}
```

## 7. Test après correction

Le test rapporté après correction a réussi : pour une commande avec le créneau « Après-midi », la confirmation affiche « après-midi ».

## 8. Non-régression

« Matin » reste le choix par défaut : `afficherMoments()` coche toujours le premier radio du groupe.

## 9. Décision technique

La correction est limitée à la récupération du créneau sélectionné et à la vérification de son absence dans `commander()`. Elle permet d'afficher le choix réellement effectué, sans changer l'ordre des créneaux ni le choix par défaut.
