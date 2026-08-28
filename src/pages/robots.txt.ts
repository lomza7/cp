import type { APIRoute } from 'astro';
import { site } from '../config/site.ts';
import { isIndexable, deployEnv } from '../lib/env.ts';

/**
 * robots.txt généré au build. Sur toute autre cible que la production, il
 * interdit l'exploration : voir src/lib/env.ts pour la raison.
 */
export const GET: APIRoute = () => {
  const body = isIndexable
    ? `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`
    : `# Déploiement « ${deployEnv} », pas le site de production.
# Interdit à l'exploration pour ne pas dupliquer cpsolutions77.com.
User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
