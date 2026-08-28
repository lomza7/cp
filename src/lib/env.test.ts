import { describe, it, expect, afterEach, vi } from 'vitest';

/**
 * Le verrou d'indexation est la protection du référencement acquis depuis 2021.
 * Il doit rester faux partout sauf sur le vrai domaine : un faux positif ici,
 * et une URL .vercel.app se met à concurrencer cpsolutions77.com.
 *
 * env.ts lit process.env à l'import : on recharge le module à chaque cas.
 */
async function chargerAvec(env: Record<string, string | undefined>) {
  vi.resetModules();
  const sauvegarde = { ...process.env };
  Object.assign(process.env, env);
  for (const [k, v] of Object.entries(env)) if (v === undefined) delete process.env[k];
  try {
    return await import('./env.ts');
  } finally {
    process.env = sauvegarde;
  }
}

afterEach(() => {
  vi.resetModules();
});

describe('verrou d’indexation', () => {
  it('ouvre l’indexation sur le domaine canonique avec www', async () => {
    const { isIndexable } = await chargerAvec({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'www.cpsolutions77.com',
    });
    expect(isIndexable).toBe(true);
  });

  it('ouvre aussi l’indexation sur le domaine sans www', async () => {
    const { isIndexable } = await chargerAvec({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'cpsolutions77.com',
    });
    expect(isIndexable).toBe(true);
  });

  it('bloque la cible production servie sur une URL .vercel.app', async () => {
    // Le cas réel avant la bascule DNS : c'est celui qui a motivé ce verrou.
    const { isIndexable, raisonNonIndexable } = await chargerAvec({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'cpsolutions77.vercel.app',
    });
    expect(isIndexable).toBe(false);
    expect(raisonNonIndexable()).toContain('cpsolutions77.vercel.app');
  });

  it('bloque une préproduction, même avec le bon domaine de production', async () => {
    const { isIndexable, raisonNonIndexable } = await chargerAvec({
      VERCEL_ENV: 'preview',
      VERCEL_PROJECT_PRODUCTION_URL: 'www.cpsolutions77.com',
    });
    expect(isIndexable).toBe(false);
    expect(raisonNonIndexable()).toContain('preview');
  });

  it('bloque hors de Vercel, où aucune variable n’est renseignée', async () => {
    const { isIndexable, deployEnv } = await chargerAvec({
      VERCEL_ENV: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    });
    expect(deployEnv).toBe('development');
    expect(isIndexable).toBe(false);
  });

  it('bloque si le domaine de production est inconnu', async () => {
    const { isIndexable, raisonNonIndexable } = await chargerAvec({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    });
    expect(isIndexable).toBe(false);
    expect(raisonNonIndexable()).toContain('inconnu');
  });

  it('bloque un domaine qui ressemble au bon sans en être', async () => {
    const { isIndexable } = await chargerAvec({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'cpsolutions77.com.attaquant.net',
    });
    expect(isIndexable).toBe(false);
  });
});
