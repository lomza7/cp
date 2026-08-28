# Phase 1 · Cadrage

Refonte de cpsolutions77.com. Ce document fixe ce qui doit être validé avant d'écrire une ligne de code : la stack, l'architecture, le plan de redirections et la direction artistique. L'audit détaillé de l'existant est dans [audit-existant.md](audit-existant.md), les questions au client dans [../QUESTIONS-CLIENT.md](../QUESTIONS-CLIENT.md).

---

## 1. Lecture du brief

**Lecture de design :** site vitrine de conversion locale pour un cabinet de courtage à deux associés, audience grand public pressée et sur mobile (acheteur immobilier, assuré résilié, artisan), registre « boutique de proximité crédible sur l'argent », direction sur mesure (aucun système de composants). Mode : refonte-refondation, on préserve le contenu, le logo et la voix, on repart de zéro sur le visuel et la structure.

**Cadrans retenus :** variance 6 (mise en page asymétrique mais sage, on parle d'argent), motion 3 (transitions sur les états, aucune animation décorative, budget JS de 60 ko), densité 6 (le visiteur vient chercher une réponse, on la lui donne, mais hiérarchisée).

**Ce qui prime, dans l'ordre :** le téléphone joignable sans scroll, la vitesse en 4G, le SEO local acquis depuis 2021, la conformité ACPR, puis seulement la beauté. La direction artistique doit servir les quatre premiers.

## 2. Ce que l'audit change au brief

Quatre écarts entre le brief et le site réel, qui modifient le plan :

1. **57 articles de blog, pas 3.** Dont 9 quasi-doublons « carte grise 2026 » et 15 brèves saisonnières. Le plan de redirections passe de 3 à 57 lignes côté blog, et une curation devient nécessaire (question client 15).
2. **Un service « carte grise » apparaît dans 9 titres** et nulle part dans le brief. Soit c'est une offre réelle à ajouter, soit du remplissage SEO à fusionner (question 10).
3. **Le logo existe et il est bon** : une poignée de main orange et bleue. Deux mains, deux couleurs, deux associés. La direction artistique part de là au lieu d'inventer une palette.
4. **Quatre URLs Wix techniques** (`/book-online`, `/inquiry-services-page`, `/service-page/assurances`, `/service-page/crédits`) sont indexées et doivent être redirigées.

Une correction importante sur les attentes SEO : **le balisage `AggregateRating` ne fera pas apparaître d'étoiles dans les résultats Google.** Depuis septembre 2019, Google n'affiche plus d'étoiles pour les avis « auto-portés », c'est-à-dire un `LocalBusiness` qui balise ses propres avis sur son propre site. Les étoiles qu'on voit dans les résultats locaux proviennent de la fiche Google Business Profile. On génère quand même le balisage (il alimente les autres moteurs et les assistants IA, et documente la note dans le graphe de données), mais le vrai levier « étoiles » est la fiche Google, déjà à 5,0. Ce qu'on fait sur le site, c'est **montrer** ces 84 avis, pas les faire apparaître dans Google.

## 3. Stack technique

### Décision

| Couche | Choix | Pourquoi celui-là |
|---|---|---|
| Générateur | **Astro 5**, sortie statique, rendu HTML complet au build | 0 ko de JavaScript par défaut. Le HTML est complet à la livraison, ce que le SEO exige. Chaque page est un fichier `.astro` lisible comme du HTML par n'importe quel développeur. |
| Interactivité | **Deux îlots en TypeScript sans framework** (`<script>` Astro) : le simulateur et le formulaire | Le simulateur, c'est 4 entrées et 4 sorties. Le formulaire, c'est une validation et un `fetch`. Un framework UI (React, 45 ko ; Preact, 4 ko) n'apporte rien ici et ajoute une couche à comprendre pour le prochain intervenant. Estimation : 3 ko + 3 ko compressés. |
| Styles | **CSS natif avec custom properties**, styles scopés par composant Astro, un `tokens.css` et un `global.css` | Zéro dépendance, zéro configuration, lisible par quiconque connaît le CSS. Tailwind aurait été acceptable mais impose son vocabulaire à celui qui reprendra le site. Le brief interdit les bibliothèques de composants ; ici il n'y a même pas de framework CSS. |
| Hébergement | **Vercel**, adaptateur `@astrojs/vercel` en mode statique + une seule route serveur (`/api/contact`) | Redirections 301 déclarées dans `astro.config.mjs` et compilées vers la config Vercel. CDN mondial, HTTPS automatique, prévisualisation par branche. |
| E-mail | **Resend** depuis la route `/api/contact` | 3 000 e-mails/mois gratuits, une clé d'API, deux enregistrements DNS. Pas de base de données : l'e-mail est la base. |
| Contenu blog | **Markdown dans le dépôt** via les collections de contenu Astro, front-matter typé | Versionné, sans serveur. Un CMS git (Decap) peut se greffer dessus **plus tard** sans rien changer si le client répond oui à la question 14. |
| Analytics | **Vercel Web Analytics** | Sans cookie, sans bandeau, ~1 ko. Pas de Google Analytics. |
| Sitemap, OG | `@astrojs/sitemap` ; images Open Graph générées au build par un script (une par page, à partir du titre) | Pas de service externe. |
| Polices | Auto-hébergées, woff2, sous-ensemble latin, `font-display: swap` | Voir la section tokens. |
| Icônes | **Un seul jeu, Phosphor (variante Regular), inliné en SVG au build** via `astro-icon` | Cohérent, pas de police d'icônes, seuls les glyphes utilisés sont embarqués. Environ 12 icônes sur tout le site. |
| Tests | Vitest sur `lib/simulate.ts` et `lib/validate.ts` ; script `check:redirects` ; Lighthouse CI en Phase 6 | Les deux seules logiques métier sont testées unitairement. |

### Ce qui a été écarté et pourquoi

- **Next.js** : ~85 ko de JavaScript avant la première ligne de code, soit le budget du brief dépassé à vide. Disqualifié par la contrainte n° 1.
- **WordPress** : maintenance de sécurité permanente, performances mobiles difficiles à tenir, base de données que le brief exclut.
- **Eleventy** : excellent en statique, mais la route serveur pour l'e-mail et les îlots demandent une plomberie manuelle qu'Astro fournit nativement.
- **SvelteKit / Nuxt** : bons, mais ils hydratent par défaut et supposent un intervenant qui connaît le framework.
- **Préact pour les îlots** : gardé en réserve si le formulaire devait grossir (multi-étapes, fichiers joints). Pas justifié aujourd'hui.

### Budget JavaScript prévisionnel (compressé)

| Élément | Estimation |
|---|---|
| Runtime Astro | 0 ko |
| Simulateur | ~3 ko |
| Formulaire (validation, envoi, états) | ~3 ko |
| Menu mobile, header | ~1 ko |
| Vercel Analytics | ~1 ko |
| **Total** | **~8 ko sur 60 autorisés** |

## 4. Architecture des fichiers

```
cpsolutions77/
├── astro.config.mjs            # intégrations, redirections (importées de src/config/redirects.ts)
├── package.json                # scripts : dev, build, preview, test, check:legal, check:redirects
├── tsconfig.json
├── .env.example                # RESEND_API_KEY, CONTACT_TO, GOOGLE_PLACES_KEY (optionnel)
├── QUESTIONS-CLIENT.md
├── docs/
│   ├── 01-cadrage.md
│   ├── audit-existant.md
│   ├── redirections.md          # table complète, générée depuis redirects.ts
│   └── bascule-dns.md           # Phase 6
├── public/
│   ├── fonts/                   # woff2 auto-hébergées
│   ├── images/                  # logo, favicon, OG générées, carte statique
│   └── robots.txt
├── scripts/
│   ├── check-legal.ts           # liste les champs légaux manquants
│   ├── check-redirects.mjs      # teste chaque ancienne URL en 301 vers la bonne cible
│   └── build-og.ts              # génère les images Open Graph
└── src/
    ├── config/
    │   ├── site.ts              # téléphone, e-mail, adresse, horaires, réseaux, Calendly, LyaProtect
    │   ├── legal.ts             # ORIAS, RC pro, médiateur, association... avec TODO explicites
    │   ├── rates.ts             # TAUX_NOMINAL = 3.45, TAUX_ENDETTEMENT = 0.35
    │   └── redirects.ts         # ancienne URL → nouvelle, source unique
    ├── styles/
    │   ├── tokens.css           # couleurs, typographie, espacements, rayons, z-index
    │   └── global.css           # reset, base typographique, focus, reduced-motion, utilitaires
    ├── layouts/
    │   ├── Base.astro           # <head>, Seo, JsonLd, Header, Footer, MobileActionBar, skip-link
    │   └── Page.astro           # Base + fil d'Ariane + BreadcrumbList
    ├── components/
    │   ├── Header.astro, Footer.astro, MobileActionBar.astro, MobileMenu.astro
    │   ├── Seo.astro, JsonLd.astro, Breadcrumb.astro
    │   ├── Button.astro, Stamp.astro, Field.astro, Notice.astro
    │   ├── Hero.astro, Duo.astro (les deux associés), Steps.astro (les 10 étapes)
    │   ├── Simulator.astro      # îlot 1
    │   ├── CallbackForm.astro   # îlot 2
    │   ├── GoogleReviews.astro  # lit content/reviews.json, TODO visible si vide
    │   ├── Faq.astro, Lexique.astro, Hours.astro, QuoteLinks.astro
    │   └── BlogCard.astro
    ├── content/
    │   ├── config.ts            # schémas des collections
    │   ├── blog/*.md            # articles migrés
    │   ├── reviews.json         # avis Google recopiés (jamais inventés)
    │   ├── lexique-assurance.json
    │   └── lexique-credit.json
    ├── lib/
    │   ├── simulate.ts          # fonction pure, testée
    │   ├── validate.ts          # règles du formulaire, partagées client/serveur
    │   ├── schema.ts            # constructeurs JSON-LD (LocalBusiness, FAQPage, Article...)
    │   └── slug.ts              # dé-accentuation des slugs de blog
    └── pages/
        ├── index.astro
        ├── le-cabinet.astro
        ├── agence-montereau.astro
        ├── assurances/{index,auto-moto,habitation,professionnels,camping-car,autres,lexique}.astro
        ├── credits/{index,immobilier,rachat-regroupement,lexique}.astro
        ├── assurance-emprunteur.astro
        ├── contact.astro
        ├── contact/merci.astro   # confirmation
        ├── blog/index.astro, blog/[slug].astro
        ├── mentions-legales.astro, confidentialite.astro, cookies.astro
        ├── 404.astro
        └── api/contact.ts       # prerender = false, la seule route serveur
```

Deux principes : **tout ce qui est une donnée du client vit dans `src/config/`** (une seule place à modifier), et **toute logique testable vit dans `src/lib/`** en fonctions pures, sans dépendance au DOM.

## 5. Plan de redirections

Source unique : `src/config/redirects.ts`. `astro.config.mjs` l'importe et génère les règles Vercel. `npm run check:redirects` la relit et vérifie chaque ligne contre le site déployé (code 301, cible exacte, aucune chaîne de redirections).

### Pages

| Ancienne URL | Nouvelle URL |
|---|---|
| `/quisommesnous` | `/le-cabinet` |
| `/uncourtier` | `/le-cabinet` |
| `/lagence` | `/agence-montereau` |
| `/mondevisassurance` | `/assurances` |
| `/assuranceautomoto` | `/assurances/auto-moto` |
| `/assurancehabitation` | `/assurances/habitation` |
| `/assuranceprofessionelles` | `/assurances/professionnels` |
| `/camping-car` | `/assurances/camping-car` |
| `/vosassurances` | `/assurances/autres` |
| `/lexiqueassurance` | `/assurances/lexique` |
| `/masimulationcreditimmobilier` | `/credits` |
| `/créditimmobilier` et `/cr%C3%A9ditimmobilier` | `/credits/immobilier` |
| `/rachatregroupement` | `/credits/rachat-regroupement` |
| `/lexiqueducrédit` et `/lexiqueducr%C3%A9dit` | `/credits/lexique` |
| `/assuranceemprunteur` | `/assurance-emprunteur` |
| `/lassuranceemprunteur` | `/assurance-emprunteur` |
| `/contactez-nous` | `/contact` |
| `/actualité` et `/actualit%C3%A9` | `/blog` |
| `/actualité/categories/actualité-générale` | `/blog` |
| `/actualité/categories/assurance` | `/blog` |
| `/mentions-légales` et `/mentions-l%C3%A9gales` | `/mentions-legales` |
| `/book-online` | `/contact` |
| `/inquiry-services-page` | `/contact` |
| `/service-page/assurances` | `/assurances` |
| `/service-page/crédits` | `/credits` |
| `/post/:slug` | `/blog/:slug-sans-accent` (table explicite, 57 lignes) |

Les URLs accentuées sont déclarées deux fois (forme brute et forme percent-encodée) parce que les clients HTTP ne s'accordent pas sur la normalisation. Le script de vérification teste les deux.

### Blog : décision à valider

Le brief demande à la fois de **conserver les slugs existants** et de **jeter les URLs accentuées**. Or 30 des 57 slugs contiennent des accents (`/post/trouvez-une-assurance-auto-après-résiliation-...`). Les deux consignes sont incompatibles. Recommandation : **dé-accentuer** (`/blog/trouvez-une-assurance-auto-apres-resiliation-guide-pratique-et-rassurant`) et rediriger l'ancienne URL en 301. Le coût SEO d'un 301 est marginal ; le coût d'URLs accentuées est permanent (partage cassé dans les SMS et les mails, double encodage). Si vous préférez conserver les slugs à l'identique, c'est une ligne à changer dans `lib/slug.ts`.

Deuxième décision : les 57 articles ne méritent pas tous une page. Proposition en Phase 4 : une quinzaine migrés et réécrits, les doublons « carte grise » fusionnés en un seul article (les 8 autres URLs en 301 vers lui), les brèves saisonnières en 301 vers `/blog`. Aucune URL ne finit en 404.

## 6. Direction artistique

### Ce que le sujet impose

Deux personnes dans une boutique de la rue Jean Jaurès, ouverte du lundi au samedi, qui décrochent le téléphone. Un logo qui montre déjà deux mains de deux couleurs. Un métier fait de dossiers, de pièces justificatives, de tampons et de délais légaux. Un voisin à 200 mètres habillé en fintech (marine, cyan, orange). Un visiteur inquiet ou pressé, debout, sur son téléphone.

### Les trois pistes du brief, évaluées

**1. Documentaire.** La photo porte tout, la typographie s'efface, presque pas de couleur. C'est la plus juste sur le fond (« il existe vraiment, je peux y aller ») et la plus fragile en pratique : elle ne vaut rien sans un vrai shooting, et le client ne l'a pas encore décidé. Sans photos, un site documentaire est un site vide. **Écartée comme direction principale, retenue comme couche** : les emplacements photo sont dessinés dès la Phase 2 et le site s'améliore le jour où les images arrivent, sans refonte.

**2. Administratif détourné.** Le vocabulaire du dossier (libellés, numérotation, colonnes, chasse fixe pour les données, tampon) traité avec rigueur et un sourire. Trois qualités décisives : c'est exactement le monde du visiteur (compromis, offre de prêt, relevé d'informations) ; les 10 étapes du crédit et le simulateur y prennent naturellement forme ; et le tampon « ACCEPTÉ » est le contraire visuel exact de ce que l'assuré résilié vient de vivre. Deux risques : un excès de chasse fixe nuit à la lisibilité mobile, et le genre glisse vite vers le « brutalisme IA » (filets décoratifs partout, numérotation gratuite, étiquettes en capitales espacées au-dessus de chaque titre). **Retenue pour sa structure**, avec des garde-fous : la chasse fixe est réservée aux nombres et aux libellés de champs, jamais au texte courant ; on ne numérote que ce qui est une séquence réelle ; un filet organise un contenu, il ne décore pas.

