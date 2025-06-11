// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBk_c4KxIWghSZYWiTesJP4Ho9XXdp4XWs",
    authDomain: "pwa-ios-bba82.firebaseapp.com",
    projectId: "pwa-ios-bba82",
    storageBucket: "pwa-ios-bba82.firebasestorage.app",
    messagingSenderId: "894142973830",
    appId: "1:894142973830:web:2f124ebbd5e183b7b58e07"
});

const messaging = firebase.messaging();

// Cache name and URLs to cache
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
'/',
'/index.html',
'/style.css',
'/icon-192.png',
'/icon-512.png',
'/manifest.json'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(urlsToCache))
);
});

// Fetch from cache when available
self.addEventListener('fetch', (event) => {
event.respondWith(
    caches.match(event.request)
    .then((response) => response || fetch(event.request))
);
});

// Handle background messages
messaging.onBackgroundMessage((payload) => {
console.log('[firebase-messaging-sw.js] Received background message:', payload);

const notificationTitle = payload.notification?.title || 'New notification';
const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/icon-192.png',
    data: payload.data || {}
};

return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
event.notification.close();
event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clientList) => {
        if (clientList.length > 0) {
        return clientList[0].focus();
        }
        return clients.openWindow('/');
    })
);
});