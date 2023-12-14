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
  apiKey: "AIzaSyAVfpjg68JtU1KQVALkgTcHCpOGYdXwaOM",
  authDomain: "saptrustdecember.firebaseapp.com",
  projectId: "saptrustdecember",
  storageBucket: "saptrustdecember.appspot.com",
  messagingSenderId: "672690676214",
  appId: "1:672690676214:web:2f026e5018cb2f426567d7"
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
