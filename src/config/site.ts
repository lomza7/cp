/**
 * Données du cabinet. Une seule source de vérité : rien de tout ceci ne doit
 * être écrit en dur dans un composant.
 */

export const site = {
  name: 'CP SOLUTIONS',
  legalName: 'CP SOLUTIONS',
  tagline: 'Cabinet de courtage',
  slogan: 'Vos projets sont les nôtres',
  url: 'https://www.cpsolutions77.com',
  locale: 'fr-FR',
  foundedYear: 2021,
  description:
    "Courtier en assurances et crédits à Montereau-Fault-Yonne. Deux associés, une agence rue Jean Jaurès ouverte du lundi au samedi, qui décrochent leur téléphone.",
} as const;

export const contact = {
  /** Affiché tel quel. */
  phoneDisplay: '01 64 24 83 45',
  /** Format pour les liens tel: et le balisage structuré. */
  phoneHref: 'tel:+33164248345',
  phoneE164: '+33164248345',
  email: 'contact@cpsolutions77.com',
  calendly: 'https://calendly.com/cpsolutions77',
} as const;

export const address = {
  street: '35 rue Jean Jaurès',
  postalCode: '77130',
  city: 'Montereau-Fault-Yonne',
  region: 'Seine-et-Marne',
  country: 'FR',
  /** TODO client : coordonnées exactes à relever sur la fiche Google (précision au mètre). */
  geo: { lat: 48.3861, lng: 2.9553 },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=CP+SOLUTIONS+35+rue+Jean+Jaur%C3%A8s+77130+Montereau-Fault-Yonne',
} as const;

/**
 * Horaires réels (brief du 28/08/2026), à confirmer par le client (QUESTIONS-CLIENT n° 9).
 * `null` = fermé. Les heures sont en "HH:MM" pour le balisage OpeningHoursSpecification.
 */
export type DaySlots = readonly (readonly [string, string])[] | null;

export const hours: readonly { day: string; short: string; iso: string; slots: DaySlots }[] = [
  { day: 'Lundi', short: 'Lun', iso: 'Monday', slots: [['09:30', '12:30'], ['14:30', '16:30']] },
  { day: 'Mardi', short: 'Mar', iso: 'Tuesday', slots: [['09:30', '12:30'], ['14:00', '18:00']] },
  { day: 'Mercredi', short: 'Mer', iso: 'Wednesday', slots: [['09:30', '12:30'], ['14:00', '18:00']] },
  { day: 'Jeudi', short: 'Jeu', iso: 'Thursday', slots: [['09:30', '12:30'], ['14:00', '18:00']] },
  { day: 'Vendredi', short: 'Ven', iso: 'Friday', slots: [['09:30', '12:30'], ['14:00', '18:00']] },
  { day: 'Samedi', short: 'Sam', iso: 'Saturday', slots: [['09:30', '12:30'], ['13:30', '16:30']] },
  { day: 'Dimanche', short: 'Dim', iso: 'Sunday', slots: null },
];

/** Affichage "9h30 - 12h30". */
export function formatSlot([from, to]: readonly [string, string]): string {
  const f = (t: string) => t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
  return `${f(from)} - ${f(to)}`;
}

export const team = [
  {
    id: 'paul',
    firstName: 'Paul',
    lastName: 'Poirier',
    role: 'Associé, assurances',
    domain: 'assurances',
    quote:
      "Plein de ressources et de détermination, je m'obstine à trouver des solutions.",
  },
  {
    id: 'calvin',
    firstName: 'Calvin',
    lastName: 'Riffault',
    role: 'Associé, crédits',
    domain: 'credits',
    quote:
      'Jeune, dynamique et ambitieux autant pour mes clients que pour moi-même, je vous accompagne dans tous vos projets.',
  },
] as const;

export const social = {
  facebook: 'https://www.facebook.com/CPSolutions77',
  instagram: 'https://www.instagram.com/cpsolutions77/',
  linkedin: 'https://www.linkedin.com/company/cp-solutions-cabinet-de-courtage/',
} as const;

/**
 * Note Google. Les chiffres viennent du brief (28/08/2026) et doivent être
 * rafraîchis à la main avec le fichier src/content/reviews.json (Phase 3).
 * TODO client : URL exacte de la fiche Google Business Profile (QUESTIONS-CLIENT n° 18).
 */
export const googleReviews = {
  rating: 5.0,
  count: 84,
  checkedAt: '2026-08-28',
  url: address.mapsUrl,
} as const;

/** Formulaires de devis externes (ouverture dans un nouvel onglet). */
export const quoteForms = {
  auto: 'https://pro-formulaire.app.lyaprotect.com?id=3a2004aa-df2f-46e7-8725-f67fab88fc63',
  moto: 'https://pro-formulaire.app.lyaprotect.com?id=de4ba9f1-7a15-4dc1-b6c0-8f4560de19f9',
  habitation: 'https://pro-formulaire.app.lyaprotect.com?id=784ba6a2-32fe-4e08-bea7-13ae800c976f',
  sante: 'https://pro-formulaire.app.lyaprotect.com?id=a4bdbd13-4bf7-4cae-a86a-7e1278f21946',
  santeAnimale: 'https://pro-formulaire.app.lyaprotect.com?id=312e7013-ee3b-4c66-b927-5c6316566585',
  decennale: 'https://pro-formulaire.app.lyaprotect.com?id=06e1eedf-618b-4954-b715-e769b30b434b',
  dommageOuvrage: 'https://pro-formulaire.app.lyaprotect.com?id=92057954-12c2-4710-b5f7-c92b3a014fd8',
  emprunteur: 'https://cp-solutions.assurdistribution.fr/',
} as const;

/** Zone desservie, pour le SEO local et le balisage areaServed. */
export const areaServed = [
  'Montereau-Fault-Yonne',
  'Nemours',
  'Sens',
  'Fontainebleau',
  'Seine-et-Marne',
] as const;

/** Navigation principale : cinq entrées, pas une de plus. */
export const nav = [
  { label: 'Assurances', href: '/assurances' },
  { label: 'Crédits', href: '/credits' },
  { label: 'Le cabinet', href: '/le-cabinet' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

export const footerNav = {
  assurances: [
    { label: 'Auto et moto', href: '/assurances/auto-moto' },
    { label: 'Habitation', href: '/assurances/habitation' },
    { label: 'Professionnels', href: '/assurances/professionnels' },
    { label: 'Camping-car', href: '/assurances/camping-car' },
    { label: 'Santé, animaux, voyage, GLI', href: '/assurances/autres' },
    { label: 'Assurance emprunteur', href: '/assurance-emprunteur' },
    { label: "Lexique de l'assurance", href: '/assurances/lexique' },
  ],
  credits: [
    { label: 'Prêt immobilier', href: '/credits/immobilier' },
    { label: 'Rachat et regroupement de crédits', href: '/credits/rachat-regroupement' },
    { label: 'Assurance emprunteur', href: '/assurance-emprunteur' },
    { label: 'Simulateur de capacité d’emprunt', href: '/credits#simulateur' },
    { label: 'Lexique du crédit', href: '/credits/lexique' },
  ],
  cabinet: [
    { label: 'Le cabinet', href: '/le-cabinet' },
    { label: "L'agence de Montereau", href: '/agence-montereau' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'Cookies', href: '/cookies' },
  ],
} as const;
