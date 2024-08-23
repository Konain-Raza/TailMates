import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tailmates-45e06.firebaseapp.com",
  projectId: "tailmates-45e06",
  storageBucket: "tailmates-45e06.appspot.com",
  messagingSenderId: "547931916223",
  appId: "1:547931916223:web:54a0ec3782cc417696430a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage()
export { getDocs, collection, db , storage};
