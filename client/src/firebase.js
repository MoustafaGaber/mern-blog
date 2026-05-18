// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-40837.firebaseapp.com",
  projectId: "mern-blog-40837",
  storageBucket: "mern-blog-40837.firebasestorage.app",
  messagingSenderId: "868146623855",
  appId: "1:868146623855:web:ca6af68bda39a8944e649a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);