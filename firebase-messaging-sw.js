importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// Firebase config — MESMO do index.html
const firebaseConfig = {
apiKey: "AIzaSyBk_c4KxIWghSZYWiTesJP4Ho9XXdp4XWs",
authDomain: "pwa-ios-bba82.firebaseapp.com",
projectId: "pwa-ios-bba82",
storageBucket: "pwa-ios-bba82.firebasestorage.app",
messagingSenderId: "894142973830",
appId: "1:894142973830:web:2f124ebbd5e183b7b58e07"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
S
// Background message handler
messaging.onBackgroundMessage(function(payload) {
console.log('Received background message ', payload);
const notificationTitle = payload.notification.title;
const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png'
};

self.registration.showNotification(notificationTitle, notificationOptions);
});
