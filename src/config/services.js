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
import {
  checkingsinfo$,
  savingsinfo$,
  totaltransaction$,
  totaltransactioncheckings$,
  totaltransactionsavings$,
  userinfo$,
} from "../redux/action";
import { db } from "./firebaseinit";
const cardGen = require("card-number-generator");

const accountArray = [
  { type: "savings", store: savingsinfo$ },
  { type: "checkings", store: checkingsinfo$ },
];

export const addUsers = async (docid, userdatas) => {
  const querydoc = doc(db, `users/${docid}`);
  await setDoc(querydoc, userdatas);
};

export const generateAccounts = (docid) => {
  const cardinfo = {
    Expiredate: "08/25",
    address: "1638 Hood Avenue",
    zipcode: "92009",
    city: "Carlsbad",
    state: "CA",
  };

  accountArray.forEach((value, index) => {
    const generateAcnumber = Math.floor(Math.random() * 10000000);
    const generateCvv = Math.floor(Math.random() * 1000 + 1);
    const generatecardnumber = cardGen({ issuer: "MasterCard" });

    const querydoc = doc(db, "users", `${docid}`, "account", value.type);
    setDoc(querydoc, {
      ...cardinfo,
      type: value.type,
      cardnumber: generatecardnumber,
      accountnumber: `00${generateAcnumber}`,
      cvv: `${generateCvv}`,
      balance: 0,
    });
  });
};

export const getUserInfo = (userid) => {
  const querydoc = doc(db, `users/${userid}`);
  docData(querydoc).subscribe((userData) => {
    store.dispatch(userinfo$({ ...userData, id: userid }));
  });

  accountArray.forEach((val, index) => {
    const accountQuery = doc(db, "users", `${userid}`, "account", val.type);
    docData(accountQuery).subscribe((accountData) => {
      store.dispatch(val.store(accountData));
    });
  });
};

export const getTransactions = (userid) => {
  const transactionref = collection(db, "users", `${userid}`, "transactions");
  return collectionData(transactionref, { idField: "uid" })
    .pipe(
      tap((transactions) => console.log("This is all transaction observable!"))
    )
    .subscribe((trans) => {
      console.log(trans.length);
      store.dispatch(totaltransaction$(trans.length));
    });
};

export const getTransactionsType = (userid, type) => {
  const transactionref = query(
    collection(db, "users", `${userid}`, "transactions"),
    where("type", "==", type)
  );

  return collectionData(transactionref, { idField: "uid" })
    .pipe(
      tap((transactions) => console.log("This is all transaction observable!"))
    )
    .subscribe((trans) => {
      console.log(trans.length);
      if (type === "savings") {
        store.dispatch(totaltransactionsavings$(trans));
      } else if (type === "checkings") {
        store.dispatch(totaltransactioncheckings$(trans));
      }
    });
};

export const addTransfer = async (userid, data) => {
  const docRef = doc(collection(db, "users", userid, "transactions"));

  return await setDoc(docRef, { ...data, timestamp: serverTimestamp() });
};

export const updateUserBalance = (userid, type, balance) => {
  const querydoc = doc(db, "users", userid, "account", type);
  return setDoc(querydoc, { balance: balance }, { merge: true });
};

export const getallusers = () => {
  const collectionRef = collection(db, "users");
  return collectionData(collectionRef, { idField: "uid" });
};

export const getuserDataAdmin = (id) => {
  const davidDocRef = doc(db, `users/${id}`);
  return docData(davidDocRef, { idField: "uid" });
};

export const getuserDataBalanceAdmin = (id, type) => {
  const DocRef = doc(db, "users", `${id}`, "account", type);
  return docData(DocRef, { idField: "uid" });
};

export const updateuserDataBalanceAdmin = (id, type, balance) => {
  const DocRef = doc(db, "users", `${id}`, "account", type);
  setDoc(DocRef, { balance: parseInt(balance) }, { merge: true });
  alert("User info has been updated successfully");
};

export const sendMessage = (otp) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    message: `hello, you have made a transaction, please use this otp code below to confirm transaction
    <br/>
    ${otp} `,
    to: "anthonyerics84@gmail.com, shangipara@gmail.com",
    subject: "varisad",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(
    "https://reinvented-natural-catshark.glitch.me/mail",
    requestOptions
  ).then((response) => response.text());
};
