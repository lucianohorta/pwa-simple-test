
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBk_c4KxIWghSZYWiTesJP4Ho9XXdp4XWs",
    authDomain: "pwa-ios-bba82.firebaseapp.com",
    projectId: "pwa-ios-bba82",
    storageBucket: "pwa-ios-bba82.firebasestorage.app",
    messagingSenderId: "894142973830",
    appId: "1:894142973830:web:2f124ebbd5e183b7b58e07"
});

const messaging = firebase.messaging();

const CACHE_NAME = 'pwa-hello-world-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/icon-192.png',
    '/icon-512.png'
];

// Na instalação, abre o cache e adiciona todos os URLs do array
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// No fetch, tenta responder pelo cache; se não existir no cache, busca da rede
self.addEventListener('fetch', event => {
    event.respondWith(
    caches.match(event.request)
        .then(response => {
        return response || fetch(event.request);
        })
    );
});

// Handler de push notifications
messaging.onBackgroundMessage(payload => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon-192.png'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
