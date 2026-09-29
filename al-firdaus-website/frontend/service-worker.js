// Al Firdaus — minimal offline cache for the PWA.
const CACHE_NAME = "al-firdaus-v1";
const CORE_ASSETS = [
  "index.html", "about.html", "institute.html", "mosque.html",
  "events.html", "media.html", "donate.html", "contact.html",
  "qibla.html", "zakat.html",
  "css/style.css", "js/main.js", "js/i18n.js",
  "icons/icon-192.png", "icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first for same-origin static assets; network passthrough for API calls.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
