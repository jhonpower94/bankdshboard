import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { authState } from "rxfire/auth";

// Set up Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNSKpZ1syb0z8g8OOoye1lps1k7AcXpk8",
  authDomain: "scrapedsite.firebaseapp.com",
  projectId: "scrapedsite",
  storageBucket: "scrapedsite.appspot.com",
  messagingSenderId: "317704250761",
  appId: "1:317704250761:web:eff67f6e124883fb61ad58",
  measurementId: "G-WWFDG2HKPK",
};
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);

// Listen only for logged in state
const loggedIn$ = authState(auth);

export {
  app,
  loggedIn$,
  auth,
  db,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
