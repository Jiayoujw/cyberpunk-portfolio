/* ============================================
   SERVICE WORKER — Cache-first PWA
   ============================================ */

var CACHE_NAME = 'nexus-v3';
var urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/animations.css',
    '/js/i18n.js',
    '/js/audio.js',
    '/js/main.js',
    '/js/terminal.js',
    '/js/particles.js',
    '/js/matrix.js',
    '/js/mouse-trail.js',
    '/manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request).then(function(fetchResponse) {
                if (fetchResponse && fetchResponse.status === 200) {
                    var responseClone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return fetchResponse;
            });
        }).catch(function() {
            // Offline fallback
            if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        })
    );
});
