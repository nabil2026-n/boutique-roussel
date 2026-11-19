# Ticket 1 — Code promo insensible à la casse

## Symptôme

`NOEL10` fonctionne sur ordinateur et lorsqu’il est saisi en majuscules sur mobile, mais `noel10` est refusé sur mobile.

## Étapes de reproduction

1. Sur mobile, saisir et tester `NOEL10`.
2. Saisir et tester `noel10`.

## Hypothèses étudiées

- La comparaison dans `js/promo.js` est sensible à la casse.
- `js/promotions.js` contient une autre fonction de traitement des codes promo, mais ce module n’est pas importé par `app.js`.
- Les espaces autour du code peuvent également poser problème.

## Vérifications

Le code a été lu et le comportement a été testé dans le navigateur.

## Cause racine

La comparaison était stricte entre `promo.code` et la saisie, sans normalisation du code saisi.

## Correction

La saisie est normalisée dans `js/promo.js` avec `saisie.trim().toUpperCase()` avant la comparaison.

## Résultats après correction

`NOEL10` et `noel10` sont acceptés.

## Décision technique

Ne pas utiliser `js/promotions.js`, car ce module n’est pas celui utilisé par l’application.

## Prompts IA utilisés

1. « Pour le ticket 1, le code promo `NOEL10` est accepté, mais `noel10` est refusé.

Le cahier des charges indique que les codes promo doivent être insensibles à la casse.

Analyse le code concerné, notamment la gestion et la comparaison des codes promo.

**Avant de proposer une correction :**
1. Donne-moi plusieurs hypothèses expliquant ce comportement.
2. Pour chaque hypothèse, indique le fichier et la fonction concernés.
3. Explique comment vérifier chaque hypothèse dans le navigateur ou dans le code.
4. Ne modifie aucun fichier.
5. Ne propose pas encore de correction. »
2. « Pour le ticket 1, montre-moi les extraits exacts du code actuel, sans modifier aucun fichier :

1. La fonction `appliquerPromo()` complète dans `js/promo.js`.
2. La fonction `appliquerPromo()` dans `js/promotions.js`, si elle existe.
3. L'import de `appliquerPromo` dans `js/app.js`.
4. La fonction `appliquerCode()` dans `js/app.js`.

Pour chaque extrait, indique le numéro de ligne.
Ne propose aucune correction pour le moment. »

## Vérification des hypothèses

- **Comparaison sensible à la casse :** confirmée par la lecture du code et les tests dans le navigateur.
- **`js/promotions.js` non utilisé :** confirmé par la vérification de l’import dans `app.js`.
- **Espaces autour du code :** le code permet d’identifier ce risque, mais il n’a pas été testé séparément dans le navigateur.

## Tests avant correction

- `NOEL10` sur ordinateur : accepté.
- `NOEL10` sur mobile : accepté.
- `noel10` sur mobile : refusé.

## Tests après correction

- `NOEL10` : accepté.
- `noel10` : accepté.

## Proposition IA écartée

La proposition de remplacer l’import dans `app.js` pour utiliser `js/promotions.js` a été rejetée. La correction a été faite dans `js/promo.js`, le module réellement utilisé par l’application et dont le format de retour correspond à l’application actuelle.

## Justification de la correction

La normalisation avec `saisie.trim().toUpperCase()` corrige la cause racine sans changer les règles métier ni le format de retour de la fonction.
