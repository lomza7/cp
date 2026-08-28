import { describe, it, expect } from 'vitest';
import {
  formatEuros,
  formatNombre,
  formatTaux,
  formatNote,
  formatDate,
  formatDateCourte,
} from './format.ts';

/** Les espaces d'Intl en français sont insécables : on normalise avant de comparer. */
const n = (s: string) => s.replace(/ | /g, ' ');

describe('formatEuros', () => {
  it('formate un montant avec séparateur de milliers et sans décimale', () => {
    expect(n(formatEuros(248600))).toBe('248 600 €');
  });

  it('arrondit au plus proche', () => {
    expect(n(formatEuros(1084.6))).toBe('1 085 €');
    expect(n(formatEuros(1084.4))).toBe('1 084 €');
  });

  it('gère zéro', () => {
    expect(n(formatEuros(0))).toBe('0 €');
  });
});

describe('formatNombre', () => {
  it('sépare les milliers', () => {
    expect(n(formatNombre(1085))).toBe('1 085');
  });
});

describe('formatTaux', () => {
  it('affiche deux décimales avec une virgule', () => {
    expect(n(formatTaux(3.45))).toBe('3,45 %');
  });

  it('complète les décimales manquantes', () => {
    expect(n(formatTaux(4))).toBe('4,00 %');
  });
});

describe('formatNote', () => {
  it('affiche toujours une décimale', () => {
    expect(formatNote(5)).toBe('5,0');
    expect(formatNote(4.85)).toBe('4,9');
  });
});

describe('formatDate', () => {
  it('écrit la date en français', () => {
    expect(n(formatDate('2026-08-28'))).toBe('28 août 2026');
  });

  it('ne décale pas d’un jour selon le fuseau', () => {
    // Le format court est fixé à midi UTC pour cette raison précise.
    expect(formatDateCourte('2026-01-01')).toBe('01/01/2026');
    expect(formatDateCourte('2026-12-31')).toBe('31/12/2026');
  });
});
