/**
 * `npm run check:redirects [base]`
 *
 * Vérifie que chaque ancienne URL renvoie bien un 301 vers la bonne cible, en
 * un seul saut. À lancer sur la préproduction Vercel AVANT la bascule DNS : une
 * redirection oubliée, c'est du référencement acquis depuis 2021 qui part.
 *
 *   npm run check:redirects                              # localhost:4321
 *   npm run check:redirects https://xxx.vercel.app        # préproduction
 *   npm run check:redirects https://www.cpsolutions77.com # après bascule
 */
import { allRedirects } from '../src/config/redirects.ts';

const base = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const redirects = allRedirects();
const entries = Object.entries(redirects);

console.log(`\n  Vérification de ${entries.length} redirections sur ${base}\n`);

let ok = 0;
const problemes = [];

for (const [from, expected] of entries) {
  const url = `${base}${from}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const location = res.headers.get('location');
    // Une cible absolue est acceptée si son chemin correspond.
    const chemin = location ? new URL(location, base).pathname : null;

    if (res.status !== 301) {
      problemes.push(`${from}\n      attendu : 301 vers ${expected}\n      obtenu  : ${res.status}${chemin ? ` vers ${chemin}` : ''}`);
    } else if (chemin !== expected) {
      problemes.push(`${from}\n      attendu : ${expected}\n      obtenu  : ${chemin}`);
    } else {
      // Un second saut coûte du budget de crawl : la cible doit répondre 200.
      const suite = await fetch(`${base}${expected}`, { redirect: 'manual' });
      if (suite.status >= 300 && suite.status < 400) {
        problemes.push(`${from} -> ${expected} -> ${suite.headers.get('location')}\n      chaîne de redirections : la cible redirige à son tour`);
      } else if (suite.status !== 200) {
        problemes.push(`${from} -> ${expected}\n      la cible répond ${suite.status}`);
      } else {
        ok++;
      }
    }
  } catch (err) {
    problemes.push(`${from}\n      requête impossible : ${err.message}`);
  }
}

console.log(`  ${ok} / ${entries.length} correctes\n`);

if (problemes.length) {
  console.log(`  ${problemes.length} problème(s) :\n`);
  problemes.forEach((p) => console.log(`    - ${p}\n`));
  process.exit(1);
}

console.log('  Toutes les redirections sont correctes.\n');
