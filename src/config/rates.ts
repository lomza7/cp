/**
 * Paramètres du simulateur de capacité d'emprunt.
 * À mettre à jour à la main quand les taux bougent : changer `nominalRate`
 * et `updatedAt`, rien d'autre. La date est affichée sous le simulateur.
 */
export const rates = {
  /** Taux nominal annuel, en pourcentage. */
  nominalRate: 3.45,
  /** Date de la dernière mise à jour du taux (AAAA-MM-JJ). */
  updatedAt: '2026-08-28',
  /** Taux d'endettement maximal (recommandation HCSF : 35 % assurance comprise). */
  maxDebtRatio: 0.35,
  /** Bornes des curseurs. */
  bounds: {
    income: { min: 1000, max: 15000, step: 50, default: 3200 },
    charges: { min: 0, max: 3000, step: 25, default: 0 },
    deposit: { min: 0, max: 200000, step: 1000, default: 20000 },
    years: { min: 5, max: 25, step: 1, default: 25 },
  },
} as const;

/** Au-delà de ce délai sans mise à jour, le build avertit. */
export const RATE_STALE_AFTER_DAYS = 180;
