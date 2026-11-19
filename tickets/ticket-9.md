# Ticket 9 — Le dimanche est proposé comme jour de livraison

## 1. Symptôme

Le samedi 14 novembre 2026 à 19h00, le site proposait le dimanche 15 novembre comme jour de livraison.

## 2. Étapes de reproduction

1. Ouvrir la boutique avec l'URL de simulation :

   ```text
   ?maintenant=2026-11-14T19:00:00
   ```

2. Consulter les jours de livraison proposés.
3. Constater que le dimanche 15 novembre apparaît dans la liste.

## 3. Prompt de diagnostic retrouvé

Le prompt disponible dans l'historique demandait plusieurs hypothèses classées par probabilité, l'examen de `joursDeLivraison()`, du délai avant/après 14h, de l'exclusion des dimanches, de la génération des six jours et du paramètre `?maintenant=`. Il demandait des vérifications navigateur ou code, sans modification ni correction. Cette description résume la demande disponible.

## 4. Hypothèses proposées par l'IA avant correction

Ces pistes étaient des hypothèses à examiner avant vérification :

- **La plus probable — conversion locale/UTC :** une date construite en heure locale puis convertie par `toISOString()` peut devenir la veille en UTC, selon le fuseau.
- **Moins probable — date simulée ou délai :** `maintenant()` et la limite de 14h pouvaient conduire à un premier jour candidat inattendu.
- **Moins probable — exclusion des dimanches :** la donnée des jours fermés ou le test de `getDay()` pouvait être en cause.
- **Moins probable — génération des six jours :** la boucle pouvait éventuellement ajouter un jour fermé malgré le filtrage.

## 5. Vérifications effectuées

### Code et données

- `data/livraison.json` indique `heureLimite: 14` et `joursFermes: [0]` (dimanche).
- `joursDeLivraison()` utilise un délai de deux jours lorsque l'heure locale est à partir de 14h, avance les dates avec le calendrier local, puis écarte les jours dont `getDay()` est dans `joursFermes`.
- `app.js` appelle `joursDeLivraison(maintenant())`; `maintenant()` lit le paramètre URL `maintenant`.
- Avant correction, le jour admissible local était converti en chaîne avec `toISOString().slice(0, 10)`.

### Console et navigateur

Pour le scénario et le fuseau effectivement reproduits, le lundi 16 novembre 2026 à minuit en heure locale donnait :

- `toString()` affiche le lundi 16 novembre.
- `toISOString()` affiche `2026-11-15T23:00:00.000Z`.
- `toISOString().slice(0, 10)` produit `2026-11-15`.

Cette chaîne est ensuite réinterprétée et affichée comme le dimanche 15 novembre. L'historique confirme ce décalage dans le fuseau utilisé pour la reproduction; il ne documente pas de test dans d'autres fuseaux horaires.

## 6. Cause racine

Dans `joursDeLivraison()` de `js/livraison.js`, la conversion avec `toISOString()` transformait la date locale en date UTC. Dans le fuseau utilisé lors de la reproduction, cette conversion faisait correspondre le lundi 16 novembre à la veille en UTC, le dimanche 15 novembre.

## 7. Correction appliquée

Dans `joursDeLivraison()`, la chaîne `YYYY-MM-DD` est maintenant construite à partir des composants de date locaux avec `getFullYear()`, `getMonth()` et `getDate()`, sans conversion UTC avec `toISOString()`.

## 8. Test après correction

Avec la même URL `?maintenant=2026-11-14T19:00:00`, les six jours proposés vont du lundi 16 au samedi 21 novembre, sans dimanche.

## 9. Non-régression

La correction ne modifie ni le délai appliqué après 14h ni l'exclusion des dimanches. Le délai après l'heure limite et la règle d'exclusion des jours fermés restent inchangés.

## 10. Décision technique

La date calendaire locale est conservée lors de son formatage en `YYYY-MM-DD`. Cela évite le décalage constaté entre l'heure locale et UTC, tout en maintenant les règles existantes de livraison.

La proposition de formater les composants de date locaux a été retenue et appliquée. Aucune proposition de l'IA n'est documentée comme ayant été écartée. La vérification après correction concerne l'URL de reproduction et le fuseau utilisé; aucun résultat n'est affirmé pour d'autres fuseaux ou scénarios.

## 11. Réponse proposée à Madame Roussel

Bonjour Madame Roussel,

Le calendrier proposait par erreur le dimanche dans le scénario vérifié. Nous avons corrigé le décalage de date : avec les mêmes conditions, les jours proposés vont maintenant du lundi au samedi, sans dimanche.

Bien cordialement,

L'équipe de la boutique
