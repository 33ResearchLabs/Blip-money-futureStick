#!/usr/bin/env node
/**
 * Conditional postbuild prerender.
 *
 * Reasons we don't always run react-snap:
 *   - macOS Apple Silicon ships incompatible Chromium with puppeteer
 *     bundled by react-snap (Bad CPU type, errno -86). Local Mac builds
 *     would explode.
 *   - We want explicit opt-in for the first Vercel deploy in case the
 *     puppeteer setup misbehaves on the build runner.
 *
 * Enable with `BLIP_PRERENDER=1 npm run build`.
 * Vercel project settings can set the env var to flip prerender on
 * once we've verified it works in a preview deploy.
 */
import { spawn } from "node:child_process";

if (process.env.BLIP_PRERENDER !== "1") {
  console.log(
    "[maybe-snap] BLIP_PRERENDER not set — skipping react-snap prerender.",
  );
  console.log(
    "[maybe-snap] To enable, set BLIP_PRERENDER=1 in env (set in netlify.toml [build.environment]).",
  );
  process.exit(0);
}

console.log("[maybe-snap] BLIP_PRERENDER=1 — running react-snap.");
const child = spawn("npx", ["react-snap"], { stdio: "inherit" });
child.on("exit", (code) => {
  if (code && code !== 0) {
    console.warn(
      `[maybe-snap] react-snap exited ${code}. SPA build is still valid — site stays up. Continuing without prerender.`,
    );
    process.exit(0); // never fail the build because of prerender
  }
  process.exit(0);
});
