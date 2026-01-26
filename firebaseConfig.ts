// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_eMlhdKWq_A0Azsk8fc0I2vdGUndf2rw",
  authDomain: "studio-605389260-9ae7f.firebaseapp.com",
  projectId: "studio-605389260-9ae7f",
  storageBucket: "studio-605389260-9ae7f.firebasestorage.app",
  messagingSenderId: "202195734098",
  appId: "1:202195734098:web:844ff6db776ddf1eae598b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);