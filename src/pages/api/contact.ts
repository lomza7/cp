import type { APIRoute } from 'astro';
import { valider, estValide, libelleDemande, libelleCreneau, normaliserTelephone, type DonneesRappel } from '../../lib/validate.ts';
import { contact, site } from '../../config/site.ts';

/**
 * Seule route serveur du site : reçoit le formulaire de rappel et envoie un
 * e-mail. Aucune base de données, l'e-mail est l'enregistrement.
 *
 * Accepte deux formats :
 *  - JSON, envoyé par l'îlot ;
 *  - application/x-www-form-urlencoded, envoyé par le navigateur si le
 *    JavaScript n'a pas chargé. Dans ce cas on redirige au lieu de répondre.
 */
export const prerender = false;

const EXPEDITEUR = 'CP SOLUTIONS <formulaire@cpsolutions77.com>';

function echapper(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function corpsEmail(d: DonneesRappel): { texte: string; html: string } {
  const tel = normaliserTelephone(d.telephone);
  const lignes: [string, string][] = [
    ['Nom', `${d.prenom} ${d.nom}`],
    ['Téléphone', tel],
    ['E-mail', d.email],
    ['Demande', libelleDemande(d.demande)],
    ['Créneau souhaité', libelleCreneau(d.creneau)],
  ];

  const texte = [
    'Nouvelle demande de rappel depuis le site.',
    '',
    ...lignes.map(([k, v]) => `${k} : ${v}`),
    '',
    d.message ? `Message :\n${d.message}` : 'Aucun message.',
    '',
    `Reçu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}.`,
  ].join('\n');

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1b1b18">
<p style="margin:0 0 16px"><strong>Nouvelle demande de rappel depuis le site.</strong></p>
<table style="border-collapse:collapse">
${lignes
  .map(
    ([k, v]) =>
      `<tr><th align="left" style="padding:4px 16px 4px 0;font-weight:400;color:#5c5b55">${echapper(k)}</th><td style="padding:4px 0"><strong>${echapper(v)}</strong></td></tr>`,
  )
  .join('\n')}
</table>
<p style="margin:16px 0 4px;color:#5c5b55">Message</p>
<p style="margin:0;padding:12px;background:#f3f2ed;white-space:pre-wrap">${d.message ? echapper(d.message) : 'Aucun message.'}</p>
<p style="margin:16px 0 0;font-size:13px;color:#5c5b55">
Répondre directement à cet e-mail écrit à ${echapper(d.email)}.
</p>
</div>`;

  return { texte, html };
}

export const POST: APIRoute = async ({ request }) => {
  const typeContenu = request.headers.get('content-type') ?? '';
  const veutJson =
    typeContenu.includes('application/json') ||
    (request.headers.get('accept') ?? '').includes('application/json');

  let donnees: Partial<DonneesRappel>;

  if (typeContenu.includes('application/json')) {
    donnees = await request.json().catch(() => ({}));
  } else {
    const f = await request.formData();
    donnees = {
      prenom: String(f.get('prenom') ?? ''),
      nom: String(f.get('nom') ?? ''),
      telephone: String(f.get('telephone') ?? ''),
      email: String(f.get('email') ?? ''),
      demande: String(f.get('demande') ?? ''),
      creneau: String(f.get('creneau') ?? ''),
      message: String(f.get('message') ?? ''),
      consentement: f.get('consentement') === 'oui',
      piege: String(f.get('piege') ?? ''),
    };
  }

  /*
    Champ piège rempli : c'est un robot. On répond comme si tout allait bien,
    pour ne rien lui apprendre, et on n'envoie pas d'e-mail.
  */
  if (donnees.piege) {
    return veutJson
      ? new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      : new Response(null, { status: 303, headers: { Location: '/contact/merci' } });
  }

  const erreurs = valider(donnees);
  if (!estValide(erreurs)) {
    return veutJson
      ? new Response(JSON.stringify({ ok: false, erreurs }), {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        })
      : new Response(null, { status: 303, headers: { Location: '/contact?erreur=1' } });
  }

  const complet = donnees as DonneesRappel;
  const { texte, html } = corpsEmail(complet);
  const cle = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;

  if (!cle) {
    // En développement, on écrit dans la console plutôt que d'échouer : le
    // formulaire reste testable sans clé d'API.
    if (import.meta.env.DEV) {
      console.info('\n[contact] RESEND_API_KEY absente, e-mail non envoyé. Contenu :\n' + texte + '\n');
      return veutJson
        ? new Response(JSON.stringify({ ok: true, simule: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
        : new Response(null, { status: 303, headers: { Location: '/contact/merci' } });
    }
    console.error('[contact] RESEND_API_KEY manquante en production.');
    return veutJson
      ? new Response(
          JSON.stringify({ ok: false, message: "L'envoi est momentanément indisponible." }),
          { status: 503, headers: { 'Content-Type': 'application/json' } },
        )
      : new Response(null, { status: 303, headers: { Location: '/contact?erreur=1' } });
  }

  try {
    const reponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cle}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EXPEDITEUR,
        to: [contact.email],
        // Le courtier répond depuis sa boîte, directement au client.
        reply_to: complet.email,
        subject: `Rappel demandé : ${libelleDemande(complet.demande)}, ${complet.prenom} ${complet.nom}`,
        text: texte,
        html,
      }),
    });

    if (!reponse.ok) {
      const detail = await reponse.text().catch(() => '');
      console.error(`[contact] Resend a répondu ${reponse.status} : ${detail}`);
      throw new Error(`Resend ${reponse.status}`);
    }
  } catch (err) {
    console.error('[contact] envoi impossible', err);
    return veutJson
      ? new Response(
          JSON.stringify({
            ok: false,
            message: `L'envoi a échoué. Appelez le ${contact.phoneDisplay}.`,
          }),
          { status: 502, headers: { 'Content-Type': 'application/json' } },
        )
      : new Response(null, { status: 303, headers: { Location: '/contact?erreur=1' } });
  }

  return veutJson
    ? new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    : new Response(null, {
        status: 303,
        headers: { Location: new URL('/contact/merci', site.url).pathname },
      });
};

/** Un GET sur cette route n'a pas de sens : on renvoie vers le formulaire. */
export const GET: APIRoute = () =>
  new Response(null, { status: 303, headers: { Location: '/contact' } });
