// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCk7n3BZD6t91GVegCFOISMOh88NOy3ueM",
    authDomain: "myfirstwebapp-ee435.firebaseapp.com",
    projectId: "myfirstwebapp-ee435",
    storageBucket: "myfirstwebapp-ee435.firebasestorage.app",
    messagingSenderId: "1053866333099",
    appId: "1:1053866333099:web:a0878eedb1da76e5c9f8ee",
    measurementId: "G-ECJ5513QWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app)
const analytics = getAnalytics(app);

export { auth, db };