## 📲 PWA Push Notification Demo

A simple **Progressive Web App (PWA)** built with Firebase Cloud Messaging to demonstrate real push notifications.

https://pwa-simple-test.vercel.app/

<p align="center">
  <img src="https://github.com/lucianohorta/pwa-simple-test/blob/master/1.png?raw=true" width="45%" />
  <img src="https://github.com/lucianohorta/pwa-simple-test/blob/master/2.png?raw=true" width="45%" />
</p>

### How to Use

1. **Install the app** on your phone (PWA installation supported)
2. **Click** "Enable Push Notification" button
3. **Minimize or close** the app (it must be in the background to receive push).

### 🔔 Send Push Notifications 

To trigger a push notification to all devices, run the following command in your terminal:

```bash
curl -X POST https://pwa-simple-test.vercel.app/api/send-to-all
```


## ✅ Features

- Installable as a PWA on mobile or desktop
- Sends push notifications to all registered devices
- Stores FCM tokens in Firestore
- Lightweight and easy to deploy on Vercel


## 🛠 Tech Stack

- **Framework**: React + Next.js  
- **Push Messaging**: Firebase Cloud Messaging  
- **Database**: Firestore (NoSQL)  
- **Backend API**: Node.js (via Next.js API routes)  
- **Hosting**: Vercel  
- **Notifications**: Service Workers + FCM tokens  
- **Storage**: Firestore (`tokens` collection for registered devices)



