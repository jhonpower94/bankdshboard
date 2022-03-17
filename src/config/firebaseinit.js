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
  apiKey: "AIzaSyAKmvoDwDsF3dYoC7F0coNkjIuejOfE3Qw",
  authDomain: "stantrustbank.firebaseapp.com",
  projectId: "stantrustbank",
  storageBucket: "stantrustbank.appspot.com",
  messagingSenderId: "620878192642",
  appId: "1:620878192642:web:1887ac64b1d4039209c71b"
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
