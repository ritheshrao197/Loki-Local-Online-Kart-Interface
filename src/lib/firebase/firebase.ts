
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "studio-5074317473-f21b3",
  "appId": "1:120011535326:web:fe6a9d4df83d0f885e234f",
  "storageBucket": "studio-5074317473-f21b3.appspot.com",
  "apiKey": "AIzaSyCwLxk8vDGu4RBBLqe9Wk7nU28KyL8kdBI",
  "authDomain": "studio-5074317473-f21b3.firebaseapp.com",
  "messagingSenderId": "120011535326"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
