// Importa os scripts necessários do Firebase
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// Configuração do Firebase
firebase.initializeApp({
apiKey: "AIzaSyBk_c4KxIWghSZYWiTesJP4Ho9XXdp4XWs",
authDomain: "pwa-ios-bba82.firebaseapp.com",
projectId: "pwa-ios-bba82",
storageBucket: "pwa-ios-bba82.firebasestorage.app",
messagingSenderId: "894142973830",
appId: "1:894142973830:web:2f124ebbd5e183b7b58e07"
});

// Inicializa o Firebase Messaging
const messaging = firebase.messaging();

// Cache básico de arquivos estáticos
const CACHE_NAME = 'pwa-lembretes-v1';
const urlsToCache = [
'/',
'/index.html',
'/style.css',
'/icon-192.png',
'/icon-512.png'
];

self.addEventListener('install', event => {
event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
);
});

// Intercepta requisições para usar cache
self.addEventListener('fetch', event => {
event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
);
});

// Gerencia mensagens push recebidas em background
messaging.onBackgroundMessage(payload => {
console.log('[firebase-messaging-sw.js] Mensagem em segundo plano recebida:', payload);

const notificationTitle = payload.notification?.title || 'Lembrete';
const notificationOptions = {
    body: payload.notification?.body || 'Você tem um novo lembrete!',
    icon: '/icon-192.png'
};

return self.registration.showNotification(notificationTitle, notificationOptions);
});
