import { LoadingButton } from "@mui/lab";
import React from "react";
import {
  activateAccount,
  addNotification,
  deletedocument,
  sendMessage,
  updateUserBalance,
} from "../../config/services";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseinit";
import { ajax } from "rxjs/ajax";

export function ConfirmKyc({ row }) {
  const [loading, setLoading] = React.useState(false);

  const verification = (status, data) => {
    setLoading(true);
    activateAccount(data.uid, status).then(() => {
      sendMessage(
        `Your account verification was Successfully confirmed`,
        data.email,
        `${data.firstName} ${data.lastName}`
      )
        .then((result) => {
          setLoading(false);
          console.log(result);
        })
        .catch((error) => {
          setLoading(false);
          console.log("error", error);
        });
    });
  };
  return (
    <LoadingButton
      loading={loading}
      variant="contained"
      disableElevation
      color={"success"}
      onClick={() => verification(true, row)}
    >
      {"confirm"}
    </LoadingButton>
  );
}

export function DeclineKyc({ row }) {
  const [loading, setLoading] = React.useState(false);

  const verification = (status, data) => {
    setLoading(true);
    activateAccount(data.uid, status).then(() => {
      sendMessage(
        `Your account verification was Declined, please submit your document again`,
        data.email,
        `${data.firstName} ${data.lastName}`
      )
        .then((result) => {
          setLoading(false);
          console.log(result);
        })
        .catch((error) => {
          setLoading(false);
          console.log("error", error);
        });
    });
  };
  return (
    <LoadingButton
      loading={loading}
      variant="contained"
      disableElevation
      color={"warning"}
      onClick={() => verification(false, row)}
    >
      {"Decline"}
    </LoadingButton>
  );
}

export function ConfirmTransaction({ row, setOpenSnackbar }) {
  const [loading, setLoading] = React.useState(false);

  const confirm = (data) => {
    setLoading(true);
    const userRef = doc(db, "users", data.userid, "account", data.type);
    getDoc(userRef).then((user) => {
      console.log(user.data());
      const oldbalance = user.data().balance;
      const newbalance = oldbalance - parseInt(data.amount);

      updateUserBalance(data.userid, data.type, newbalance).then(() => {
        const usertrxRef = doc(
          db,
          "users",
          data.userid,
          "transactions",
          data.transactionid
        );
        setDoc(usertrxRef, { pending: false }, { merge: true }).then(() => {
          const trxRef = doc(db, "transactions", data.uid);
          setDoc(trxRef, { pending: false }, { merge: true }).then(() => {
            addNotification(
              data.userid,
              "Debit",
              `your transaction of ${
                data.amount
              } has been successfully confirmed.`
            ).then(() => {
              sendMessage(
                `You have successfully made a transfer of <strong>$${
                  data.amount
                }</strong>, and your ${
                  data.type
                } account remaining balance is <strong>$${newbalance}</strong>.`,
                "Transaction confirmation",
                data.email,
                `${data.fullname}`
              )
                .then((result) => {
                  console.log(result);
                  setLoading(false);
                  setOpenSnackbar(true);
                })
                .catch((error) => {
                  console.log("error", error);
                  setLoading(false);
                });
            });
          });
        });
      });
    });
  };
  return (
    <LoadingButton
      disabled={row.pending ? false : true}
      loading={loading}
      variant="contained"
      disableElevation
      onClick={() => {
        confirm(row);
      }}
    >
      confirm
    </LoadingButton>
  );
}

export function DeleteUser({ row }) {
  const [loading, setLoading] = React.useState(false);

  const deleteuser = (uid) => {
    setLoading(true);
    ajax({
      url: "https://expresspages.vercel.app/saptrust/delete",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        uid: uid,
      },
    }).subscribe(() => {
      deletedocument(uid).then(() => {
        setLoading(false);
        console.log("deleted");
      });
    });
  };

  return (
    <LoadingButton
      loading={loading}
      fullWidth
      size="large"
      variant="contained"
      disableElevation
      onClick={() => {
        deleteuser(row.uid);
      }}
    >
      Delete user
    </LoadingButton>
  );
}

export function AddRemoveAdmin({ row }) {
  const [loading, setLoading] = React.useState(false);

  const makeAdmin = (data) => {
    setLoading(true);
    console.log(data);

    const userRef = doc(db, "users", data.uid);
    setDoc(userRef, { admin: !data.admin }, { merge: true }).then(() => {
      setLoading(false);
    });
  };

  return (
    <LoadingButton
      loading={loading}
      fullWidth
      size="large"
      variant="contained"
      disableElevation
      onClick={() => makeAdmin(row)}
    >
      {row.admin ? "remove admin" : "make admin"}
    </LoadingButton>
  );
}
