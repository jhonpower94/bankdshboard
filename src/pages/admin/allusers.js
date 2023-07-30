import SearchIcon from "@mui/icons-material/Search";
import { LoadingButton } from "@mui/lab";
import { Box, IconButton, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { navigate } from "@reach/router";
import { doc, setDoc } from "firebase/firestore";
import * as React from "react";
import { db } from "../../config/firebaseinit";
import { activateAccount, getallusers } from "../../config/services";

export default function AllUserTablesmain() {
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [usersConst, setUsersConst] = React.useState([]);

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

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    setUsers(usersConst);
    // console.log(e.target.value);
  };

  const search = (e) => {
    let filteredUsers = users.filter((user) => {
      return user.email === searchQuery || user.accountnumber === searchQuery;
    });
    setUsers(filteredUsers);
  };

  return (
    <TableContainer>
      <Box display={"flex"} justifyContent={"center"} p={2}>
        <TextField
          id="search-bar"
          label="Search email or id"
          variant="outlined"
          onChange={handleChange}
          size="small"
          fullWidth
        />
        <IconButton
          onClick={search}
          sx={{ ml: 1 }}
          type="submit"
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Box>
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
