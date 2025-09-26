// Use a more recent version of Firebase JS SDK
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

const firebaseConfig = {
    "projectId": "studio-5074317473-f21b3",
    "appId": "1:120011535326:web:fe6a9d4df83d0f885e234f",
    "storageBucket": "studio-5074317473-f21b3.appspot.com",
    "apiKey": "AIzaSyCwLxk8vDGu4RBBLqe9Wk7nU28KyL8kdBI",
    "authDomain": "studio-5074317473-f21b3.firebaseapp.com",
    "messagingSenderId": "120011535326"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    badge: '/icon.png',
    // Add data to the notification
    data: {
      url: payload.data?.url || '/',
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Get the URL from the notification data
  const url = event.notification.data?.url || '/';
  
  // Open the URL in a new window/tab
  event.waitUntil(
    clients.openWindow(url)
  );
});