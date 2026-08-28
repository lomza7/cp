import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';
import { allRedirects } from './src/config/redirects.ts';
import { site } from './src/config/site.ts';
import { avertissements } from './src/lib/build-warnings.ts';

/**
 * Toutes les pages sont pré-rendues au build. Seule exception :
 * src/pages/api/contact.ts, qui déclare `export const prerender = false`.
 */
export default defineConfig({
  site: site.url,
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  trailingSlash: 'never',

  /**
   * Redirections 301 des anciennes URLs Wix. La table vit dans
   * src/config/redirects.ts et est vérifiée par `npm run check:redirects`.
   */
  redirects: Object.fromEntries(
    Object.entries(allRedirects()).map(([from, to]) => [from, { status: 301, destination: to }]),
  ),

  integrations: [
    avertissements(),
    icon({ include: { ph: ['*'] } }),
    sitemap({
      filter: (page) => !page.includes('/contact/merci'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],

  build: {
    // Les feuilles de style du site tiennent en quelques kilo-octets :
    // les inliner supprime une requête bloquante sur le chemin critique.
    inlineStylesheets: 'always',
  },

  prefetch: {
    // Précharge au survol seulement, pour ne pas consommer la 4G du visiteur.
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
