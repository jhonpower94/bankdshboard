import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Grid, Snackbar, Stack } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { navigate } from "@reach/router";
import React, { useState } from "react";
import OtpInput from "react-otp-input";
import "../component/security.css";
import SecurityCard from "../component/securitycard";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Security() {
  const securitycode = "5991";
  const [open, setOpen] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [state, setState] = useState({ otp: "", loading: false });
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
    console.log(state.otp.length);

    if (state.otp === securitycode) {
      setState({ ...state, loading: true });
      setTimeout(() => {
        navigate("access");
      }, 7000);
    } else {
      setOpen({ ...open, open: true });
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
          {"Incorrect pin"}
        </Alert>
      </Snackbar>
    </>
  );
}
