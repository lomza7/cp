import { describe, it, expect } from 'vitest';
import {
  valider,
  estValide,
  telephoneValide,
  emailValide,
  normaliserTelephone,
  libelleDemande,
} from './validate.ts';

const bon = {
  prenom: 'Aïcha',
  nom: 'Benaïssa',
  telephone: '06 12 34 56 78',
  email: 'aicha.benaissa@example.fr',
  demande: 'immobilier',
  creneau: 'matin',
  message: '',
  consentement: true,
  piege: '',
};

describe('normaliserTelephone', () => {
  it('retire les séparateurs que les gens utilisent', () => {
    expect(normaliserTelephone('06 12 34 56 78')).toBe('0612345678');
    expect(normaliserTelephone('06.12.34.56.78')).toBe('0612345678');
    expect(normaliserTelephone('06-12-34-56-78')).toBe('0612345678');
  });

  it('convertit le préfixe international', () => {
    expect(normaliserTelephone('+33 6 12 34 56 78')).toBe('0612345678');
  });
});

describe('telephoneValide', () => {
  it('accepte les formats courants', () => {
    for (const t of ['0612345678', '06 12 34 56 78', '+33612345678', '01.64.24.83.45']) {
      expect(telephoneValide(t), t).toBe(true);
    }
  });

  it('refuse ce qui n’est pas un numéro français', () => {
    for (const t of ['', '12345', '0012345678', '0012', '06123456789', 'abcdefghij', '0012345678']) {
      expect(telephoneValide(t), t).toBe(false);
    }
  });

  it('refuse un indicatif commençant par zéro', () => {
    expect(telephoneValide('0012345678')).toBe(false);
  });
});

describe('emailValide', () => {
  it('accepte les adresses réelles, y compris à sous-domaine', () => {
    for (const m of ['a@b.fr', 'paul.poirier@cpsolutions77.com', 'x+tag@mail.co.uk']) {
      expect(emailValide(m), m).toBe(true);
    }
  });

  it('refuse une adresse sans domaine complet', () => {
    for (const m of ['', 'paul', 'paul@', 'paul@gmail', '@gmail.com', 'a b@c.fr', 'a@b..fr']) {
      expect(emailValide(m), m).toBe(false);
    }
  });
});

describe('valider', () => {
  it('accepte un formulaire correct', () => {
    expect(estValide(valider(bon))).toBe(true);
  });

  it('exige le consentement, jamais pré-coché', () => {
    const e = valider({ ...bon, consentement: false });
    expect(e.consentement).toBeTruthy();
  });

  it('signale chaque champ obligatoire manquant', () => {
    const e = valider({});
    for (const champ of ['prenom', 'nom', 'telephone', 'email', 'demande', 'creneau', 'consentement'] as const) {
      expect(e[champ], champ).toBeTruthy();
    }
  });

  it('dit quoi corriger, pas seulement que c’est invalide', () => {
    expect(valider({ ...bon, email: 'paul@gmail' }).email).toContain('@gmail.com');
    expect(valider({ ...bon, telephone: '123' }).telephone).toContain('10 chiffres');
  });

  it('refuse un type de demande inventé', () => {
    expect(valider({ ...bon, demande: 'crypto' }).demande).toBeTruthy();
  });

  it('refuse un message démesuré', () => {
    expect(valider({ ...bon, message: 'a'.repeat(2001) }).message).toBeTruthy();
    expect(estValide(valider({ ...bon, message: 'a'.repeat(2000) }))).toBe(true);
  });

  it('laisse le message facultatif', () => {
    expect(estValide(valider({ ...bon, message: '' }))).toBe(true);
  });
});

describe('libelleDemande', () => {
  it('traduit la valeur en libellé lisible pour l’e-mail', () => {
    expect(libelleDemande('resiliation')).toBe('Assurance après résiliation ou malus');
  });

  it('renvoie la valeur brute si elle est inconnue', () => {
    expect(libelleDemande('inconnu')).toBe('inconnu');
  });
});
