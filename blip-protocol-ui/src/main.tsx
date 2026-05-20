import { Buffer } from "buffer";
(globalThis as any).Buffer = Buffer;
(globalThis as any).global = globalThis;

// Stale-chunk recovery: when a deploy invalidates the chunk hashes in a user's
// cached HTML, auto-reload once instead of breaking. Guarded by sessionStorage
// so we never loop if the failure is something else.
if (typeof window !== "undefined") {
  const FLAG = "blip:chunk-reload";
  const isChunkErr = (msg: string) =>
    /Failed to fetch dynamically imported module|Loading chunk [\w-]+ failed|error loading dynamically imported module|Importing a module script failed/i.test(
      msg,
    );
  const tryRecover = (msg: string) => {
    if (!isChunkErr(msg)) return;
    if (sessionStorage.getItem(FLAG)) return;
    sessionStorage.setItem(FLAG, "1");
    window.location.reload();
  };
  window.addEventListener("error", (e) => tryRecover(String(e?.message ?? "")));
  window.addEventListener("unhandledrejection", (e) =>
    tryRecover(String((e as PromiseRejectionEvent)?.reason?.message ?? (e as PromiseRejectionEvent)?.reason ?? "")),
  );
  // Clear the flag a few seconds after successful load so a later deploy in the
  // same session can also recover.
  window.addEventListener("load", () => {
    setTimeout(() => sessionStorage.removeItem(FLAG), 5000);
  });
}

if (import.meta.env.DEV) {
  const NOISE = [
    "Download the React DevTools",
    'Module "buffer" has been externalized',
    "Lit is in dev mode",
    "Please ensure that the container has a non-static position",
    "was registered as a Standard Wallet",
    "StreamMiddleware - Unknown response id",
    "SES Removing unpermitted intrinsics",
    "Session refresh failed",
    "No session found",
  ];
  const wrap = (orig: (...a: unknown[]) => void) =>
    (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : String(args[0] ?? "");
      if (NOISE.some((n) => msg.includes(n))) return;
      orig.apply(console, args);
    };
  console.log = wrap(console.log);
  console.warn = wrap(console.warn);
  console.info = wrap(console.info);
}

import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Recover from stale lazy-chunk references after a deploy.
// When a user has an old index.html cached but the chunk hash has changed,
// dynamic imports throw. Detect once per session and hard-reload.
const STALE_CHUNK_KEY = "blip-stale-chunk-reload";
const isChunkError = (msg: string) =>
  msg.includes("Failed to fetch dynamically imported module") ||
  msg.includes("Importing a module script failed") ||
  msg.includes("error loading dynamically imported module");

window.addEventListener("error", (e) => {
  if (!e.message || !isChunkError(e.message)) return;
  if (sessionStorage.getItem(STALE_CHUNK_KEY)) return;
  sessionStorage.setItem(STALE_CHUNK_KEY, "1");
  window.location.reload();
});

window.addEventListener("unhandledrejection", (e) => {
  const msg = String(e.reason?.message ?? e.reason ?? "");
  if (!isChunkError(msg)) return;
  if (sessionStorage.getItem(STALE_CHUNK_KEY)) return;
  sessionStorage.setItem(STALE_CHUNK_KEY, "1");
  window.location.reload();
});

const rootEl = document.getElementById("root")!;
const app = (
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
);

// react-snap prerenders pages to static HTML. When that HTML loads in a real
// browser, we hydrate instead of replacing the DOM. If root is empty (no
// prerender for this route), fall back to a normal mount.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
