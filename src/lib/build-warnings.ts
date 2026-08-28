/**
 * Intégration Astro qui écrit un avertissement au build quand une donnée
 * réglementaire manque ou quand le taux du simulateur est périmé.
 * Elle n'échoue jamais : la recette doit rester déployable.
 */
import type { AstroIntegration } from 'astro';
import { missingLegalFields } from '../config/legal.ts';
import { rates, RATE_STALE_AFTER_DAYS } from '../config/rates.ts';

function joursDepuis(iso: string): number {
  return Math.floor((Date.now() - new Date(`${iso}T12:00:00Z`).getTime()) / 86_400_000);
}

export function avertissements(): AstroIntegration {
  return {
    name: 'cp-avertissements',
    hooks: {
      'astro:build:done': ({ logger }) => {
        const manquants = missingLegalFields();
        if (manquants.length > 0) {
          logger.warn(
            `${manquants.length} mention(s) légale(s) manquante(s), le site n'est pas conforme ACPR : ` +
              manquants.join(', ') +
              '. Détail : npm run check:legal',
          );
        }

        const age = joursDepuis(rates.updatedAt);
        if (age > RATE_STALE_AFTER_DAYS) {
          logger.warn(
            `Taux du simulateur inchangé depuis ${age} jours (${rates.nominalRate} %, ` +
              `mis à jour le ${rates.updatedAt}). À rafraîchir dans src/config/rates.ts.`,
          );
        }
      },
    },
  };
}