**3. Chaleureux et dense.** Fond saturé, typographie large, contenu dense mais hiérarchisé. Efficace en conversion (la réponse est immédiate), cohérent avec « chaleureux et local ». Deux risques : sur des pages longues (lexiques, mentions légales), un fond saturé fatigue ; et un fond bleu ou orange plein ressemble à un comparateur, donc au voisin. **Retenue pour sa densité et sa température**, pas pour son fond plein.

### La recommandation : « Deux mains »

Une quatrième piste qui prend la **structure** de l'administratif détourné, la **température et la densité** du chaleureux, et laisse les **emplacements** du documentaire ouverts. Son idée directrice vient du logo : deux mains, deux couleurs, deux associés, deux métiers. Le site encode cette dualité dans son organisation, pas seulement dans ses couleurs.

**Fond papier, encre noire, deux couleurs qui appartiennent chacune à un associé.**
- L'**orange** (`#EE7A16`, celui du logo, à peine assagi) est la couleur des **assurances**, donc de Paul. Il est toujours un aplat : un bloc, un bouton, un fond de tampon. Jamais un texte, son contraste sur papier (2,5:1) l'interdit. L'encre noire s'écrit dessus (6,1:1).
- Le **bleu encre** (`#1D3FB8`, le bleu du logo approfondi) est la couleur des **crédits**, donc de Calvin. Il fonctionne en texte (7,6:1 sur papier), en aplat (papier dessus, 7,6:1) et en trait de tampon.
- Les pages neutres (le cabinet, contact, mentions légales, blog) ne prennent aucune des deux : encre et papier, et les deux couleurs n'apparaissent que là où l'un des deux métiers est nommé.
- Sur l'accueil, les deux blocs se font face. Le visiteur comprend en une seconde qu'il y a deux métiers et sait à qui il va parler. C'est la seule page où les deux couleurs ont le même poids.

