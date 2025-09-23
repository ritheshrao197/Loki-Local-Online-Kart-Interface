
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-5074317473-f21b3",
  "appId": "1:120011535326:web:fe6a9d4df83d0f885e234f",
  "apiKey": "AIzaSyCwLxk8vDGu4RBBLqe9Wk7nU28KyL8kdBI",
  "authDomain": "studio-5074317473-f21b3.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "120011535326"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
