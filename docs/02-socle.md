# Phase 2 · Socle

Livré : projet Astro configuré, tokens, layout, header, pied de page, barre d'action mobile, système de composants, page d'accueil, page 404. Vérifié à 360, 390, 768 et 1440 px.

---

## 1. Ce qui tourne

```
npm run dev              serveur de développement
npm run build            build statique + avertissements
npm run preview          prévisualisation du build
npm test                 21 tests unitaires
npm run check:legal      état des mentions réglementaires
npm run check:redirects  vérifie les 301 (à lancer sur la préproduction)
```

## 2. Budget de performance

Mesuré sur le build, page d'accueil :

| Poste | Mesure | Budget |
|---|---|---|
| JavaScript total, compressé (brotli) | **953 octets** | < 60 ko |
| HTML complet, compressé | 10,7 ko | |
| CSS | inliné dans le HTML, 0 requête bloquante | |
| Polices | 2 fichiers woff2 auto-hébergés, 87 ko au total, préchargés | |
| Requêtes au premier rendu | HTML + 2 polices + 1 logo | |

Le JavaScript se réduit à trois choses : le basculement du menu mobile, le surlignage du jour courant dans les horaires, et la balise Vercel Analytics. Aucun framework d'interface n'est embarqué.

Les 953 octets laissent 59 ko pour le simulateur et le formulaire de la Phase 3, largement au-dessus du besoin estimé (6 ko).

## 3. Rendu vérifié aux quatre largeurs

| Largeur | Débordement horizontal | Titre H1 | Haut du H1 | Bas des boutons | Tirets cadratins |
|---|---|---|---|---|---|
| 360 px | aucun | 2 lignes, 40 px | 89 px | 441 px | 0 |
| 390 px | aucun | 2 lignes, 41 px | 89 px | 416 px | 0 |
| 768 px | aucun | 1 ligne, 56 px | 89 px | 331 px | 0 |
| 1440 px | aucun | 2 lignes, 64 px | 172 px | 486 px | 0 |

Le bouton d'appel du hero est visible sans défilement aux quatre largeurs (fenêtre de référence : 780 px de haut sur mobile, 900 px sur desktop). Le titre ne dépasse jamais deux lignes.

## 4. Accessibilité vérifiée

Audit exécuté dans Chrome via le protocole DevTools (`scratchpad/keyboard.mjs`), pas à l'œil.

- **Ordre de tabulation** : lien d'évitement, logo, bouton d'appel, menu, puis le contenu dans l'ordre visuel. Aucun piège, aucun saut.
- **Focus visible** : anneau de 3 px sur les 14 premiers éléments testés, y compris sur les aplats orange et bleu où il bascule en papier.
- **Menu mobile** : `aria-expanded` correct, ouverture à la touche Entrée, fermeture par Échap avec retour du focus au bouton, libellé du bouton mis à jour (« Ouvrir » / « Fermer le menu »).
- **Structure des titres** : un seul `h1`, aucun saut de niveau.
- **Repères** : un `main`, un `header`, un `footer`, zéro `nav` sans nom accessible, zéro image sans `alt`, zéro lien ou bouton sans nom.
- **Contrastes** : toutes les paires utilisées sont au-dessus de 4,5:1. Les plus serrées : encre sur orange 6,1:1, encre-2 sur bleu-pâle 5,32:1, bleu sur bleu-pâle 6,68:1.
- **Zones tactiles** : 48 px sur toutes les actions autonomes. Trois liens restent sous 44 px (« Lire les avis », « Paul Poirier », « Calvin Riffault ») : ce sont des liens en ligne dans une phrase, explicitement exemptés par le critère WCAG 2.5.8. Sur desktop, le bouton d'appel et le bouton de rendez-vous du header font 42 px, au-dessus du minimum de 24 px applicable à la souris.
- **`prefers-reduced-motion`** : coupe les transitions et le défilement fluide.

## 5. Deux bugs trouvés et corrigés pendant la recette

Ils méritent d'être notés parce qu'ils se reproduiront ailleurs.