Cette règle documentée remplace la règle « un seul accent » : le second accent porte une information vraie (à qui vous parlez), il n'est pas décoratif.

**Différenciation face au voisin.** Ymanci a aussi de l'orange. La différence tient au fond papier (pas blanc), au bleu encre profond (pas cyan), à la typographie de caractère (pas des polices système), au système « dossier » (pas des cartes arrondies), et au tampon. L'orange n'est jamais dominant sur une page entière.

**Le tampon.** Un seul élément expressif, utilisé avec parcimonie : le cadre double, la typographie de machine, la légère rotation. Il porte trois choses, et trois seulement : la note Google (« 5,0 / 5 · 84 avis »), le mot « ACCEPTÉ » sur les pages destinées aux résiliés et malussés, et « Dossier suivi par Paul Poirier » / « Calvin Riffault » en pied des pages métier. Pas plus de deux tampons par page.

**Ce qui est proscrit, et comment on y échappe.** Pas d'emoji (jeu Phosphor). Pas de dégradé radial (aplats). Pas de grille de cartes blanches identiques (les contenus sont organisés en colonnes et en listes à filets, avec des blocs colorés là où un métier est nommé). Pas de barre de quatre chiffres (les seuls chiffres mis en avant sont la note Google et le résultat du simulateur). Pas de fond crème + serif + terracotta : le papier ici est gris chaud très clair, la typographie est une grotesque, l'accent est un orange de logo. Pas de formules creuses : le contenu du client est réutilisé.

