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
  apiKey: "AIzaSyAZYySK3S2Bgy7NQdy-281Ka5Rwt08zjGk",
  authDomain: "saptrustnew.firebaseapp.com",
  projectId: "saptrustnew",
  storageBucket: "saptrustnew.appspot.com",
  messagingSenderId: "21968000299",
  appId: "1:21968000299:web:4eaa131fc89a8c478fa16e"
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
