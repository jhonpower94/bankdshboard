import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { authState } from "rxfire/auth";


// Set up Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCw6MPeXKsASJiFvvCi37Cj9Jfvqi2yCBQ",
  authDomain: "saptrust-e183e.firebaseapp.com",
  projectId: "saptrust-e183e",
  storageBucket: "saptrust-e183e.appspot.com",
  messagingSenderId: "923375773571",
  appId: "1:923375773571:web:2c5ac3fe2976a87e95f8b6",
  measurementId: "G-NRLZN92884"
};



const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);

const storage = getStorage(app);

// Listen only for logged in state
const loggedIn$ = authState(auth);

export {
  app,
  loggedIn$,
  auth,
  db,
  storage,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