### Système de tokens

#### Couleurs

| Token | Valeur | Rôle | Contraste vérifié |
|---|---|---|---|
| `--papier` | `#F3F2ED` | fond de page | |
| `--papier-2` | `#E9E7DF` | filets, fonds de tableau, champs | |
| `--encre` | `#1B1B18` | texte, boutons primaires, header | 15,4:1 sur papier |
| `--encre-2` | `#5C5B55` | texte secondaire, légendes | 6,1:1 sur papier |
| `--orange` | `#EE7A16` | assurances : aplats, bouton Appeler, fond de tampon | encre dessus 6,1:1 |
| `--orange-fonce` | `#D46A0C` | survol des aplats orange | encre dessus 4,8:1 |
| `--orange-pale` | `#FBE3CC` | fond de section assurances | encre dessus 13,9:1 |
| `--bleu` | `#1D3FB8` | crédits : texte, aplats, trait de tampon, liens | 7,6:1 sur papier |
| `--bleu-fonce` | `#162F8F` | survol des aplats bleus | papier dessus 10,2:1 |
| `--bleu-pale` | `#DDE3F7` | fond de section crédits | bleu dessus 6,7:1 |
| `--ok` | `#25693F` | validation formulaire (sémantique, pas un accent) | 5,9:1 sur papier |
| `--erreur` | `#B3261E` | erreurs formulaire | 5,8:1 sur papier |

