import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { navigate } from "@reach/router";
import * as React from "react";
import { ajax } from "rxjs/ajax";
import {
  activateAccount,
  deletedocument,
  getallusers,
} from "../../config/services";
import { db } from "../../config/firebaseinit";
import { doc, setDoc } from "firebase/firestore";

export default function AllUserTablesmain() {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    getallusers().subscribe((users) => {
      console.log(users);
      setUsers(users);
    });
  }, []);

  const makeAdmin = (data) => {
    setLoading(true);
    console.log(data);
    
    const userRef = doc(db, "users", data.uid);
    setDoc(userRef, { admin: !data.admin }, { merge: true }).then(() => {
      setLoading(false);
    });
    
  };

  const deleteuser = (uid) => {
    ajax({
      url: "https://reinvented-natural-catshark.glitch.me/admin/delete",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        uid: uid,
      },
    }).subscribe(() => {
      deletedocument(uid).then(() => console.log("deleted"));
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Add trnx</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Action</TableCell>
            <TableCell align="left">Admin</TableCell>
            <TableCell align="left">Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="left">
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  onClick={() => navigate(`addtransaction/${row.uid}`)}
                >
                  Add transaction
                </Button>
              </TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="left">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  disableElevation
                  color={row.activated ? "success" : "error"}
                  onClick={() => {
                    setLoading(true);
                    var status = row.activated ? false : true;
                    activateAccount(row.uid, status).then(() => {
                      setLoading(false);
                    });
                  }}
                >
                  {row.activated ? "Deactivate" : "Activate"}
                </LoadingButton>
              </TableCell>
              <TableCell align="left">
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
              </TableCell>
              <TableCell align="left">{row.password}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
