// Runtime-agnostic env reader.
//
// Different edge runtimes expose environment variables differently:
//   - Vercel Edge / Node      -> process.env
//   - Netlify Edge (Deno)     -> Deno.env.get()
//   - Cloudflare Workers      -> bindings (globalThis fallback)
//
// Reading through this helper keeps api/* portable across all of them, so
// moving hosts never requires touching the handler logic again.

declare const Deno: { env: { get(k: string): string | undefined } } | undefined;

export function env(name: string): string | undefined {
  // Deno (Netlify Edge)
  try {
    if (typeof Deno !== "undefined" && Deno?.env?.get) {
      const v = Deno.env.get(name);
      if (v) return v;
    }
  } catch {
    /* Deno not present or env access denied */
  }

  // Node / Vercel Edge
  try {
    if (typeof process !== "undefined" && process?.env) {
      const v = process.env[name];
      if (v) return v;
    }
  } catch {
    /* process not present */
  }

  // Cloudflare-style global bindings
  try {
    const g = globalThis as Record<string, unknown>;
    const v = g[name];
    if (typeof v === "string" && v) return v;
  } catch {
    /* ignore */
  }

  return undefined;
}

/** Supabase credentials, resolved on any supported runtime. */
export function supabaseCreds(): { url: string; key: string } | null {
  const url = env("SUPABASE_URL") ?? env("VITE_SUPABASE_URL");
  const key = env("SUPABASE_ANON_KEY") ?? env("VITE_SUPABASE_ANON_KEY");
  if (!url || !key) return null;
  return { url, key };
}
