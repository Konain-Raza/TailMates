import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/firestore";
import { getFirestore, getDocs, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tailmates-45e06.firebaseapp.com",
  projectId: "tailmates-45e06",
  storageBucket: "tailmates-45e06.appspot.com",
  messagingSenderId: "547931916223",
  appId: "1:547931916223:web:54a0ec3782cc417696430a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { getDocs, collection, db };