1. **Les styles scopés d'Astro ne s'appliquent pas au balisage créé côté client.** Astro suffixe ses sélecteurs par un attribut de portée (`data-astro-cid-…`) que seuls les éléments rendus au build portent. Le marqueur « aujourd'hui » des horaires, injecté par `insertAdjacentHTML`, n'héritait donc d'aucun style et se collait au nom du jour. Corrigé en rendant l'élément au build et en le révélant par un sélecteur d'état. **Règle pour la suite : un îlot ne crée pas de balisage stylé, il change des attributs.**
2. **`display: block` dans une règle de composant écrase l'attribut `hidden`.** Conséquence : « AUJOURD'HUI » s'affichait sur les sept jours. Corrigé par un garde-fou global `[hidden] { display: none !important }` dans `global.css`, plus le passage à un sélecteur d'état.

Un troisième écart s'est révélé être un faux positif de mon harnais de test, pas du site : Chrome ne synthétise un clic sur Entrée que si l'événement `char` est envoyé avec son texte. Le harnais a été corrigé.

## 6. Décisions prises pendant l'implémentation

| Sujet | Décision | Raison |
|---|---|---|
| Menu mobile | Panneau en flux masqué par `hidden`, qui pousse le contenu | Pas de position fixe, donc pas de piège de focus à maintenir ni de défilement à bloquer. Reste utilisable si le JavaScript échoue, une fois l'attribut retiré. |
| Jour courant des horaires | Calculé côté client | La date du build serait fausse dès le lendemain sur un site statique. |
| Couleur par métier | Attribut `data-metier` sur un conteneur, qui redéfinit `--accent` | Un composant n'a pas à connaître la règle « orange = assurances » : il utilise `--accent` et hérite du bon jeu. |
| Emplacements photo | Aplat de la couleur du métier, hachuré, qui écrit ce qu'il attend | Cinq emplacements en place. Le jour du shooting, on remplace les aplats, rien d'autre ne bouge. |
| Format des emplacements | Paysage en une colonne, portrait à partir de 768 px | Un portrait 4/5 sur 360 px de large fait 450 px de hachures. |
| Champ légal manquant | Surligné en orange dans le pied de page | Un manque doit se voir, pas disparaître silencieusement. |
| Avertissement au build | Intégration Astro, en `warn`, jamais en erreur | La recette doit rester déployable. |

## 7. Structure de la page d'accueil

Sept sections, six familles de mise en page différentes, deux tampons.

1. **Hero** : split asymétrique 7/5, titre, sous-titre, bouton d'appel, lien vers le simulateur, emplacement photo.
2. **Preuve sociale** : bandeau fin, tampon « 5,0 / 5 · 84 avis » et lien vers la fiche Google. Placé juste sous le hero : c'est l'actif le plus sous-exploité du cabinet.
3. **Les deux métiers** : deux aplats pleine largeur en vis-à-vis, orange et bleu, chacun avec le nom de son associé et ses entrées les plus demandées. Seule section où les deux couleurs ont le même poids.
4. **Résiliés** : bandeau orange pâle, question en titre, tampon « ACCEPTÉ » juste dessous en réponse, texte du client sur l'AGIRA, bouton de devis.
5. **Les deux associés** : deux emplacements portrait, rôle en chasse fixe, citations réelles reprises du site actuel.
6. **L'agence** : texte plus tableau d'horaires avec surlignage du jour.
7. **Appel final** : aplat d'encre, numéro en grand sur fond orange.

Les textes sont tous repris ou réécrits depuis le contenu existant. Aucune formule creuse, aucun contenu inventé.

## 8. Ce qui reste à faire

**Phase 3, conversion :** simulateur de capacité d'emprunt, formulaire de rappel, route d'envoi d'e-mail, pré-remplissage depuis le simulateur, composant d'avis Google avec `reviews.json`.

Un encart de simulateur est prévu sur l'accueil, entre les sections 3 et 4. Il n'a pas été posé en Phase 2 pour ne pas laisser une section à moitié construite.

**Points ouverts sans effet sur la Phase 3 :**
- Le logo est le PNG récupéré depuis Wix (52 ko, 608 × 220). Un SVG est demandé au client (question 16). En attendant, il est servi tel quel et affiché à 28 px de haut sur mobile.
- Les images Open Graph ne sont pas encore générées : `Seo.astro` pointe vers `/images/og-default.png`, à produire en Phase 5.
- Les coordonnées géographiques de `site.ts` sont approximatives, à relever sur la fiche Google.
