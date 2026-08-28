/**
 * Constructeurs de balisage JSON-LD. Les valeurs viennent toutes de
 * src/config/, jamais des composants.
 */
import { site, contact, address, hours, googleReviews, areaServed, social } from '../config/site.ts';
import { company, orias } from '../config/legal.ts';

const ORG_ID = `${site.url}/#organisation`;

/**
 * InsuranceAgency est un sous-type de LocalBusiness : il porte la même
 * sémantique locale (adresse, horaires, note) tout en disant le métier.
 * On ajoute FinancialService pour l'activité de courtage en crédit.
 */
export function localBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': ['InsuranceAgency', 'FinancialService'],
    '@id': ORG_ID,
    name: site.name,
    legalName: company.name,
    description: site.description,
    url: site.url,
    telephone: contact.phoneE164,
    email: contact.email,
    image: `${site.url}/images/logo.png`,
    logo: `${site.url}/images/logo.png`,
    priceRange: 'Gratuit pour le client particulier',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: address.geo.lat,
      longitude: address.geo.lng,
    },
    hasMap: address.mapsUrl,
    openingHoursSpecification: hours
      .filter((d) => d.slots)
      .flatMap((d) =>
        d.slots!.map((slot) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${d.iso}`,
          opens: slot[0],
          closes: slot[1],
        })),
      ),
    areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
    sameAs: [social.facebook, social.instagram, social.linkedin],
    // Renseigné dès que le client fournit son numéro (QUESTIONS-CLIENT n° 1).
    ...(orias.number
      ? { identifier: { '@type': 'PropertyValue', name: 'ORIAS', value: orias.number } }
      : {}),
    /*
      Note agrégée. Précision : depuis 2019, Google n'affiche plus d'étoiles
      dans ses résultats pour un commerce qui balise ses propres avis. Ce
      balisage sert les autres moteurs et les assistants ; les étoiles
      visibles dans Google viennent de la fiche Google Business Profile.
    */
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: googleReviews.rating,
      reviewCount: googleReviews.count,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function webSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#site`,
    url: site.url,
    name: site.name,
    inLanguage: 'fr-FR',
    publisher: { '@id': ORG_ID },
  };
}

export type Crumb = { label: string; href: string };

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${site.url}${c.href}`,
    })),
  };
}

export type FaqItem = { question: string; answer: string };

export function faqPage(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function service(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${site.url}${url}`,
    provider: { '@id': ORG_ID },
    areaServed: areaServed.map((n) => ({ '@type': 'Place', name: n })),
  };
}
