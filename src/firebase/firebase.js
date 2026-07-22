import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbpnFamKY65QrdVs49bBLjpzgWdDFj3kw",
  authDomain: "black-hub-ef202.firebaseapp.com",
  projectId: "black-hub-ef202",
  storageBucket: "black-hub-ef202.firebasestorage.app",
  messagingSenderId: "708978458558",
  appId: "1:708978458558:web:b5b59d4f840a55ff0c83ef",
  measurementId: "G-PV7PKLND1R",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
