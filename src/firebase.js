import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSDvrqs_y5G-093jR9uqnOP5SeTnR6Hak",
  authDomain: "crud-operations-a7bd7.firebaseapp.com",
  databaseURL: "https://crud-operations-a7bd7-default-rtdb.firebaseio.com",
  projectId: "crud-operations-a7bd7",
  storageBucket: "crud-operations-a7bd7.firebasestorage.app",
  messagingSenderId: "127304969781",
  appId: "1:127304969781:web:596d1d312115062bf34b7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 