Pas de mode sombre : le site est un document, il est papier. Le brief ne le demande pas, et le budget de test (contrastes, photos, tampons) serait doublé pour un usage marginal sur un site vitrine local. Le `color-scheme: light` est déclaré pour que les contrôles natifs restent cohérents.

#### Typographie

Deux familles, trois fichiers woff2, tous auto-hébergés :

- **Bricolage Grotesque** (licence OFL) pour les titres et le texte courant. Une grotesque avec du caractère, large, directe, chaleureuse sans être ronde. Elle tient à 17 px en texte et prend de la présence à 48 px. Un seul fichier variable sous-ensemble latin (≈ 55 ko) couvre les graisses 400 et 700 et l'axe de taille optique, ce qui vaut deux fichiers statiques.
- **IBM Plex Mono** (OFL), graisse 500, pour tout ce qui est donnée : montants, taux, dates, horaires, numéros, libellés de champs, texte des tampons. C'est la « machine à écrire » de la piste administrative, dans une version lisible sur mobile. Un fichier (≈ 20 ko).

Si Bricolage paraît trop marquée au client, la doublure est **Familjen Grotesk** (même licence, même structure de fichiers), sans autre changement.

Échelle (base 17 px, ratio ~1,25, `clamp()` entre 360 et 1440 px) :

