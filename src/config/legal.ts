/**
 * Mentions réglementaires d'un intermédiaire en assurance (COA) et en opérations
 * de banque (COBSP). Tout champ vide est un manquement vis-à-vis de l'ACPR :
 * la page /mentions-legales affiche alors un placeholder visible, et le build
 * écrit un avertissement listant ce qui manque (voir scripts/check-legal.ts).
 *
 * Renseigner ici, et seulement ici. Les valeurs se propagent partout.
 */

/** Marqueur d'une valeur que le client doit encore fournir. */
export const TODO = '' as const;

export const company = {
  name: 'CP SOLUTIONS',
  /** TODO client (QUESTIONS-CLIENT n° 7) : « SAS », « SARL »... */
  legalForm: TODO,
  /** TODO client (n° 7) : capital social, ex. « 1 000 € ». */
  capital: TODO,
  siren: '903 877 066',
  siret: '903 877 066 00014',
  ape: '6622Z',
  rcs: 'RCS Melun', // TODO client : vérifier le greffe (Melun pour la Seine-et-Marne)
  vatNumber: TODO, // TODO client : n° TVA intracommunautaire, si assujetti
  publicationDirector: 'Paul Poirier',
} as const;

export const orias = {
  /** TODO client (n° 1) : numéro à 8 chiffres, vérifiable sur orias.fr. */
  number: TODO,
  /** TODO client (n° 1) : ex. ['COA', 'COBSP']. */
  categories: [] as string[],
  registryUrl: 'https://www.orias.fr',
} as const;

export const supervisor = {
  name: "Autorité de Contrôle Prudentiel et de Résolution (ACPR)",
  address: '4 place de Budapest, CS 92459, 75436 Paris Cedex 09',
  url: 'https://acpr.banque-france.fr',
} as const;

export const rcPro = {
  /** TODO client (n° 5) : assureur de la RC professionnelle. */
  insurer: TODO,
  policyNumber: TODO,
  /** Textes de référence, affichés tels quels. */
  legalBasis: 'articles L.512-6 et L.512-7 du Code des assurances',
} as const;

export const financialGuarantee = {
  /** TODO client (n° 5) : garant financier, si le cabinet encaisse des fonds. Sinon, indiquer « non applicable ». */
  provider: TODO,
  amount: TODO,
} as const;

export const professionalAssociation = {
  /** TODO client (n° 2) : association professionnelle agréée (obligatoire COBSP). */
  name: TODO,
  memberNumber: TODO,
} as const;

export const remuneration = {
  /**
   * TODO client (n° 3). Valeurs possibles :
   *  'commissions'  : rémunération par les compagnies et établissements partenaires
   *  'honoraires'   : honoraires facturés au client
   *  'mixte'        : les deux
   */
  mode: TODO as '' | 'commissions' | 'honoraires' | 'mixte',
  /** Barème ou montant des honoraires de courtage crédit, si applicable. */
  feesDetail: TODO,
} as const;

export const financialLinks = {
  /**
   * TODO client (n° 4). Le cabinet détient-il > 10 % d'une entreprise d'assurance,
   * ou une entreprise d'assurance détient-elle > 10 % du cabinet ?
   * Laisser `null` tant que la réponse n'est pas connue.
   */
  hasLinks: null as null | boolean,
  detail: TODO,
} as const;

export const complaints = {
  /** TODO client (n° 6) : adresse e-mail dédiée aux réclamations. */
  email: TODO,
  postalAddress: '35 rue Jean Jaurès, 77130 Montereau-Fault-Yonne',
  /** Délais réglementaires (recommandation ACPR 2022-R-01). */
  acknowledgementDays: '10 jours ouvrables',
  answerDelay: '2 mois',
} as const;

export const mediators = {
  insurance: {
    name: "La Médiation de l'Assurance",
    address: 'TSA 50110, 75441 Paris Cedex 09',
    url: 'https://www.mediation-assurance.org',
  },
  credit: {
    /** TODO client : médiateur désigné par l'association professionnelle (n° 2). */
    name: TODO,
    address: TODO,
    url: TODO,
  },
} as const;

export const host = {
  name: 'Vercel Inc.',
  address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  url: 'https://vercel.com',
} as const;

/**
 * Liste des champs obligatoires et de leur état. Utilisée par la page
 * mentions légales (placeholders) et par `npm run check:legal`.
 */
export function missingLegalFields(): string[] {
  const missing: string[] = [];
  const check = (label: string, value: unknown) => {
    const empty =
      value === TODO || value === null || value === undefined || (Array.isArray(value) && value.length === 0);
    if (empty) missing.push(label);
  };
  check('company.legalForm (forme juridique)', company.legalForm);
  check('company.capital (capital social)', company.capital);
  check('orias.number (numéro ORIAS)', orias.number);
  check("orias.categories (catégories d'immatriculation)", orias.categories);
  check('rcPro.insurer (assureur RC professionnelle)', rcPro.insurer);
  check('financialGuarantee.provider (garantie financière ou « non applicable »)', financialGuarantee.provider);
  check('professionalAssociation.name (association professionnelle agréée)', professionalAssociation.name);
  check('remuneration.mode (mode de rémunération)', remuneration.mode);
  check('financialLinks.hasLinks (liens financiers avec des assureurs)', financialLinks.hasLinks);
  check('complaints.email (adresse de réclamation)', complaints.email);
  check('mediators.credit.name (médiateur crédit)', mediators.credit.name);
  return missing;
}
