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
  apiKey: "AIzaSyAAV25lFq7C1gSfunVfd6P_KSCU18EKqPI",
  authDomain: "santander-fa735.firebaseapp.com",
  projectId: "santander-fa735",
  storageBucket: "santander-fa735.appspot.com",
  messagingSenderId: "500084202276",
  appId: "1:500084202276:web:ba3130ac6afdefb23e71b1"
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
