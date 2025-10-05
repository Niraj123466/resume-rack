// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYGwpCAXdnYmNflxjSan_TwqeJ1_7IESk",
  authDomain: "resume-rack-6cc76.firebaseapp.com",
  projectId: "resume-rack-6cc76",
  storageBucket: "resume-rack-6cc76.appspot.com", // ✅ fixed here
  messagingSenderId: "233945789857",
  appId: "1:233945789857:web:c23a103b1adec0b022c7e0",
  measurementId: "G-JHPDF5H3S1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);