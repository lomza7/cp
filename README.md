# cpsolutions77.com

Site vitrine de **CP SOLUTIONS**, cabinet de courtage en assurances et crédits à
Montereau-Fault-Yonne. Remplace le site Wix mis en ligne en 2021.

Objectif unique : générer des appels téléphoniques et des demandes de rappel
qualifiées. Aucune vente en ligne, aucun espace client.

## Démarrer

```bash
npm install
npm run dev          # http://localhost:4321
```

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build statique dans `dist/`, avec avertissements |
| `npm run preview` | Prévisualise le build. **Ne sert pas la route d'API** : utiliser `npm run dev` pour tester le formulaire. |
| `npm test` | Tests unitaires (Vitest) |
| `npm run check` | Vérification des types |
| `npm run check:legal` | Liste les mentions réglementaires manquantes |
| `npm run check:redirects [url]` | Vérifie les 301, à lancer sur la préproduction avant la bascule DNS |

## Où modifier quoi

Tout ce qui est une donnée du cabinet vit dans `src/config/`. Ne jamais écrire
ces valeurs en dur dans un composant.

| Fichier | Contient |
|---|---|
| `src/config/site.ts` | Téléphone, e-mail, adresse, horaires, associés, réseaux, Calendly, formulaires de devis, navigation |
| `src/config/legal.ts` | ORIAS, RC pro, médiateur, association professionnelle, réclamations. **Les champs vides sont signalés au build.** |
| `src/config/rates.ts` | Taux du simulateur et date de mise à jour |
| `src/config/redirects.ts` | Table des redirections 301 depuis les anciennes URLs |
| `src/styles/tokens.css` | Couleurs, typographie, espacements, formes |

### Changer le taux du simulateur

Modifier `nominalRate` et `updatedAt` dans `src/config/rates.ts`. La date
s'affiche sous le simulateur. Passé six mois sans mise à jour, le build avertit.

### Renseigner une mention légale

Remplir le champ correspondant dans `src/config/legal.ts`. La valeur se propage
partout, le placeholder orange du pied de page disparaît et
`npm run check:legal` retire la ligne.

## Direction artistique

« Deux mains » : fond papier, encre noire, et deux couleurs qui appartiennent
chacune à un associé. L'**orange** est la couleur des assurances (Paul Poirier),
le **bleu** celle des crédits (Calvin Riffault).

Règles à ne pas casser :

- **L'orange est un aplat, jamais un texte.** Son contraste sur le papier est de
  2,5:1. C'est l'encre qui s'écrit dessus.
- La chasse fixe (IBM Plex Mono) est réservée aux données : montants, taux,
  dates, horaires, libellés de champs, tampons. Jamais un paragraphe.
- Un seul rayon d'arrondi, 2 px, partout. Aucune ombre.
- On ne numérote que les vraies séquences (les 10 étapes du crédit).
- Deux tampons par page au maximum.
- Un emplacement photo est un aplat qui dit ce qu'il attend. **Jamais une photo
  de banque d'images de remplacement.**
- Aucun emoji : le jeu d'icônes est Phosphor.

## Pièges connus

- **Les styles scopés d'Astro ne s'appliquent pas au balisage créé côté client.**
  Un îlot doit changer des attributs, pas injecter du HTML stylé.
- `[hidden]` est forcé en `display: none !important` dans `global.css` : sans ce
  garde-fou, une règle de composant le neutralise silencieusement.

## Documentation

| Fichier | Contenu |
|---|---|
| `docs/01-cadrage.md` | Stack, architecture, redirections, direction artistique, tokens |
| `docs/audit-existant.md` | Inventaire du site Wix, incohérences relevées |
| `docs/02-socle.md` | Phase 2 : socle, mesures, bugs corrigés, état du déploiement |
| `docs/03-conversion-et-contenu.md` | Phases 3 et 4 : avis, simulateur, formulaire, les 22 pages |
| `docs/planche-da.html` | Planche de direction artistique, les quatre pistes évaluées |
| `QUESTIONS-CLIENT.md` | Les 34 informations à obtenir avant la mise en ligne |

## Stack

Astro 7 en sortie statique, CSS natif avec custom properties, TypeScript sans
framework d'interface, hébergement Vercel, e-mail transactionnel Resend,
analytics Vercel sans cookie.

Budget tenu : **1,4 ko de JavaScript compressé** sur la page d'accueil, **3,9 ko**
sur la page la plus chargée (`/credits`, qui porte le simulateur et le
formulaire), pour un budget de 60 ko.

## Contenu à ne pas inventer

Trois informations manquent et **ne doivent pas être comblées de mémoire** :

- le chiffre du poids de l'assurance emprunteur (l'ancien site en donnait deux,
  contradictoires) ;
- le corps des articles de blog (export Wix nécessaire) ;
- les textes des avis Google.

Les placeholders et les questions correspondantes sont dans
`QUESTIONS-CLIENT.md`.
