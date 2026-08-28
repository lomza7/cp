# Phases 3 et 4 · Conversion et contenu

Livré : étoiles et bloc d'avis, simulateur de capacité d'emprunt, formulaire de rappel avec envoi d'e-mail, et les 17 pages qui renvoyaient un 404. Le site compte 22 pages.

---

## 1. Les avis, en étoiles

Le tampon « 5,0 / 5 · 84 avis » est remplacé par un affichage en étoiles.

**Comment c'est fait.** Deux rangées d'étoiles superposées : les contours en dessous, les étoiles pleines au-dessus, tronquées en largeur au pourcentage de la note. Une note de 4,7 affiche donc 94 % de la rangée pleine, sans demi-étoile approximative et sans une ligne de JavaScript.

**Accessibilité.** Les étoiles sont masquées aux technologies d'assistance (`aria-hidden`), et le conteneur porte `role="img"` avec `aria-label="Note de 5,0 sur 5"`. Vérifié dans le navigateur.

**Couleur.** Les étoiles pleines sont orange, avec un filet d'encre. L'orange seul ne fait que 2,5:1 sur le papier, sous le 3:1 qu'exige un élément graphique porteur d'information ; le contour rétablit la lisibilité de la forme sans abandonner la couleur de la marque.

**Le bloc s'adapte à ce qu'il a.** Tant que `src/content/reviews.json` n'a pas de texte d'avis, la section devient un bandeau qui annonce la note, au lieu d'un titre « Ce que disent nos clients » suivi d'un grand vide. Le jour où le client fournit six avis, le titre et la grille de citations apparaissent. **Aucun avis n'est inventé**, et un TODO s'affiche en développement.

Rappel de la Phase 1 : le balisage `AggregateRating` ne fera pas apparaître d'étoiles dans Google, qui ne les affiche plus pour un commerce balisant ses propres avis. Le levier reste la fiche Google. Le rôle du site est de montrer ces 84 avis, ce qu'il fait maintenant.

## 2. Le simulateur

Quatre curseurs, calcul en temps réel, aucun appel serveur.

La formule vit dans `src/lib/simulate.ts`, en fonction pure, couverte par 8 tests dont les cas limites : charges qui absorbent toute la capacité, taux nul, cohérence `capital + apport = budget` sur cinq durées.

**Il fonctionne avant le JavaScript.** Le résultat est calculé au build avec les valeurs par défaut, puis recalculé dans le navigateur. Un visiteur dont le script n'a pas chargé voit une simulation valide et lisible, pas des cases vides.

**Le crochet de conversion.** Le bouton « Être rappelé avec ce budget » emporte le montant simulé dans l'URL, et le formulaire de contact se pré-remplit avec une phrase rédigée pour le courtier :

```
Simulation faite sur le site : budget d'achat d'environ 248 600 €.
Apport : 30 000 €.
Mensualité visée : 1 085 €.
Durée envisagée : 25 ans.
```

**Un cas utile.** Quand les crédits en cours absorbent toute la capacité, le simulateur ne se contente pas d'afficher zéro : il propose le rachat de crédits, qui est précisément la réponse à cette situation.

Le taux et le taux d'endettement vivent dans `src/config/rates.ts`, et la date de mise à jour s'affiche sous le simulateur.

## 3. Le formulaire de rappel

Un seul composant, réutilisé sur onze pages, avec le type de demande présélectionné selon la page.

**Une seule définition des règles.** `src/lib/validate.ts` est importé par l'îlot et par la route d'API : ce que le visiteur voit et ce que le serveur accepte ne peuvent pas diverger puisqu'il n'y a qu'un jeu de règles. 16 tests.

**Les messages disent quoi corriger**, pas seulement que c'est faux : « Il manque le nom de domaine après le @, par exemple @gmail.com. »

**Il fonctionne sans JavaScript.** La route accepte un envoi de formulaire classique et redirige vers `/contact/merci`. Avec JavaScript, l'envoi se fait en arrière-plan et les erreurs s'affichent sous les champs.

**Détails qui comptent :** `inputmode` sur téléphone et e-mail, police à 16 px minimum pour éviter le zoom iOS au focus, consentement jamais pré-coché, champ piège hors du flux d'accessibilité (`aria-hidden`, `tabindex="-1"`), validation au départ du focus seulement si le champ a été renseigné.

**En cas d'échec d'envoi**, le visiteur voit l'erreur et le numéro de téléphone. Rien n'est stocké, donc rien ne se perd en silence.

Testé dans le navigateur : 6 erreurs signalées, focus placé sur le premier champ fautif, envoi valide qui aboutit sur `/contact/merci`.

## 4. Les 22 pages

