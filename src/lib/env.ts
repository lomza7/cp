import { site } from '../config/site.ts';

/**
 * Environnement de déploiement, lu au build.
 *
 * Vercel renseigne VERCEL_ENV à « production », « preview » ou « development »,
 * et VERCEL_PROJECT_PRODUCTION_URL avec le domaine de production du projet.
 */
export const deployEnv: 'production' | 'preview' | 'development' =
  (process.env.VERCEL_ENV as 'production' | 'preview' | 'development') ?? 'development';

/** Domaine de production du projet Vercel, ex. « cpsolutions77.vercel.app ». */
const productionUrl = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? '').toLowerCase();

/** Le domaine que le site revendique dans ses balises canoniques. */
const canonicalHost = new URL(site.url).host.toLowerCase();

/**
 * Indexable uniquement sur le vrai domaine.
 *
 * La cible « production » de Vercel ne suffit pas : tant que
 * cpsolutions77.com n'est pas rattaché au projet, cette cible est servie sur une
 * adresse en .vercel.app. Une telle URL, publiquement explorable avec des
 * canoniques qui pointent vers cpsolutions77.com, créerait du contenu dupliqué
 * contre le référencement qu'on cherche justement à préserver.
 *
 * Conséquence pratique : l'indexation s'ouvre d'elle-même le jour de la bascule
 * DNS, sans toucher au code.
 */
export const isIndexable =
  deployEnv === 'production' &&
  (productionUrl === canonicalHost || productionUrl === canonicalHost.replace(/^www\./, ''));

/** Raison lisible, écrite dans le robots.txt pour que ce ne soit pas un mystère. */
export function raisonNonIndexable(): string {
  if (deployEnv !== 'production') return `cible « ${deployEnv} »`;
  if (!productionUrl) return 'domaine de production inconnu';
  return `servi sur ${productionUrl}, pas sur ${canonicalHost}`;
}
