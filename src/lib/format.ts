/** Formatage français, partagé entre le serveur (build) et les deux îlots. */

const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

/** 248600 -> « 248 600 € » */
export function formatEuros(value: number): string {
  return euro.format(Math.round(value));
}

/** 1085 -> « 1 085 » */
export function formatNombre(value: number): string {
  return nombre.format(Math.round(value));
}

/** 3.45 -> « 3,45 % » */
export function formatTaux(value: number): string {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} %`;
}

/** 5 -> « 5,0 » */
export function formatNote(value: number): string {
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** '2026-08-28' -> « 28 août 2026 » */
export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** '2026-08-28' -> « 28/08/2026 » */
export function formatDateCourte(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-FR');
}
