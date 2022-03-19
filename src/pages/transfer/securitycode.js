import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Grid, Snackbar, Stack } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import {
  addTransfer,
  sendMessage,
  updateUserBalance,
} from "../../config/services";
import "../component/security.css";
import SecurityCard from "../component/securitycard";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Security({ location }) {
  const [securitycode, setSecuritycode] = React.useState("");
  const savingsinfo = useSelector((state) => state.savingsInfos);
  const checkingsinfo = useSelector((state) => state.checkingsInfos);
  const userinfo = useSelector((state) => state.useInfos);
  const transactiontotal = useSelector((state) => state.totalTransactions);

  const [open, setOpen] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  const [state, setState] = useState({ otp: "", loading: false });

  useEffect(() => {
    console.log(location.state);
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
    setSecuritycode(`${otp}`);

    //send otp message
    sendMessage(
      `hello, you have made a transaction, please use this otp code below to confirm transaction
    <br/>
    ${otp} `,
      "Verify_otp",
      `${userinfo.firstName} ${userinfo.lastName}`
    )
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, []);

  const switchaccountBalance = (data) => {
    switch (data) {
      case "savings":
        return savingsinfo.balance;
      case "checkings":
        return checkingsinfo.balance;
      default:
        return savingsinfo.balance;
    }
  };

  const handleChange = (otp) => {
    setState({ ...state, otp: otp });
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen({ ...open, open: false });
  };

  const clear = () => setState({ ...state, otp: "", loading: false });

  const submit = () => {
    // get previous balance
    const oldbalance = switchaccountBalance(location.state.type);
    const currentAmount = parseInt(location.state.amount);

    if (state.otp === securitycode) {
      setState({ ...state, loading: true });

      // get previous balance

      // get prev transaction lenth

      if (currentAmount >= oldbalance) {
        setOpen({ ...open, message: "Not enough balance", open: true });
        setState({ ...state, loading: false });
      } else if (transactiontotal >= userinfo.transactionlimit) {
        console.log(transactiontotal);
        // navigate to failed page
        navigate("access");
      } else {
        // add transaction
        addTransfer(userinfo.id, location.state).then((data) => {
          console.log("transaction added");
          const newbalance = oldbalance - currentAmount;
          updateUserBalance(userinfo.id, location.state.type, newbalance).then(
            () => {
              // navigate to success page
              sendMessage(
                `You have successfully made a transfer of <strong>$${currentAmount}</strong>, and your ${location.state.type} account remaining balance is <strong>$${newbalance}</strong>.`,
                "Transaction confirmation",
                `${userinfo.firstName} ${userinfo.lastName}`
              )
                .then((result) => console.log(result))
                .catch((error) => console.log("error", error));
              navigate("success");
            }
          );
        });
      }
    } else {
      setOpen({ ...open, message: "Incorrect code", open: true });
      setState({ ...state, loading: false });
    }
  };

  return (
    <>
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={12} md={6}>
          <SecurityCard>
            <OtpInput
              value={state.otp}
              onChange={handleChange}
              numInputs={4}
              isInputNum={true}
              //  isInputSecure={true}
              separator={<span>-</span>}
              inputStyle="inputStyle"
            />
            <Stack spacing={4} direction={"row"} p={5}>
              <Button
                variant="contained"
                disableElevation
                color="error"
                onClick={clear}
              >
                Clear
              </Button>
              <LoadingButton
                variant="contained"
                loading={state.loading}
                disableElevation
                onClick={submit}
                color="success"
              >
                Confirm
              </LoadingButton>
            </Stack>
          </SecurityCard>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: open.vertical, horizontal: open.horizontal }}
        open={open.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {open.message}
        </Alert>
      </Snackbar>
    </>
  );
}
