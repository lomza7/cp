/**
 * `npm run check:legal`
 *
 * Liste l'état des mentions réglementaires obligatoires. N'échoue jamais :
 * le site doit pouvoir être construit et prévisualisé avec des placeholders.
 */
import { missingLegalFields } from '../src/config/legal.ts';

const missing = missingLegalFields();

if (missing.length === 0) {
  console.log('\n  Mentions légales : complètes. Rien à obtenir du client.\n');
  process.exit(0);
}

const lignes = missing.map((champ) => `    - ${champ}`).join('\n');

console.log(`
  ---------------------------------------------------------------------
  MENTIONS LÉGALES INCOMPLÈTES
  ---------------------------------------------------------------------

  ${missing.length} champ(s) manquant(s) dans src/config/legal.ts :

${lignes}

  Sans ces mentions, le site est en infraction vis-à-vis de l'ACPR
  (articles L.512-6 et L.512-7 du Code des assurances, articles R.519-20
  et suivants du Code monétaire et financier). La page /mentions-legales
  affiche un placeholder visible pour chacun.

  Ces informations sont à demander au client : voir QUESTIONS-CLIENT.md,
  questions 1 à 7.
`);

process.exit(0);
