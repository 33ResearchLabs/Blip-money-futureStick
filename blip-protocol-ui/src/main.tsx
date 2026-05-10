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

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
);
