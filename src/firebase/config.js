// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm8cC2h2J1sQ0ZBZzxmfnE3SYixruNZR0",
  authDomain: "easy-grocer-a0053.firebaseapp.com",
  projectId: "easy-grocer-a0053",
  storageBucket: "easy-grocer-a0053.firebasestorage.app",
  messagingSenderId: "933575153868",
  appId: "1:933575153868:web:779e4be4ddb2ff2e17ca69",
  measurementId: "G-WDHYCWN80F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);