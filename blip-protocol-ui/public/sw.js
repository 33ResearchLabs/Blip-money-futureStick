/* Blip PWA service worker
   - Minimal install/activate so the site is installable on Android/Chrome
     and qualifies as a PWA (also enables iOS "Add to Home Screen" UX).
   - Handles "push" events so the team can send Web Push notifications
     once a push provider (e.g. Firebase Cloud Messaging, OneSignal) is
     wired up server-side.
*/
self.addEventListener("install", (e) => {
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// Pass-through fetch — no caching for now to avoid stale builds.
self.addEventListener("fetch", () => {});

// Push notifications
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { title: "Blip", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Blip Money";
  const options = {
    body: data.body || "",
    icon: data.icon || "/android-chrome-192x192.png",
    badge: data.badge || "/favicon-32x32.png",
    data: data.url ? { url: data.url } : undefined,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const c of clients) {
        if (c.url === url && "focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});
