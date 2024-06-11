// config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-W7qmWYWK8JEv3BgjLWlZcdUB-1ymvYM",
  authDomain: "orderdeatails.firebaseapp.com",
  projectId: "orderdeatails",
  storageBucket: "orderdeatails.appspot.com",
  messagingSenderId: "422556291731",
  appId: "1:422556291731:web:b29ff3623f2889a7e8f366",
  measurementId: "G-F5GQ91QBK6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
