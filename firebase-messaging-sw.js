importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Keep this in sync with js/firebase-config.js
firebase.initializeApp({
  apiKey: 'AIzaSyAEjbmQpJTkw2hAfh-1pRtkbDHQLx23BPQ',
  authDomain: 'digital-rosary-db.firebaseapp.com',
  projectId: 'digital-rosary-db',
  storageBucket: 'digital-rosary-db.firebasestorage.app',
  messagingSenderId: '471155166682',
  appId: '1:471155166682:web:9165b939facaf931bfc4e3',
  measurementId: 'G-YRYFS073NT'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'Digital Rosary Reminder';
  const body = payload?.notification?.body || 'It is a good time to pray the Rosary.';
  const data = payload?.data || {};
  const link = data.link || payload?.fcmOptions?.link || '/index.html';

  self.registration.showNotification(title, {
    body,
    icon: payload?.notification?.icon || '/images/logo/plain_logo_v0.1.png',
    badge: payload?.notification?.badge || '/images/logo/plain_logo_v0.1.png',
    tag: data.tag || 'digital-rosary-reminder',
    data: {
      link
    }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.link || '/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          if (client.url !== targetUrl && 'navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
