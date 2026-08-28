import { describe, it, expect } from 'vitest';
import { simuler } from './simulate.ts';

describe('simuler', () => {
  it('applique le taux d’endettement de 35 % et retire les charges', () => {
    const r = simuler({ revenus: 3000, charges: 200, apport: 0, duree: 20, taux: 3.45 });
    // 3000 * 0.35 = 1050, moins 200 de charges
    expect(r.mensualite).toBeCloseTo(850, 6);
  });

  it('calcule le capital selon la formule d’annuité', () => {
    // Vérification indépendante : 1000 € sur 20 ans à 3,45 %
    const r = simuler({ revenus: 1000 / 0.35, charges: 0, apport: 0, duree: 20, taux: 3.45 });
    const i = 3.45 / 100 / 12;
    const attendu = (1000 * (1 - (1 + i) ** -240)) / i;
    expect(r.capital).toBeCloseTo(attendu, 4);
    expect(r.capital).toBeGreaterThan(170000);
    expect(r.capital).toBeLessThan(180000);
  });

  it('ajoute l’apport au budget, sans l’emprunter', () => {
    const sans = simuler({ revenus: 3200, charges: 0, apport: 0, duree: 25 });
    const avec = simuler({ revenus: 3200, charges: 0, apport: 30000, duree: 25 });
    expect(avec.capital).toBeCloseTo(sans.capital, 6);
    expect(avec.budget).toBeCloseTo(sans.budget + 30000, 6);
  });

  it('allonger la durée augmente le capital mais aussi les intérêts', () => {
    const court = simuler({ revenus: 3200, charges: 0, apport: 0, duree: 15 });
    const long = simuler({ revenus: 3200, charges: 0, apport: 0, duree: 25 });
    expect(long.capital).toBeGreaterThan(court.capital);
    expect(long.interets).toBeGreaterThan(court.interets);
  });

  it('un taux plus élevé réduit le capital', () => {
    const bas = simuler({ revenus: 3200, charges: 0, apport: 0, duree: 20, taux: 2 });
    const haut = simuler({ revenus: 3200, charges: 0, apport: 0, duree: 20, taux: 5 });
    expect(haut.capital).toBeLessThan(bas.capital);
  });

  it('ne renvoie jamais de capital négatif quand les charges dépassent la capacité', () => {
    const r = simuler({ revenus: 1500, charges: 900, apport: 10000, duree: 20 });
    expect(r.mensualite).toBe(0);
    expect(r.capital).toBe(0);
    expect(r.finançable).toBe(false);
    // L'apport reste acquis : c'est de l'argent disponible, pas un emprunt.
    expect(r.budget).toBe(10000);
  });

  it('gère un taux nul sans division par zéro', () => {
    const r = simuler({ revenus: 1000 / 0.35, charges: 0, apport: 0, duree: 10, taux: 0 });
    expect(r.capital).toBeCloseTo(1000 * 120, 6);
    expect(r.interets).toBeCloseTo(0, 6);
  });

  it('reste cohérent : capital + apport = budget', () => {
    for (const duree of [5, 10, 15, 20, 25]) {
      const r = simuler({ revenus: 4200, charges: 350, apport: 45000, duree });
      expect(r.budget).toBeCloseTo(r.capital + 45000, 6);
    }
  });
});
