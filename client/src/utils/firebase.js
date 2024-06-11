// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "summit-residence.firebaseapp.com",
  projectId: "summit-residence",
  storageBucket: "summit-residence.appspot.com",
  messagingSenderId: "1034709685805",
  appId: "1:1034709685805:web:5797e2c410d7e9bb9d4aa4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
