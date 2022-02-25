import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getallusers } from "../../config/services";
import Button from "@mui/material/Button";
import { navigate } from "@reach/router";


export default function AllUserTablesmain() {
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    getallusers().subscribe((users) => {
      console.log(users);
      setUsers(users);
    });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Action</TableCell>
            <TableCell align="left">Email</TableCell>
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
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="left">{row.password}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
