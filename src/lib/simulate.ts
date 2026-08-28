/**
 * Capacité d'emprunt. Fonction pure, sans DOM : elle est testée unitairement et
 * utilisée telle quelle par l'îlot du simulateur.
 *
 *   mensualite_max = revenus * taux_endettement - charges
 *   i              = taux_annuel / 12
 *   n              = duree_annees * 12
 *   capital        = mensualite_max * (1 - (1 + i)^-n) / i
 *   budget_total   = capital + apport
 */
import { rates } from '../config/rates.ts';

export interface EntreesSimulation {
  /** Revenus nets mensuels du foyer, en euros. */
  revenus: number;
  /** Mensualités de crédits en cours, en euros. */
  charges: number;
  /** Apport personnel, en euros. */
  apport: number;
  /** Durée du prêt, en années. */
  duree: number;
  /** Taux nominal annuel en pourcentage. Par défaut celui de la configuration. */
  taux?: number;
  /** Taux d'endettement maximal. Par défaut celui de la configuration. */
  tauxEndettement?: number;
}

export interface ResultatSimulation {
  /** Mensualité maximale supportable. */
  mensualite: number;
  /** Capital empruntable. */
  capital: number;
  /** Budget d'achat total : capital + apport. */
  budget: number;
  /** Coût total des intérêts sur la durée. */
  interets: number;
  /** Faux quand les charges absorbent toute la capacité. */
  finançable: boolean;
}

export function simuler({
  revenus,
  charges,
  apport,
  duree,
  taux = rates.nominalRate,
  tauxEndettement = rates.maxDebtRatio,
}: EntreesSimulation): ResultatSimulation {
  const mensualiteBrute = revenus * tauxEndettement - charges;
  const mensualite = Math.max(0, mensualiteBrute);
  const n = duree * 12;
  const i = taux / 100 / 12;

  // Taux nul : le capital est la simple somme des mensualités.
  const capital = mensualite === 0 ? 0 : i === 0 ? mensualite * n : (mensualite * (1 - (1 + i) ** -n)) / i;

  return {
    mensualite,
    capital,
    budget: capital + apport,
    interets: mensualite * n - capital,
    finançable: mensualiteBrute > 0,
  };
}
