/**
 * Environnement de déploiement, lu au build.
 *
 * Vercel renseigne VERCEL_ENV à « production », « preview » ou « development ».
 * Tout ce qui n'est pas la production ne doit pas être indexable : une URL de
 * préproduction publiquement crawlable, avec des balises canoniques qui pointent
 * vers cpsolutions77.com, créerait du contenu dupliqué contre le référencement
 * qu'on cherche justement à préserver.
 */
export const deployEnv: 'production' | 'preview' | 'development' =
  (process.env.VERCEL_ENV as 'production' | 'preview' | 'development') ?? 'development';

/** Vrai uniquement sur le domaine de production. */
export const isIndexable = deployEnv === 'production';