| Token | Mobile → Desktop | Usage |
|---|---|---|
| `--t-1` | 40 → 64 px, 700, interlettrage -0,02 em, interligne 1,0 | H1 |
| `--t-2` | 30 → 44 px, 700, interligne 1,05 | H2 |
| `--t-3` | 24 → 30 px, 700, interligne 1,15 | H3 |
| `--t-4` | 20 → 22 px, 700, interligne 1,3 | H4, intitulés d'étapes |
| `--t-body` | 17 → 18 px, 400, interligne 1,55, 65 caractères max | texte |
| `--t-small` | 15 px, 400, interligne 1,5 | légendes, mentions |
| `--t-mono` | 15 → 16 px, Plex Mono 500, chiffres tabulaires | données, libellés |
| `--t-mono-xl` | 40 → 56 px, Plex Mono 500 | résultat du simulateur, note Google |

Titres en `text-wrap: balance`. Chiffres toujours en `font-variant-numeric: tabular-nums`.

#### Espacements, grille, formes

- Échelle d'espacement sur base 4 : `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
- Conteneur 1200 px, gouttière 24 px (16 px sous 768 px). Grille 12 colonnes à partir de 1024 px, 6 colonnes entre 768 et 1023, 1 colonne en dessous.
- **Rayon unique : 2 px** partout (boutons, champs, blocs). C'est le rayon d'une chemise cartonnée, pas celui d'une application. Seule exception documentée : aucune.
- Filets : 1 px `--papier-2` pour organiser, 2 px `--encre` pour séparer les grandes sections. Jamais de filet sans contenu de part et d'autre.
- Ombres : aucune. La hiérarchie se fait par l'aplat et le filet.
- Zones tactiles : 48 px minimum, barre d'action mobile 64 px.
- Z-index documenté : `--z-header 10`, `--z-actionbar 20`, `--z-menu 30`, `--z-skip 40`.

