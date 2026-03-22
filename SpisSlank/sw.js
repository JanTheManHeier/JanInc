const CACHE_VERSION = 'spisslank-v2.0';
const ASSETS_TO_CACHE = [
  '/SpisSlank/',
  '/SpisSlank/index.html',
  '/SpisSlank/style.css',
  '/SpisSlank/pathways.js',
  '/SpisSlank/meals.js',
  '/SpisSlank/translations.js',
  '/SpisSlank/api-client.js',
  '/SpisSlank/shopping.js',
  '/SpisSlank/science.js',
  '/SpisSlank/app.js',
  '/SpisSlank/manifest.json',
  '/SpisSlank/icons/icon-192x192.png',
  '/SpisSlank/icons/icon-512x512.png',
  '/SpisSlank/icons/icon-192x192-maskable.png',
  '/SpisSlank/icons/icon-512x512-maskable.png',
];

// Google Fonts to cache separately (stale-while-revalidate)
const FONT_CACHE = 'spisslank-fonts-v1';

// Install: pre-cache all app assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION && key !== FONT_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for app assets, stale-while-revalidate for fonts, network-first for API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // API calls: network only (don't cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request).catch(() => 
      new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    ));
    return;
  }
  
  // Google Fonts: stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request).then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }
  
  // App assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache successful responses for SpisSlank assets
        if (response.ok && url.pathname.startsWith('/SpisSlank/')) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/SpisSlank/index.html');
      }
    })
  );
});
