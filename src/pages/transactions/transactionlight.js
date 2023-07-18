import { Chip, TablePagination, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { collection, getDocs, query, where } from "firebase/firestore";
import * as React from "react";
import { useSelector } from "react-redux";
import { db } from "../../config/firebaseinit";
import { getTransactionsType } from "../../config/services";
import { CurrencyFormat } from "../currencyformatter";
import { TransDetailDailog } from "./detailmodal";

export default function TransactioLight({ data, type }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [datax, setData] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    setRows(data);
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                hover
                onClick={(event) => {
                  setSelected(index);
                  setData(row);
                  handleClickOpen();
                }}
                role="checkbox"
                selected={selected == index}
                sx={{
                  cursor: "pointer",
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <Chip
                    label={row.transaction_type}
                    color={
                      row.transaction_type === "Credit" ? "success" : "warning"
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5">
                    <CurrencyFormat amount={row.amount} />
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TransDetailDailog
        open={open}
        handleClose={handleClose}
        data={datax}
      />
    </div>
  );
}
