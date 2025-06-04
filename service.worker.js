const CACHE_NAME = 'pwa-hello-world-v2';
const urlsToCache = [
'/',
'/index.html',
'/style.css',
'/icon-192.png',
'/icon-512.png'
];

self.addEventListener('install', event => {
event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
    return cache.addAll(urlsToCache);
    })
);
});

self.addEventListener('fetch', event => {
event.respondWith(
    caches.match(event.request)
    .then(response => response || fetch(event.request))
);
});