#### Mouvement

Transitions de 160 ms sur les états (`transform`, `opacity`, `background-color`), courbe `cubic-bezier(0.2, 0, 0, 1)`. Un `:active` en `translateY(1px)`. Aucune animation d'entrée, aucun défilement piloté, aucun mouvement infini. `prefers-reduced-motion: reduce` coupe tout.

### Comment les pages clés s'incarnent

- **Accueil (mobile).** Header 56 px : logo, bouton « Appeler » orange, menu. Hero sur papier : H1 « Le courtier qui décroche. », sous-titre factuel (Montereau, deux associés, lundi au samedi), un bouton primaire encre « Appeler le 01 64 24 83 45 », un lien « Simuler mon budget ». Juste sous le hero, le tampon « 5,0 / 5 · 84 avis Google ». Puis les deux blocs face à face, orange « Assurances » et bleu « Crédits », chacun avec le prénom de l'associé et ses trois entrées les plus demandées. Barre d'action fixe en bas : Appeler · Simuler · Rendez-vous.
- **`/credits/immobilier`.** Les 10 étapes en colonne unique numérotée à la machine (01 à 10), chaque étape avec son intitulé, son texte réécrit, et une note « délai » en chasse fixe quand elle existe (15 jours, 45 jours, 10 jours). La numérotation est légitime : c'est une vraie séquence.
- **`/assurances/auto-moto`.** Section « Résilié, malussé, permis annulé ? » avec le tampon « ACCEPTÉ » et le texte du client sur l'AGIRA. Bouton orange vers le formulaire LyaProtect auto.
- **Simulateur.** Quatre curseurs à libellés en chasse fixe, résultat en `--t-mono-xl` bleu, détail en tableau à filets, mention légale en `--t-small`, bouton « Être rappelé avec ce budget » qui pré-remplit le formulaire.

### Photos : le plan sans et avec

Cinq emplacements sont dessinés dès la Phase 2 : le hero de l'accueil (ou son bloc de droite en desktop), les deux portraits sur `/le-cabinet`, la devanture sur `/agence-montereau`, et une image d'ambiance sur `/contact`. Tant que le shooting n'est pas fait, ces emplacements sont des aplats de la couleur du métier (ou papier-2 pour les pages neutres) avec, en chasse fixe, ce qu'ils attendent (« Portrait, Paul Poirier »). Jamais de photo de banque d'images de remplacement. Le jour où les photos arrivent, on remplace les aplats, rien d'autre ne bouge.

## 7. Décisions secondaires

