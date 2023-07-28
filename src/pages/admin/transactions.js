import { LoadingButton } from "@mui/lab";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import {
  addNotification,
  addTransfer,
  getallTransactions,
  sendMessage,
  updateUserBalance,
} from "../../config/services";
import { Typography } from "@mui/material";
import { formatLocaleCurrency } from "country-currency-map";
import { db } from "../../config/firebaseinit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import CustomizedSnackbars from "../components/snackbar";

export default function AllTransactions() {
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [transactions, setTransactions] = React.useState([]);
  React.useEffect(() => {
    getallTransactions().subscribe((transactions) => {
      console.log(transactions);
      setTransactions(transactions);
    });
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

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
    <>
      <CustomizedSnackbars
        openSnackbar={openSnackbar}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="success"
        message={"Transaction Confirmed"}
      />
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">User</TableCell>
              <TableCell align="left">Amount</TableCell>
              <TableCell align="left">Confirm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left">
                  <Typography color={row.pending ? "orange" : "green"}>
                    {row.pending ? "Pending" : "Comfirmed"}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography> {row.fullname}</Typography>
                  <Typography>{row.accountnumber}</Typography>
                </TableCell>
                <TableCell align="left">
                  {formatLocaleCurrency(row.amount, "USD")}
                </TableCell>

                <TableCell align="left">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
