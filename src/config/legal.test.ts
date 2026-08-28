import { describe, it, expect } from 'vitest';
import { missingLegalFields, company, orias, supervisor, mediators, host } from './legal.ts';

describe('mentions légales', () => {
  it('signale tous les champs encore vides', () => {
    const missing = missingLegalFields();
    // Tant que le client n'a pas répondu, cette liste ne doit pas être vide :
    // un test vert ici prouverait qu'on affiche du blanc au lieu d'un placeholder.
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.some((m) => m.includes('ORIAS'))).toBe(true);
  });

  it('conserve les identifiants connus, relevés sur le site actuel', () => {
    expect(company.siren).toBe('903 877 066');
    expect(company.siret).toBe('903 877 066 00014');
    expect(company.ape).toBe('6622Z');
    expect(company.publicationDirector).toBe('Paul Poirier');
  });

  it('renseigne les mentions qui ne dépendent pas du client', () => {
    expect(supervisor.address).toContain('4 place de Budapest');
    expect(supervisor.address).toContain('75436 Paris Cedex 09');
    expect(mediators.insurance.name).toBe("La Médiation de l'Assurance");
    expect(host.name).toBe('Vercel Inc.');
    expect(orias.registryUrl).toBe('https://www.orias.fr');
  });
});
