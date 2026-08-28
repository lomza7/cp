# Questions à poser au client avant la mise en ligne

Chaque réponse débloque un `TODO` visible dans le code. Tant qu'une réponse manque, le site affiche un placeholder explicite et `npm run check:legal` liste ce qui reste à fournir.

## Bloquant pour la mise en ligne (conformité ACPR)

1. **Numéro ORIAS** et **catégories d'immatriculation** (COA ? COBSP ? MIOBSP ?). Vérifiable sur orias.fr.
   → `src/config/legal.ts` : `orias.number`, `orias.categories`
2. **Association professionnelle agréée** à laquelle le cabinet adhère (obligatoire pour les COBSP depuis 2022, ex. : AFIB, ANACOFI, CNCEF, La Compagnie des CGP-CIF...). Numéro d'adhérent.
   → `legal.ts` : `professionalAssociation`
3. **Mode de rémunération** : commissions des compagnies, honoraires facturés au client, ou les deux ? Montant ou barème des honoraires de courtage crédit s'il y en a.
   → `legal.ts` : `remuneration`
4. **Liens financiers** : le cabinet détient-il plus de 10 % d'une compagnie d'assurance, ou une compagnie détient-elle plus de 10 % du cabinet ? (Généralement non, mais la mention est obligatoire.)
   → `legal.ts` : `financialLinks`
5. **Assureur RC professionnelle et garantie financière** : nom de l'assureur, numéro de police, montants (art. L.512-6 et L.512-7 du Code des assurances).
   → `legal.ts` : `rcPro`, `financialGuarantee`
6. **Procédure de réclamation** : adresse e-mail ou postale dédiée aux réclamations. Les délais légaux (accusé de réception 10 jours ouvrables, réponse 2 mois) seront affichés par défaut.
   → `legal.ts` : `complaints.email`
7. **Forme juridique et capital social** de CP SOLUTIONS (SAS ? SARL ? capital ?). Le site actuel ne le dit pas.
   → `legal.ts` : `company.legalForm`, `company.capital`

## Structurant pour le contenu

8. **Nemours.** Un article du 13 octobre 2022 annonce « CP SOLUTIONS arrive à Nemours ! » mais aucune page ne donne d'adresse. Trois cas possibles :
   - une vraie agence avec adresse et horaires → on crée `/agence-nemours` et une deuxième entrée `LocalBusiness` ;
   - une permanence ponctuelle (jour fixe, chez un partenaire) → on le dit sur `/agence-montereau` ;
   - texte obsolète → on supprime toute mention et on redirige l'article vers `/blog`.
9. **Horaires.** Ceux fournis dans le brief divergent de la fiche Google. Lesquels font foi ? Le lundi après-midi ferme-t-il vraiment à 16h30 ? Le samedi après-midi reprend-il à 13h30 ?
10. **Carte grise.** Neuf articles du blog parlent de « carte grise ». Le cabinet propose-t-il un service d'immatriculation (habilitation SIV) ? Si oui, c'est un service à ajouter au site. Si non, ces articles seront fusionnés.
11. **Assurance emprunteur, le chiffre.** Le site dit « jusqu'à 25 % du coût du crédit » sur une page et « 15 % » sur l'autre. Quel chiffre retenir, et d'où vient-il ?
12. **Qui fait quoi exactement ?** Le brief attribue les assurances à Paul et les crédits à Calvin. L'assurance emprunteur, qui est à la frontière, est suivie par qui ? Les pros (décennale, flotte) sont-ils aussi côté Paul ?
13. **Compagnies partenaires.** La liste est-elle communicable ? Si oui, elle apparaîtra sur `/le-cabinet` (logos réels uniquement, avec autorisation de chaque marque).
14. **Blog : publier seul ?** Voulez-vous rédiger et publier vous-mêmes vos articles depuis une interface web (on installe un CMS léger), ou préférez-vous envoyer le texte et qu'on le mette en ligne ? Cette réponse détermine la Phase 4.
15. **Blog : curation.** Sur les 57 articles existants, on propose d'en conserver une quinzaine (les guides de fond) et de rediriger les brèves saisonnières et les doublons « carte grise 2026 ». Êtes-vous d'accord ?

## Actifs à fournir

16. **Logo** en fichier source (SVG, AI ou PNG haute définition, fond transparent).
17. **Photos.** Un shooting d'une demi-journée : les deux associés (portraits et ensemble), la devanture du 35 rue Jean Jaurès, l'intérieur, la rue. Sans ces photos, les emplacements resteront des aplats colorés. C'est le principal levier de confiance du site.
18. **Avis Google.** Soit une clé API Google Places (nécessite un compte Google Cloud avec facturation activée), soit une copie manuelle de 6 avis représentatifs (prénom + initiale, date, texte). Le second est recommandé : plus simple, gratuit, sans dépendance. Rappel : on n'inventera jamais un avis.
19. **Accès au domaine.** Où est enregistré `cpsolutions77.com` (Wix ? autre registrar ?) et qui a les identifiants ? Nécessaire pour la bascule DNS.
20. **Messagerie.** L'adresse `contact@cpsolutions77.com` est hébergée où (Google Workspace ? Wix ? OVH ?) ? Les enregistrements MX doivent être recopiés à l'identique lors de la bascule, sinon les e-mails s'arrêtent.

