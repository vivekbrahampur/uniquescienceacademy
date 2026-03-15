const CACHE_NAME = 'usa-portal-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (except for specific ones we want to cache)
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('cdn.jsdelivr.net')) {
    return;
  }

  // Network First strategy for HTML and API calls
  if (event.request.mode === 'navigate' || event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-While-Revalidate for other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
