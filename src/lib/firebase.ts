
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// These are safe to include in your frontend code as they are considered "publishable" keys
const firebaseConfig = {
  apiKey: "AIzaSyB7YzNhE08yNC-MJ8BVeFDeC6jSAc1Aokc", // Updated API key
  authDomain: "wayscanner-app.firebaseapp.com",
  projectId: "wayscanner-app",
  storageBucket: "wayscanner-app.appspot.com",
  messagingSenderId: "654321987654",
  appId: "1:654321987654:web:defabc123456789abcdef"
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
