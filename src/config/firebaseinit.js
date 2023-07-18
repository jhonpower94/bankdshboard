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
  apiKey: "AIzaSyAVhoDz02wqEbDQyz_1FhfDuzJYtfwEnbQ",
  authDomain: "saptrust-6a083.firebaseapp.com",
  projectId: "saptrust-6a083",
  storageBucket: "saptrust-6a083.appspot.com",
  messagingSenderId: "1007531186146",
  appId: "1:1007531186146:web:93f5c611c9574754b98bbb"
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
