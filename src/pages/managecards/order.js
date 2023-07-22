import {
    Box,
    Container,
    Grid,
    MenuItem,
    Typography
} from "@mui/material";
import React from "react";

import NumberFormat from "react-number-format";
import { CustomButton, RedditTextField } from "../styles";
import RecieveDialog from "./recievemodal";

function OrderCard() {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    amount: 2500,
    coin: "USDT",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box p={3}>
        <Typography variant="h6">Order a virtual Master card **</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <RedditTextField
            fullWidth
            select
            required
            label="Select payment"
            name="coin"
            value={values.coin}
            onChange={handleChange}
          >
            {["USDT", "BITCOIN"].map((coin, index) => (
              <MenuItem key={index} value={coin}>
                {coin}
              </MenuItem>
            ))}
          </RedditTextField>
        </Grid>
        <Grid item xs={12} sm={12}>
          <NumberFormat
            fullWidth
            defaultValue={values.amount}
            label="Amount"
            customInput={RedditTextField}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomButton onClick={handleClickOpen}>Send</CustomButton>
        </Grid>
      </Grid>
      <RecieveDialog open={open} handleClose={handleClose} values={values} />
    </Container>
  );
}

export default OrderCard;