## Décisions à valider (recommandation entre parenthèses)

21. **Hébergement Vercel** (oui, plan Hobby suffisant au départ, passage Pro si le trafic l'exige).
22. **Analytics sans cookies** (Vercel Web Analytics, pas de bandeau nécessaire).
23. **Envoi des formulaires** via Resend, expéditeur `formulaire@cpsolutions77.com` (nécessite deux enregistrements DNS).
24. **Carte de l'agence** : image statique + lien « Itinéraire » vers Google Maps, plutôt qu'une carte Google embarquée (cookies tiers et 300 ko de JavaScript en moins).
25. **Calendly** : lien externe (nouvel onglet) plutôt qu'un widget embarqué, pour les mêmes raisons.

---

## Ajouté le 28 août 2026, après réception des photos

Le client a envoyé trois photos : Calvin à son bureau, Paul à son bureau, et la
devanture du 35 rue Jean Jaurès. Elles règlent la question 17 pour l'accueil.

**Reste à obtenir sur les photos :**

26. **Fichiers en pleine résolution.** Les trois photos sont en place et le site
    les affiche, mais elles sont en basse résolution :
    - `devanture.jpg` et `calvin.jpg` : 640 × 500. Acceptable, un peu juste sur
      grand écran.
    - `paul.jpg` : **286 × 357 seulement.** Son cadre fait 384 px sur un écran de
      bureau, soit 768 px en densité double. La photo est donc affichée au-delà
      de sa résolution et paraît molle. **C'est la plus urgente à remplacer.**

    Envoyer les originaux sortis du téléphone, sans passer par une messagerie qui
    recompresse (WhatsApp, iMessage en « basse qualité »).
27. **Autorisation de publication** des deux portraits, à confirmer par écrit
    avec chacun des associés.
28. **Photo de l'intérieur de l'agence**, pour la page `/agence-montereau`
    (Phase 4). La devanture couvre l'accueil, pas la page locale.

**Relevé sur la photo de la devanture, à trancher :**

29. **La vitrine annonce deux produits crédit absents du site et du brief :**
    « Consommation » et « Renégociation ». La vitrine liste :
    - *Assurance* : Sinistré, Résilié, Malussé, Auto, Moto, Habitation, Mutuelle,
      Animaux, RC pro, Décennale, Jeune permis
    - *Crédit* : Immobilier, **Consommation**, Regroupement, **Renégociation**,
      Assurance emprunteur

    « Renégociation » a été rattachée à la page
    `/credits/rachat-regroupement`, qui la couvrira. En revanche le **crédit à la
    consommation** n'a aucune page dans l'architecture validée. Trois options :
    lui créer sa page `/credits/consommation`, l'intégrer à la page rachat, ou le
    retirer de la vitrine s'il n'est plus proposé. Aucun lien mort n'a été créé
    en attendant.
30. **« Sinistré » et « Jeune permis »** sont affichés en vitrine et méritent
    d'être traités sur `/assurances/auto-moto` : ce sont des requêtes de
    recherche à forte intention. Confirmer que ces cas sont bien pris en charge.

---

## Ajouté le 28 août 2026, construction des pages

31. **Export du blog Wix.** Le texte des articles n'est récupérable ni depuis les
    pages publiques (Wix le charge en JavaScript), ni depuis le flux RSS
    `/blog-feed.xml`, qui ne renvoie que les 500 premiers caractères. Aucun
    article n'a été réécrit de mémoire ou inventé.

    Pour reprendre les articles fidèlement, il faut un export depuis le tableau
    de bord Wix. Le moteur de blog est prêt : un fichier Markdown par article
    dans `src/content/blog`, avec le modèle et les consignes dans
    `src/assets/photos/LISEZ-MOI.md` et `src/content/blog/_LISEZ-MOI.md`.

    Constat au passage, qui appuie la curation proposée en question 15 : sur les
    20 articles du flux RSS, **8 n'ont que 155 caractères de résumé**. Ce sont
    les doublons « carte grise 2026 ».

32. **Délai de réponse annoncé.** Le site annonce « pendant les heures
    d'ouverture, dans la demi-journée » sur le formulaire et la page de
    confirmation. À confirmer, ou à corriger : une promesse non tenue coûte plus
    cher qu'une promesse modeste.

33. **Accès à l'agence.** La page `/agence-montereau` indique un stationnement en
    zone bleue devant l'agence et la gare à une dizaine de minutes à pied. À
    vérifier sur place.

34. **Clé Resend.** Créer un compte sur resend.com, vérifier le domaine
    `cpsolutions77.com` (deux enregistrements DNS), puis déclarer
    `RESEND_API_KEY` dans les variables d'environnement Vercel. Sans elle, le
    formulaire affiche une erreur lisible avec le numéro de téléphone en repli.
