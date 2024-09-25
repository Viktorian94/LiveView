//import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCF9bY_cH8CROtYTNeyKqnvBPUNqXQsdwg",
  authDomain: "liveview-e7060.firebaseapp.com",
  projectId: "liveview-e7060",
  storageBucket: "liveview-e7060.appspot.com",
  messagingSenderId: "515255280598",
  appId: "1:515255280598:web:8257dad27816937c563a77",
  measurementId: "G-5GRGJHVWBN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
