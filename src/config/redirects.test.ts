import { describe, it, expect } from 'vitest';
import { pageRedirects, allRedirects, withEncodedVariants } from './redirects.ts';

const redirects = allRedirects();

describe('table de redirections', () => {
  it('déclare une variante percent-encodée pour chaque URL accentuée', () => {
    expect(redirects['/créditimmobilier']).toBe('/credits/immobilier');
    expect(redirects['/cr%C3%A9ditimmobilier']).toBe('/credits/immobilier');
    expect(redirects['/mentions-l%C3%A9gales']).toBe('/mentions-legales');
    expect(redirects['/actualit%C3%A9']).toBe('/blog');
  });

  it('laisse les URLs ASCII inchangées, sans doublon', () => {
    const asciiKeys = Object.keys(pageRedirects).filter((k) => encodeURI(k) === k);
    for (const k of asciiKeys) {
      expect(redirects[k]).toBe(pageRedirects[k]);
    }
  });

  it('ne crée aucune chaîne de redirections', () => {
    // Une cible ne doit jamais être elle-même une source : deux sauts coûtent
    // du budget de crawl et diluent le signal du lien.
    for (const [from, to] of Object.entries(redirects)) {
      expect(redirects[to], `${from} -> ${to} -> ${redirects[to]}`).toBeUndefined();
    }
  });

  it('redirige les deux pages assurance emprunteur vers la même', () => {
    expect(redirects['/assuranceemprunteur']).toBe('/assurance-emprunteur');
    expect(redirects['/lassuranceemprunteur']).toBe('/assurance-emprunteur');
  });

  it('redirige les pages techniques Wix', () => {
    expect(redirects['/book-online']).toBe('/contact');
    expect(redirects['/inquiry-services-page']).toBe('/contact');
    expect(redirects['/service-page/assurances']).toBe('/assurances');
    expect(redirects['/service-page/crédits']).toBe('/credits');
  });

  it('n’a que des cibles absolues commençant par /', () => {
    for (const to of Object.values(redirects)) {
      expect(to.startsWith('/')).toBe(true);
    }
  });

  it('ne se redirige jamais vers soi-même', () => {
    for (const [from, to] of Object.entries(redirects)) {
      expect(from).not.toBe(to);
    }
  });
});

describe('withEncodedVariants', () => {
  it('n’ajoute rien quand la clé est déjà en ASCII', () => {
    expect(withEncodedVariants({ '/a': '/b' })).toEqual({ '/a': '/b' });
  });

  it('ajoute la forme encodée sans perdre la forme brute', () => {
    expect(withEncodedVariants({ '/é': '/e' })).toEqual({ '/é': '/e', '/%C3%A9': '/e' });
  });
});
