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
  apiKey: "AIzaSyDSGiQFCu8p0aYT9SVI6e9eHxLotJVELHY",
  authDomain: "tdbank-ea163.firebaseapp.com",
  projectId: "tdbank-ea163",
  storageBucket: "tdbank-ea163.appspot.com",
  messagingSenderId: "754698281741",
  appId: "1:754698281741:web:e6883fb78bc77d990bc644"
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
