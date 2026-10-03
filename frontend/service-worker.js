// Al Firdaus — Network-First Service Worker for real-time updates & PWA offline support.
const CACHE_NAME = "al-firdaus-v8";
const CORE_ASSETS = [
  "index.html", "about.html", "donate.html", "events.html",
  "contact.html", "zakat.html", "mosque.html", "institute.html", "media.html",
  "js/main.js", "js/i18n.js", "manifest.json"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for static assets; bypass cache entirely for API calls.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass cache completely for API requests
  if (url.pathname.includes("/api/")) {
    return;
  }

  // Network-first strategy for HTML and JS
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
