## 📲 PWA Push Notification Demo

This project is a simple **Progressive Web App (PWA)** that demonstrates real push notifications.

https://pwa-simple-test.vercel.app/

![App Screenshot](https://github.com/lucianohorta/pwa-simple-test/blob/master/1.png?raw=true)
![App Screenshot](https://github.com/lucianohorta/pwa-simple-test/blob/master/2.png?raw=true)



### How to Use

1. **Install the app** on your phone (PWA installation supported)
2. **Click** "Enable Push Notification" button
3. **Minimize or close** the app after installation (THAT'S IMPORTANT FOR IT TO WORK PROPERLY!)

### Send Push Notifications 🔔

To trigger a push notification to all devices, run the following command in your terminal:

```bash
curl -X POST https://pwa-simple-test.vercel.app/api/send-to-all
