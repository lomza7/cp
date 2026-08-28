# Articles du blog

Un fichier Markdown par article. Le préfixe `_` exclut un fichier de la
collection, c'est pourquoi ce mode d'emploi n'apparaît pas sur le site.

## Front-matter

```yaml
---
titre: Trouvez une assurance auto après résiliation
description: Une phrase qui donne envie de cliquer, 300 caractères maximum.
date: 2026-08-03
maj: 2026-09-15          # facultatif, si l'article est retravaillé
metier: assurances       # ou credits, facultatif
liens:                   # facultatif, liens vers les pages du site
  - label: Assurance auto et moto
    href: /assurances/auto-moto
brouillon: false         # true pour ne pas publier
---
```

Le nom du fichier donne l'adresse : `mon-article.md` devient `/blog/mon-article`.
Pas d'accent ni de majuscule dans le nom du fichier.

## Reprise depuis l'ancien site

Les articles de l'ancien site Wix ne sont pas encore repris. Leur texte n'est
pas accessible depuis les pages publiques : Wix le charge en JavaScript, et le
flux RSS ne renvoie que les 500 premiers caractères. Une reprise fidèle exige
l'export du blog depuis le tableau de bord Wix (voir QUESTIONS-CLIENT n° 31).

Aucun texte n'a été réécrit de mémoire ou inventé pour combler le vide.

Une fois l'export obtenu, conserver pour chaque article :
- le **titre** d'origine,
- la **date de publication** d'origine dans `date`,
- le **slug**, dé-accentué, et déclarer l'ancien dans
  `src/config/redirects.ts` (`postRedirects`) pour la redirection 301.
