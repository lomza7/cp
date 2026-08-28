import type { APIRoute } from 'astro';
import { site } from '../config/site.ts';
import { isIndexable, raisonNonIndexable } from '../lib/env.ts';

/**
 * robots.txt généré au build. Tant que le site n'est pas servi sur son vrai
 * domaine, il interdit l'exploration : voir src/lib/env.ts pour la raison.
 */
export const GET: APIRoute = () => {
  const body = isIndexable
    ? `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`
    : `# Déploiement non indexable : ${raisonNonIndexable()}.
# Interdit à l'exploration pour ne pas dupliquer ${new URL(site.url).host}.
User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