| Page | Contenu |
|---|---|
| `/` | Accueil, 7 sections |
| `/le-cabinet` | Fusion de « Qui sommes-nous » et « Qu'est-ce qu'un courtier », 4 questions |
| `/agence-montereau` | Adresse, horaires, itinéraire, zone desservie, `LocalBusiness` |
| `/assurances` | Hub, 6 familles, bloc résiliés, les 8 devis |
| `/assurances/auto-moto` | Résiliés en tête, 3 niveaux de garantie, 5 questions |
| `/assurances/habitation` | Locataire, propriétaire, PNO, 4 questions |
| `/assurances/professionnels` | RC pro, décennale, dommage-ouvrage, multirisque, flotte, 4 questions |
| `/assurances/camping-car` | Contenu, aménagements, assistance, remisage |
| `/assurances/autres` | Santé, animaux, collection, voyage, GLI, risques spécifiques |
| `/assurances/lexique` | **128 termes**, recherche et navigation par lettre |
| `/credits` | Hub avec le simulateur, 3 produits, pourquoi un courtier |
| `/credits/immobilier` | **Les 10 étapes**, avec les délais, 4 questions |
| `/credits/rachat-regroupement` | Mécanique en 3 temps, quand ça vaut le coup, 4 questions |
| `/credits/lexique` | **30 termes** |
| `/assurance-emprunteur` | Page unique remplaçant les 2 doublons, 7 garanties, 5 questions |
| `/contact` | Formulaire et voies directes |
| `/contact/merci` | Confirmation avec le délai annoncé |
| `/blog` | Moteur prêt, état de reprise annoncé |
| `/mentions-legales` | Réécrites intégralement, 12 sections |
| `/confidentialite` | Finalités, base légale, destinataires, durées, droits |
| `/cookies` | Aucun cookie, et pourquoi |
| `/404` | |

Balisage : `LocalBusiness` et `WebSite` partout, `BreadcrumbList` sur chaque page intérieure, `FaqPage` sur 6 pages, `Service` sur les pages produit, `Article` sur les billets.

## 5. Le contenu, d'où il vient

**Les lexiques sont extraits verbatim de l'ancien site**, pas réécrits. Les deux pages utilisaient deux formats de balisage différents : « Terme : définition » pour le crédit, de la prose (« Un actuaire est un professionnel… ») pour l'assurance, avec en plus des sous-termes dans des `<li>` sans balise de titre. Le script gère les trois cas. Résultat : 128 termes d'assurance, 30 termes de crédit, zéro tiret cadratin, guillemets français rétablis.

**Les 10 étapes du crédit** sont réécrites depuis la page d'origine sans être dénaturées, avec les délais mis en évidence en chasse fixe.

**Le ton du client est conservé** : « On a toujours cette peur de voir le bien qui nous a tapé dans l'œil s'envoler sous notre nez », « Cela vaut-il le coup de jouer avec le feu pour quelques euros par mois ? », « Nous sommes pleins de ressources ».

**Ce qui n'a pas été inventé, et pourquoi :**

1. **Le chiffre de l'assurance emprunteur.** L'ancien site annonçait « jusqu'à 25 % du coût du crédit » sur une page et « 15 % » sur l'autre. Aucun des deux n'est repris. Le texte fonctionne sans (question 11).
2. **Le corps des articles de blog.** Introuvable : Wix charge le texte en JavaScript, et le flux RSS `/blog-feed.xml` ne renvoie que 500 caractères. Un export Wix est nécessaire (question 31). Constat au passage : sur 20 articles, **8 n'ont que 155 caractères de résumé**, ce sont les doublons « carte grise », ce qui appuie la curation proposée.
3. **Les avis Google.** Note et nombre viennent de la fiche, les textes manquent (question 18).

## 6. Mesures

| Contrôle | Résultat |
|---|---|
| JavaScript, pire page (`/credits`) | **3 899 octets** compressés, budget 60 000 |
| JavaScript, page d'accueil | 1 381 octets |
| Débordement horizontal, 6 pages à 390 et 1440 px | aucun |
| Tirets cadratins | 0 |
| Tests unitaires | 52 |
| `astro check` | 0 erreur |
| Routes en production | 23 / 23 en 200 |
| **Redirections 301 vérifiées en production** | **32 / 32 correctes** |

Les redirections passent au vert pour la première fois : le test était impossible avant que les pages de destination existent. C'est le premier contrôle réussi de la migration SEO.

## 7. Correctifs trouvés en construisant

1. **`/contact` lisait `Astro.url.searchParams` sur une page pré-rendue**, où ils sont toujours vides. Le pré-remplissage et l'alerte d'erreur sont passés côté client.
2. **Le mode `preview` d'Astro ne sert pas la sortie serveur** de l'adaptateur Vercel. La recette locale se fait désormais avec `npm run dev`, la sortie statique ayant migré vers `dist/client/` du fait de la route d'API.
3. **Le fil d'Ariane et les liens des listes légales** faisaient 16 px de haut. Portés à 24 et 32 px (critère WCAG 2.5.8).
4. **7 erreurs de typage** : `[slug].astro` sans type de props, `mediators.credit.url` réduit à `never` par un champ vide, et `Page.astro` qui ne relayait pas les propriétés Open Graph d'article.
5. **Faux positif de mon outil d'audit** : le champ piège, volontairement placé à `left: -9999px`, était compté comme un débordement de mise en page. L'audit l'ignore désormais.

## 8. Ce qui reste

**Phase 5, conformité et SEO :** images Open Graph générées, coordonnées géographiques exactes, audit d'accessibilité complet au lecteur d'écran.

**Phase 6, recette :** Lighthouse sur les 22 pages, test clavier page par page, plan de bascule DNS.

**Bloquant pour la mise en ligne :** les 11 mentions légales manquantes. `npm run check:legal` les liste, la page les affiche en orange, et le build avertit à chaque construction.

**En attente du client :** export du blog Wix, textes des avis, photos en pleine résolution (celle de Paul ne fait que 286 px de large), clé Resend, et l'arbitrage sur le crédit à la consommation affiché en vitrine mais absent de l'architecture.
