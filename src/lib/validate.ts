/**
 * Règles du formulaire de rappel. Partagées entre l'îlot (validation immédiate)
 * et la route d'API (validation qui fait foi) : une seule définition, donc pas
 * de divergence possible entre ce que le visiteur voit et ce que le serveur
 * accepte.
 */

export const TYPES_DEMANDE = [
  { valeur: 'immobilier', label: 'Prêt immobilier' },
  { valeur: 'rachat', label: 'Rachat ou regroupement de crédits' },
  { valeur: 'emprunteur', label: 'Assurance emprunteur' },
  { valeur: 'auto', label: 'Assurance auto ou moto' },
  { valeur: 'resiliation', label: 'Assurance après résiliation ou malus' },
  { valeur: 'habitation', label: 'Assurance habitation' },
  { valeur: 'professionnel', label: 'Assurance professionnelle, décennale' },
  { valeur: 'autre', label: 'Autre demande' },
] as const;

export const CRENEAUX = [
  { valeur: 'matin', label: 'Le matin, 9h30 à 12h30' },
  { valeur: 'apres-midi', label: "L'après-midi, 14h à 18h" },
  { valeur: 'indifferent', label: 'Peu importe' },
] as const;

export interface DonneesRappel {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  demande: string;
  creneau: string;
  message: string;
  consentement: boolean;
  /** Champ piège : rempli seulement par un robot. */
  piege: string;
}

export type Erreurs = Partial<Record<keyof DonneesRappel, string>>;

/**
 * Téléphone français : on accepte les espaces, points, tirets et le préfixe
 * international, parce que les gens écrivent leur numéro comme ils veulent.
 */
export function normaliserTelephone(brut: string): string {
  return brut.replace(/[\s.\-()]/g, '').replace(/^\+33/, '0');
}

export function telephoneValide(brut: string): boolean {
  const t = normaliserTelephone(brut);
  return /^0[1-9]\d{8}$/.test(t);
}

export function emailValide(brut: string): boolean {
  const v = brut.trim();
  // Volontairement simple : un point dans le domaine et pas d'espace. Les
  // expressions exhaustives rejettent des adresses valides.
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v) && v.length <= 254;
}

export function valider(d: Partial<DonneesRappel>): Erreurs {
  const e: Erreurs = {};

  if (!d.prenom?.trim()) e.prenom = 'Indiquez votre prénom.';
  else if (d.prenom.trim().length > 60) e.prenom = 'Le prénom est trop long.';

  if (!d.nom?.trim()) e.nom = 'Indiquez votre nom.';
  else if (d.nom.trim().length > 60) e.nom = 'Le nom est trop long.';

  if (!d.telephone?.trim()) {
    e.telephone = 'Indiquez un numéro pour qu’on puisse vous rappeler.';
  } else if (!telephoneValide(d.telephone)) {
    e.telephone = 'Ce numéro ne ressemble pas à un numéro français à 10 chiffres.';
  }

  if (!d.email?.trim()) {
    e.email = 'Indiquez votre adresse e-mail.';
  } else if (!emailValide(d.email)) {
    e.email = 'Il manque le nom de domaine après le @, par exemple @gmail.com.';
  }

  if (!d.demande) e.demande = 'Choisissez le type de demande.';
  else if (!TYPES_DEMANDE.some((t) => t.valeur === d.demande)) e.demande = 'Choix invalide.';

  if (!d.creneau) e.creneau = 'Choisissez un créneau d’appel.';
  else if (!CRENEAUX.some((c) => c.valeur === d.creneau)) e.creneau = 'Choix invalide.';

  if (d.message && d.message.length > 2000) e.message = 'Le message est trop long (2000 caractères maximum).';

  if (!d.consentement) {
    e.consentement = 'Cochez la case pour que nous puissions traiter votre demande.';
  }

  return e;
}

export function estValide(e: Erreurs): boolean {
  return Object.keys(e).length === 0;
}

export function libelleDemande(valeur: string): string {
  return TYPES_DEMANDE.find((t) => t.valeur === valeur)?.label ?? valeur;
}

export function libelleCreneau(valeur: string): string {
  return CRENEAUX.find((c) => c.valeur === valeur)?.label ?? valeur;
}
