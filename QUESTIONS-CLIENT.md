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
