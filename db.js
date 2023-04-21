// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRSVd1lZjCmML31hIDgEPNx23BDBVyHHo",
  authDomain: "pchms-4506e.firebaseapp.com",
  projectId: "pchms-4506e",
  storageBucket: "pchms-4506e.appspot.com",
  messagingSenderId: "40396147367",
  appId: "1:40396147367:web:5426b94e7095ac99662982",
  measurementId: "G-CDP9KTKVYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;