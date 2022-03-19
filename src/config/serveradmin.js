import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { collectionData, docData } from "rxfire/firestore";
import { tap } from "rxjs/operators";
import { store } from "../";

import { db } from "./firebaseinit";


export const addUsers = async (docid, userdatas) => {
    const querydoc = doc(db, `users/${docid}`);
    await setDoc(querydoc, userdatas);
  };
