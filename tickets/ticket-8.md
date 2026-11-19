# Ticket 8 — Le créneau de livraison affiché ne correspond pas au choix

## 1. Symptôme

Le client sélectionne « Après-midi », mais la confirmation de commande affiche toujours « Matin ».

## 2. Étapes de reproduction avant correction

1. Ajouter un bouquet au panier.
2. Saisir un code postal desservi et choisir un jour de livraison.
3. Sélectionner le créneau « Après-midi ».
4. Cliquer sur « Commander ».
5. Constater que la confirmation affiche « Matin ».

## 3. Prompt de diagnostic retrouvé

Le prompt disponible dans l'historique demandait d'analyser le parcours complet du créneau — sélection, formulaire, récupération, traitement de la commande et confirmation — de proposer plusieurs hypothèses classées par probabilité et de préciser les vérifications navigateur/code, sans modifier de fichier ni proposer de correction. Cette description résume la demande; elle n'est pas présentée comme une citation mot pour mot.

## 4. Hypothèses proposées par l'IA

Ces pistes étaient des hypothèses à examiner avant vérification :

- **La plus probable :** la fonction de confirmation pourrait lire le premier bouton radio plutôt que celui qui est sélectionné.
- **Moins probable :** l'état sélectionné du bouton radio pourrait ne pas être mis à jour comme attendu dans le navigateur.
- **Moins probable :** les données ou leur ordre pourraient associer les créneaux à des libellés différents de ceux attendus.

## 5. Vérification dans le navigateur

Après avoir sélectionné « Après-midi », l'expression suivante a été exécutée dans la console :

```js
document.querySelector('input[name="moment"]:checked')?.value
```

Elle a renvoyé :

```text
"apres-midi"
```

Le navigateur indique donc bien que le créneau « Après-midi » est sélectionné.

## 6. Cause racine

Dans `commander()` de `js/app.js`, le code utilisait :

```js
document.querySelector("input[name=moment]")
```

Cette sélection récupérait le premier radio du groupe, « Matin », sans vérifier qu'il était sélectionné.

## 7. Correction appliquée

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

## 8. Test après correction

Le test rapporté après correction a réussi : pour une commande avec le créneau « Après-midi », la confirmation affiche « après-midi ».

## 9. Non-régression

« Matin » reste le choix par défaut : `afficherMoments()` coche toujours le premier radio du groupe.

## 10. Décision technique

La correction est limitée à la récupération du créneau sélectionné et à la vérification de son absence dans `commander()`. Elle permet d'afficher le choix réellement effectué, sans changer l'ordre des créneaux ni le choix par défaut.

La proposition de récupération du radio marqué `:checked` et de vérification si aucun créneau n'est sélectionné a été acceptée et appliquée. Aucun test avec absence de sélection n'est documenté. L'historique ne fait état d'aucune proposition de l'IA écartée pour ce ticket.

## 11. Réponse proposée à Madame Roussel

Bonjour Madame Roussel,

Nous avons corrigé l'affichage de la confirmation afin qu'il reprenne le créneau choisi pour la livraison. Le test réalisé avec « Après-midi » confirme que ce choix est maintenant indiqué dans le message de confirmation.

Bien cordialement,

L'équipe de la boutique
