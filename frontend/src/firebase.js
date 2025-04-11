// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBk_62Hq3s4T-i-PgwUa68j5ShcZ01duyo",
    authDomain: "resumerack-ca186.firebaseapp.com",
    projectId: "resumerack-ca186",
    storageBucket: "resumerack-ca186.firebasestorage.app",
    messagingSenderId: "905755080713",
    appId: "1:905755080713:web:dec50ec180fbfed397a0d8",
    measurementId: "G-BPP68KVT53"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
