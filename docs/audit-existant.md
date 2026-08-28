# Audit du site actuel (cpsolutions77.com, Wix, 2021)

Relevé effectué le 28 août 2026 par crawl du sitemap Wix et lecture de chaque page. Sert de référence pour le plan de redirections (Phase 5) et la réécriture des contenus (Phase 4).

## 1. Identité visuelle existante

| Élément | Valeur relevée | Décision |
|---|---|---|
| Logo | Poignée de main orange + bleu, wordmark « CP SOLUTIONS » anthracite, baseline « CABINET DE COURTAGE » bleue | **Conservé tel quel.** Fichier source (SVG ou PNG haute déf.) à demander au client. |
| Orange logo | `#F97916` (approx.) | Repris et légèrement assagi en `#EE7A16` pour l'UI |
| Bleu logo | `#116DFF` / `#4062E8` (deux bleus coexistent dans le HTML Wix) | Repris et approfondi en `#1D3FB8` pour tenir le contraste texte |
| Anthracite wordmark | `#2F2F2F` | Remplacé par l'encre `#1B1B18` |
| Typographie | Polices Wix par défaut, non identifiées, 3 graisses mélangées | Remplacée |
| Iconographie | Emoji dans les titres (« BESOIN D'AIDE ? ☎️ », « VOTRE DEVIS ICI 🔽 ») | Supprimée, interdite par le brief |
| Photos | Banque d'images Wix (graphiste devant écran, maison de campagne) | Supprimées, emplacements réservés pour un vrai shooting |
| Pied de page | « © 2021 par CP SOLUTIONS », mailto `infini.assurance@orange.fr` | Corrigé |

Lecture des cadrans du site actuel (méthode taste-skill) : variance 2 (tout centré, symétrique), motion 1, densité 3. Le site est propre mais anonyme : c'est un thème Wix.

## 2. Arborescence réelle (sitemap Wix)

### Pages (22)
```
/                                   accueil
/quisommesnous                      les deux associés (2 citations)
/lagence                            « Du lundi au samedi, avec ou sans rendez-vous ! »
/uncourtier                         définition du courtier
/mondevisassurance                  hub devis : 8 liens LyaProtect/AssurDistribution
/assuranceautomoto                  auto, moto, risques aggravés (AGIRA)
/camping-car
/assurancehabitation                locataire, propriétaire, PNO
/assuranceprofessionelles           RC pro, décennale, multirisque, véhicules pro
/vosassurances                      santé, animale, collection, voyage, GLI, risques spécifiques
/assuranceemprunteur                DOUBLON A (dit « jusqu'à 25 % du coût du crédit »)
/lassuranceemprunteur               DOUBLON B (dit « jusqu'à 15 % »)  ← incohérence de chiffre
/lexiqueassurance                   ~150 termes
/masimulationcreditimmobilier       pas de simulateur : un formulaire de rappel
/créditimmobilier                   les 10 étapes (meilleur contenu du site)
/rachatregroupement                 3 paragraphes + formulaire de rappel
/lexiqueducrédit                    ~30 termes
/contactez-nous                     adresse, tél, mail, formulaire 4 champs
/actualité                          blog
/mentions-légales                   SIREN, SIRET, APE, directeur de publication, hébergeur Wix. Aucun ORIAS.
/book-online                        module réservation Wix : « Assurances 1 h » / « Crédits 1 h »   ← non mentionné dans le brief
/inquiry-services-page              page technique Wix                                            ← non mentionné dans le brief
/service-page/assurances            fiche réservation Wix                                          ← non mentionné dans le brief
/service-page/crédits               fiche réservation Wix                                          ← non mentionné dans le brief
/actualité/categories/actualité-générale
/actualité/categories/assurance
```

### Articles de blog : 57, pas 3

Le brief annonce 3 articles. Le sitemap en liste **57** (`/post/...`), publiés depuis 2021. On y trouve :

- **~15 articles de fond** réutilisables (assurance auto après résiliation, changer d'assurance emprunteur, permis sécurité, loi Lemoine, PNO, GLI, cyber, flotte, diagnostiqueurs, camping-car, mutuelle chien-chat, prêts pro, regroupement de crédits...).
- **~9 quasi-doublons** générés en série : « assurance-crédit-et-carte-grise-... en 2026 », « ...-1 », « ...-2 », « ...le-guide-complet-pour-particuliers-et-professionnels-en », « ...-en-1 », « ...-en-2 ». Contenu dupliqué, nuisible au SEO.
- **~15 brèves d'actualité** sans valeur SEO (« Bonnes fêtes », « C'est les vacances », « Work in progress », « Nous sommes prêts », « Bientôt les vacances »).
- **1 article stratégique pour le brief** : `/post/cp-solutions-arrive-à-nemours` (13 octobre 2022), titre seul, image sans texte. C'est la source de la mention Nemours.
- **1 sujet absent du brief** : la **carte grise** revient dans 9 titres. Soit le cabinet propose un service d'immatriculation (habilitation SIV), soit c'est du remplissage SEO. À clarifier avec le client.

Liste complète dans `docs/redirections.md` (Phase 5). Règle : aucune ancienne URL ne renvoie un 404, toutes reçoivent un 301, y compris les doublons (vers l'article conservé le plus proche) et les brèves (vers `/blog`).

## 3. Contenu métier à conserver (relevé verbatim)

### Les 10 étapes du crédit immobilier (`/créditimmobilier`)
1. Signature du compromis de vente. « Nous avons toujours cette peur de voir le bien qui nous a tapé dans l'oeil s'envoler sous notre nez, le compromis est là pour verrouiller ceci. » Conditions suspensives. 15 jours pour déposer la demande, 45 jours de réponse.
2. Recherche du crédit. « Le taux débiteur est un élément certes important mais il ne faut pas regarder uniquement cela. »
3. Dépôt du dossier auprès des organismes prêteurs.
4. Retour de la banque, lettre d'accord de principe.
5. Signature avec la banque : documents, assurances, ouverture de compte.
6. L'offre de prêt. « Ce document obligatoire est fourni par la banque et scelle l'ensemble des conditions et caractéristiques de votre prêt. »
7. Le délai de réflexion. « Ce délai est de 10 jours, on ne peut l'éviter et il ne faut pas le prendre à la légère. »
8. Signature de l'offre de prêt.
9. Signature notaire. « Ça y est vous êtes propriétaire(s) ! »
10. Commencement du prêt : première mensualité un mois après l'acte authentique.

### Angle « assuré même quand les autres disent non » (`/assuranceautomoto`)
« Une résiliation, une perte de permis, trop d'accidents ou/et du malus ? Nous avons des solutions pour contrer cela et vous permettre d'être assuré à nouveau. » Mention de l'AGIRA (impossible de cacher son historique).

### Ton du client à préserver
- « Cela vaut-il le coup de jouer avec le feu pour quelques euros par mois ? » (habitation)
- « L'assurance annulation n'a jamais eu autant de sens. » (voyage)
- « Un risque spécifique ? Personne n'a trouvé d'assurance pour vous ? Nous sommes plein de ressources, contactez-nous ! »
- « Notre rôle : défendre vos intérêts, pas ceux d'une compagnie. » (accueil)
- « Contactez vos courtiers par téléphone, par mail ou directement en agence ! »

### Les deux associés (`/quisommesnous`)
- **Calvin Riffault**, conseiller financier : « Jeune, dynamique et ambitieux autant pour mes clients que pour moi-même, je vous accompagnerai dans tous vos projets... »
- **Paul Poirier**, expert en assurances : « Plein de ressources et de détermination, je m'obstine à trouver des solutions... »

### Garanties emprunteur listées
Décès, PTIA, ITT, IPT, IPP, perte d'emploi, DOS/PSY. Mention de la déliaison et de l'équivalence des garanties.

### Formulaire de rappel existant (champs)
NOM, PRÉNOM, Téléphone, Email, Quelle est votre demande ?, Quand peut-on vous contacter ?, Des informations à nous communiquer ? Repris tel quel dans le brief, avec ajout du consentement RGPD.

## 4. Incohérences relevées

| # | Constat | Traitement |
|---|---|---|
| 1 | Assurance emprunteur : « jusqu'à 25 % du coût du crédit » sur une page, « 15 % » sur l'autre | Retenir un seul chiffre sourcé, ou formuler sans chiffre. Question client. |
| 2 | Nemours : un article d'octobre 2022 annonce l'arrivée à Nemours, aucune page ne donne d'adresse | Question client n° 3 |
| 3 | Horaires : « Du lundi au samedi, avec ou sans rendez-vous ! », jamais détaillés sur le site ; le brief fournit des horaires précis | Utiliser ceux du brief, confirmer (question 7) |
| 4 | Zone : l'accueil cite « Montereau-Fault-Yonne et ses alentours (Nemours, Sens, Fontainebleau, Seine-et-Marne) » | Conservé comme zone desservie dans le balisage `areaServed` |
| 5 | Module « Réserver en ligne » Wix (1 h Assurances / 1 h Crédits) coexiste avec Calendly | Le brief retient Calendly. Les URLs Wix de réservation sont redirigées vers `/contact`. |
| 6 | Deux bleus différents dans le logo et l'UI Wix | Un seul bleu dans les tokens |
| 7 | 9 articles quasi identiques « carte grise ... 2026 » | Curation en Phase 4, 301 des doublons |

## 5. SEO de départ

- 22 pages + 57 articles + 2 catégories indexables. Le sitemap Wix est fragmenté en 5 fichiers.
- Meta descriptions dupliquées entre pages (constat du brief, confirmé : plusieurs pages partagent « Besoin d'aide ? Une demande particulière ? Ou vous souhaitez simplement nous connaître ? Contactez-nous ! »).
- Aucun balisage structuré `LocalBusiness` détecté.
- Aucun avis Google affiché.
- Pas de fiche « Nemours » : le SEO local repose sur Montereau uniquement.

## 6. Ce que le concurrent direct fait (Ymanci, ymanci.fr)

Palette relevée : marine `#17174A`, cyan `#28B4CD`, orange `#FA8C2D`, vert citron `#91DA62`. Polices système. Registre « comparateur fintech ». **L'orange est partagé avec le logo CP Solutions.** Différenciation à jouer sur le fond papier, le bleu encre profond, la typographie de caractère et le système « dossier », pas sur la couleur seule.
