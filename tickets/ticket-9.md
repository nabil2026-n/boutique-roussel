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

## 3. Hypothèses proposées par l'IA avant correction

Ces pistes étaient des hypothèses à examiner avant vérification :

- **Conversion entre date locale et UTC :** la construction d'une date locale, suivie de `toISOString()`, pourrait faire reculer d'un jour la date enregistrée dans certains fuseaux horaires.
- **Interprétation de la date simulée et du délai :** le paramètre URL `maintenant` ou la règle avant/après l'heure limite pourrait produire un premier jour inattendu.
- **Exclusion des dimanches :** la règle des jours fermés ou la vérification avec `getDay()` pourrait ne pas exclure le dimanche comme attendu.
- **Génération des six jours disponibles :** la boucle pourrait ajouter à tort un jour fermé à la liste.

## 4. Vérification dans la console

Pour le lundi 16 novembre 2026 à minuit en heure locale, les valeurs suivantes ont été observées :

- `toString()` affiche le lundi 16 novembre.
- `toISOString()` affiche `2026-11-15T23:00:00.000Z`.
- `toISOString().slice(0, 10)` produit `2026-11-15`.

La date ainsi stockée est ensuite réinterprétée et affichée comme le dimanche 15 novembre.

## 5. Cause racine

Dans `joursDeLivraison()` de `js/livraison.js`, la conversion avec `toISOString()` transformait la date locale en date UTC. Dans le fuseau utilisé lors de la reproduction, cette conversion faisait correspondre le lundi 16 novembre à la veille en UTC, le dimanche 15 novembre.

## 6. Correction appliquée

Dans `joursDeLivraison()`, la chaîne `YYYY-MM-DD` est maintenant construite à partir des composants de date locaux avec `getFullYear()`, `getMonth()` et `getDate()`, sans conversion UTC avec `toISOString()`.

## 7. Test après correction

Avec la même URL `?maintenant=2026-11-14T19:00:00`, les six jours proposés vont du lundi 16 au samedi 21 novembre, sans dimanche.

## 8. Non-régression

La correction ne modifie ni le délai appliqué après 14h ni l'exclusion des dimanches. Le délai après l'heure limite et la règle d'exclusion des jours fermés restent inchangés.

## 9. Décision technique

La date calendaire locale est conservée lors de son formatage en `YYYY-MM-DD`. Cela évite le décalage constaté entre l'heure locale et UTC, tout en maintenant les règles existantes de livraison.
