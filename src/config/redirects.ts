/**
 * Anciennes URLs (site Wix, 2021-2026) vers les nouvelles. Source unique :
 * astro.config.ts l'importe pour générer les règles 301, et
 * scripts/check-redirects.mjs la relit pour tester le site déployé.
 *
 * Les URLs accentuées sont déclarées deux fois (forme brute et forme
 * percent-encodée) parce que les clients HTTP ne s'accordent pas sur la
 * normalisation.
 */

export const pageRedirects: Record<string, string> = {
  '/quisommesnous': '/le-cabinet',
  '/uncourtier': '/le-cabinet',
  '/lagence': '/agence-montereau',
  '/mondevisassurance': '/assurances',
  '/assuranceautomoto': '/assurances/auto-moto',
  '/assurancehabitation': '/assurances/habitation',
  '/assuranceprofessionelles': '/assurances/professionnels',
  '/camping-car': '/assurances/camping-car',
  '/vosassurances': '/assurances/autres',
  '/lexiqueassurance': '/assurances/lexique',
  '/masimulationcreditimmobilier': '/credits',
  '/créditimmobilier': '/credits/immobilier',
  '/rachatregroupement': '/credits/rachat-regroupement',
  '/lexiqueducrédit': '/credits/lexique',
  '/assuranceemprunteur': '/assurance-emprunteur',
  '/lassuranceemprunteur': '/assurance-emprunteur',
  '/contactez-nous': '/contact',
  '/actualité': '/blog',
  '/actualité/categories/actualité-générale': '/blog',
  '/actualité/categories/assurance': '/blog',
  '/mentions-légales': '/mentions-legales',
  // Pages techniques Wix indexées (module de réservation en ligne)
  '/book-online': '/contact',
  '/inquiry-services-page': '/contact',
  '/service-page/assurances': '/assurances',
  '/service-page/crédits': '/credits',
};

/**
 * Articles de blog : ancien slug Wix -> nouveau slug (dé-accentué).
 * Rempli en Phase 4 après curation (docs/redirections.md). Les articles fusionnés
 * pointent vers l'article conservé, les brèves saisonnières vers /blog.
 */
export const postRedirects: Record<string, string> = {};

/** Ajoute la variante percent-encodée de chaque clé contenant un caractère non ASCII. */
export function withEncodedVariants(map: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [from, to] of Object.entries(map)) {
    out[from] = to;
    const encoded = encodeURI(from);
    if (encoded !== from) out[encoded] = to;
  }
  return out;
}

export function allRedirects(): Record<string, string> {
  const posts: Record<string, string> = {};
  for (const [slug, target] of Object.entries(postRedirects)) {
    posts[`/post/${slug}`] = target.startsWith('/') ? target : `/blog/${target}`;
  }
  return withEncodedVariants({ ...pageRedirects, ...posts });
}
