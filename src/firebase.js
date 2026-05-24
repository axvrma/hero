import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// IMPORTANT: Replace this with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbbd9FJIxVHK416KNOu7GPrSGUyCBcb78",
  authDomain: "portfolio-mvp-axvrma.firebaseapp.com",
  projectId: "portfolio-mvp-axvrma",
  storageBucket: "portfolio-mvp-axvrma.firebasestorage.app",
  messagingSenderId: "100903563511",
  appId: "1:100903563511:web:0e665cb2aa6d019e03a3f2"
};

let app, db, auth;

// Initialize Firebase
app = initializeApp(firebaseConfig);
db = getFirestore(app);
auth = getAuth(app);

export { db, auth };
