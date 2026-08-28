# Photos du site

Déposez les fichiers ici, **avec exactement ces noms** (l'extension peut être
`.jpg`, `.jpeg`, `.png` ou `.webp`). Astro les convertit en AVIF au build,
génère les tailles nécessaires et écrit les dimensions dans le HTML.

| Nom du fichier | Contenu attendu | Où il apparaît | Cadrage |
|---|---|---|---|
| `devanture` | La façade du 35 rue Jean Jaurès | Visuel du hero, accueil | paysage 3/2 |
| `calvin` | Portrait de Calvin Riffault | Accueil, section des associés | portrait 4/5 |
| `paul` | Portrait de Paul Poirier | Accueil, section des associés | portrait 4/5 |

Tant qu'un fichier manque, le site affiche un emplacement qui annonce ce qu'il
attend. Rien ne casse, aucune photo de banque d'images n'est utilisée en
remplacement. Il suffit de déposer le fichier et de relancer le build.

## Conseils de cadrage

- **Devanture** : format paysage. La photo est recadrée en 3/2 sur desktop et en
  16/10 sur mobile, le sujet doit donc rester au centre. L'enseigne et la porte
  d'entrée sont l'information utile : le visiteur doit reconnaître le lieu.
- **Portraits** : format portrait, cadrage buste. Le recadrage est en 4/5 sur
  desktop et 3/2 sur mobile, prévoir un peu d'air autour du visage.
- Pas besoin d'optimiser avant : envoyez la meilleure qualité disponible, la
  compression est faite au build.

## Photos livrées le 28 août 2026

Les trois fichiers sont en place. Ils ont été extraits de la conversation, où le
client les avait envoyés.

| Fichier | Source | Recadrage appliqué |
|---|---|---|
| `devanture.jpg` | 640 × 500 (ratio 1,28) | 4/3, quasi aucune perte |
| `calvin.jpg` | 640 × 500 (ratio 1,28) | 4/5, recadré sur les côtés seulement |
| `paul.jpg` | **286 × 357** (ratio 0,80) | 4/5, correspondance exacte, aucune perte |

Les proportions d'affichage ont été choisies d'après les sources, et non
l'inverse : un 16/9 sur une photo en 1,28 aurait amputé l'enseigne et le
trottoir.

**À remplacer dès que possible.** `paul.jpg` ne fait que 286 px de large, alors
que son cadre en fait 384 px sur un écran de bureau, soit 768 px en densité
double. La photo est donc affichée au-delà de sa résolution et paraît molle.
Astro ne fabrique pas de pixels : il n'agrandit jamais une image. Demander
l'original sorti du téléphone (question 26).
