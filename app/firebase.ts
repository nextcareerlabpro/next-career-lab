import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-a-gLRYsUBvoky3n928OlGJOse79TUwk",
  authDomain: "next-career-lab.firebaseapp.com",
  projectId: "next-career-lab",
  storageBucket: "next-career-lab.firebasestorage.app",
  messagingSenderId: "1029837890437",
  appId: "1:1029837890437:web:5ac82359817ae506e3daec",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);