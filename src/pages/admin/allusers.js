import { VisibilitySharp } from "@mui/icons-material";
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
import { ajax } from "rxjs/ajax";
import { db } from "../../config/firebaseinit";
import {
  activateAccount,
  deletedocument,
  getallusers,
  sendMessage,
} from "../../config/services";

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

  const verification = (status, data) => {
    setLoading(true);
    activateAccount(data.uid, status).then(() => {
      sendMessage(
        `Your account verification was ${
          status
            ? "Successfully confirmed"
            : "Declined, please submit your document again"
        }`,
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

  const deleteuser = (uid) => {
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
      deletedocument(uid).then(() => console.log("deleted"));
    });
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
            <TableCell align="left">id doc</TableCell>
            <TableCell align="left">vrify kyc</TableCell>
            <TableCell align="left">Delete user</TableCell>
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
                {row.activated ? (
                  <IconButton
                    size="large"
                    aria-label="showid"
                    onClick={() => window.open(row.image_url, "_blank")}
                  >
                    <VisibilitySharp fontSize="small" />
                  </IconButton>
                ) : (
                  "Not verified"
                )}
              </TableCell>
              <TableCell align="left">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  disableElevation
                  color={"success"}
                  onClick={() => verification(true, row)}
                >
                  {"confirm"}
                </LoadingButton>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  disableElevation
                  color="warning"
                  onClick={() => verification(false, row)}
                >
                  {"Decline"}
                </LoadingButton>
              </TableCell>
              <TableCell align="left">
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    deleteuser(row.uid);
                  }}
                >
                  Delete user
                </Button>
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
