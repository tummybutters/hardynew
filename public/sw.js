// Service Worker for HardysWashnWax PWA
const CACHE_NAME = 'hardys-washnwax-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about',
  '/services',
  '/contact',
  '/booking',
  // Location-specific pages for SEO
  '/davis-car-detailing',
  '/woodland-car-detailing',
  '/dixon-car-detailing',
  '/winters-car-detailing',
  '/west-sacramento-car-detailing'
];

// Install event - cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - implement stale-while-revalidate strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response immediately if available
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // If we got a valid response, cache it
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('Fetch failed; returning cached response instead.', error);
            // If fetch fails, return the cached response or fall back to a network error
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});