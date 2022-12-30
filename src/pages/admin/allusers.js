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
  getallusers
} from "../../config/services";

export default function AllUserTablesmain() {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    getallusers().subscribe((users) => {
      console.log(users);
      setUsers(users);
    });
  }, []);

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
            <TableCell align="left">Edit</TableCell>
            <TableCell align="left">Add trnx</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Action</TableCell>
            <TableCell align="left">Delete</TableCell>
            <TableCell align="left">Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="left">
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => navigate(`manager/user/${row.uid}`)}
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell align="left">
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => navigate(`manager/addtransaction/${row.uid}`)}
                >
                  Add tranx
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
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  disableElevation
                  onClick={() => deleteuser(row.uid)}
                >
                  Delete user
                </Button>
              </TableCell>
              <TableCell align="left">{row.password}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
