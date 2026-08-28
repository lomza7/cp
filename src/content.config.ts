import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Articles du blog, en Markdown dans le dépôt. Aucune base de données, aucun
 * back-office : un fichier par article, versionné.
 *
 * Si le client souhaite publier lui-même (QUESTIONS-CLIENT n° 14), un CMS
 * git-based comme Decap se branche sur ce même dossier sans rien changer ici.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    titre: z.string().max(120),
    description: z.string().max(300),
    /** Date de publication d'origine, à conserver lors d'une reprise. */
    date: z.coerce.date(),
    /** Date de dernière réécriture, si l'article a été retravaillé. */
    maj: z.coerce.date().optional(),
    /** « assurances » ou « credits » : colore la page et le fil d'Ariane. */
    metier: z.enum(['assurances', 'credits']).optional(),
    /** Pages du site vers lesquelles l'article doit renvoyer. */
    liens: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { blog };
