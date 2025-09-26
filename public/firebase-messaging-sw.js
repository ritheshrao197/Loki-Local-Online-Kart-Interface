
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

const firebaseConfig = {
    "projectId": "studio-5074317473-f21b3",
    "appId": "1:120011535326:web:fe6a9d4df83d0f885e234f",
    "storageBucket": "studio-5074317473-f21b3.appspot.com",
    "apiKey": "AIzaSyCwLxk8vDGu4RBBLqe9Wk7nU28KyL8kdBI",
    "authDomain": "studio-5074317473-f21b3.firebaseapp.com",
    "messagingSenderId": "120011535326"
  };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