| Sujet | Décision | Justification |
|---|---|---|
| Avis Google | **JSON manuel** (`src/content/reviews.json`) : note, nombre, 6 avis recopiés, lien vers la fiche | L'API Places impose un compte Google Cloud avec facturation, ne renvoie que 5 avis, et introduit une dépendance au build. Le JSON se met à jour en deux minutes. Un script `reviews:fetch` optionnel pourra lire l'API si le client fournit une clé. Le composant affiche un TODO visible en développement tant que le fichier est vide. |
| Blog | Markdown, puis Decap CMS si le client veut publier seul | Decap se branche sur le même dossier `src/content/blog`. Il nécessite une authentification GitHub, à mettre en place seulement si demandé. |
| Carte de l'agence | Image statique + lien « Itinéraire » | Un iframe Google Maps dépose des cookies (donc bandeau) et pèse ~300 ko de JavaScript. |
| Calendly | Lien externe en nouvel onglet | Le widget embarqué pèse ~200 ko et dépose des cookies. |
| Formulaires LyaProtect | Liens externes en nouvel onglet, `rel="noopener"` | Conforme au brief. |
| Cookies | Aucun cookie déposé par le site. Page `/cookies` qui le dit. Pas de bandeau. | Vercel Analytics est sans cookie, les tiers sont des liens sortants. |
| Page de confirmation | `/contact/merci` avec le délai de réponse annoncé | Une URL propre permet aussi de mesurer les conversions. |
| Délai de réponse annoncé | À confirmer avec le client (proposition : « pendant les horaires d'ouverture, dans la demi-journée ») | On ne promet rien qu'on n'a pas vérifié. |

## 8. Cas limites que le brief ne couvre pas

1. **Les enregistrements MX.** La messagerie `contact@cpsolutions77.com` dépend des DNS. Lors de la bascule, ils doivent être recopiés, sinon le cabinet ne reçoit plus ses e-mails, y compris ceux du formulaire. Point n° 1 du plan de bascule.
2. **Wix conserve-t-il le domaine ?** Si le domaine est enregistré chez Wix, il faut soit le transférer (délai de 60 jours après tout changement de titulaire), soit pointer ses DNS vers Vercel depuis Wix. À vérifier avant de planifier.
3. **Le sous-domaine `www`.** Le site actuel répond sur `www.cpsolutions77.com`. On garde `www` en canonique et on redirige l'apex, pour ne pas casser les liens acquis.
4. **La page « Réserver en ligne » Wix** propose des créneaux de 1 h. Calendly propose-t-il les mêmes ? À vérifier pour ne pas perdre de rendez-vous.
5. **Le formulaire quand Resend est indisponible.** La route renvoie une erreur lisible, et le formulaire affiche le numéro de téléphone en repli. On ne stocke rien, donc on ne perd rien silencieusement : l'utilisateur sait qu'il doit appeler.
6. **Le honeypot et les lecteurs d'écran.** Le champ piège est hors du flux d'accessibilité (`aria-hidden`, `tabindex="-1"`, `autocomplete="off"`), sinon il piège aussi les vrais utilisateurs.
7. **Les taux.** `TAUX_NOMINAL` est daté dans `rates.ts` (`updatedAt`) et la date est affichée sous le simulateur. Un taux non mis à jour depuis six mois déclenche un avertissement au build.
8. **L'adresse dans les données structurées** doit correspondre au caractère près à la fiche Google Business Profile (« 35 Rue Jean Jaurès » vs « 35 rue jean jaurès » sur le site actuel).
9. **Le `mailto:`.** Le brief demande de retirer le mauvais `mailto:`. On garde un `mailto:contact@cpsolutions77.com`, mais on ne le met jamais en bouton principal : le téléphone et le formulaire passent devant.
10. **Le blog et la date.** Les 57 articles ont des dates Wix. On les conserve dans le front-matter (`pubDate`), on ajoute `updatedAt` quand on réécrit, et le balisage `Article` expose les deux.

## 9. Ce qui doit être validé pour lancer la Phase 2

1. La stack (Astro, CSS natif, TypeScript sans framework, Vercel, Resend).
2. La direction « Deux mains » : papier + encre, orange = assurances / Paul, bleu = crédits / Calvin, tampon parcimonieux, Bricolage Grotesque + IBM Plex Mono.
3. Le titre de travail du hero : « Le courtier qui décroche. »
4. La règle blog : dé-accentuation des slugs avec 301, et curation à une quinzaine d'articles.
5. Les avis Google en JSON manuel.
6. L'absence de mode sombre.

Sans réponse aux questions client, la Phase 2 peut démarrer : tous les champs manquants ont un placeholder. Ce qui est réellement bloquant, c'est la mise en ligne (questions 1 à 7 de `QUESTIONS-CLIENT.md`), pas le développement.
