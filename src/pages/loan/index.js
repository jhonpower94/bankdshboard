import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import { sendMessage } from "../../config/services";
import CustomizedSnackbars from "../components/snackbar";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function Loan() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const time = today.getHours() + ":" + today.getMinutes();

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const userinfo = useSelector((state) => state.useInfos);

  const [values, setValues] = React.useState({
    amount: "",
    fullname: `${userinfo.firstName} ${userinfo.lastName}`,
    duration: 1,
    remark: "",
    date: `${mm}/${dd}/${yyyy} ${time}`,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const submit = (event) => {
    event.preventDefault();
    setLoading(true);
    sendMessage(
      `You have successfully made a loan request with the following details below <br/>
      Amount: ${values.amount} <br/><br/>
      Duration: ${values.duration} month <br/><br/>
      you will be notified once your request has been processed and verified, thank you.
      `,
      "Loan request",
      userinfo.email,
      `${userinfo.firstName} ${userinfo.lastName}`
    )
      .then(() => {
        setLoading(false);
        setOpenSnackbar(true);
      })
      .catch(() => {
        setLoading(false);
        alert("Something went try again later");
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs">
      <CustomizedSnackbars
        openSnackbar={openSnackbar}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="success"
        message={"Loan Request submitted successfully"}
      />
      <Box mt={2} mb={3}>
        <Typography variant="h6">Request For A Loan</Typography>
      </Box>
      <form onSubmit={submit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              id="fullname"
              label="Fullname"
              defaultValue={values.fullname}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              label="Amount"
              value={values.amount}
              onChange={handleChange}
              name="amount"
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              constiant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Duration</InputLabel>
              <Select
                required
                labelId="demo-label"
                id="demo-select"
                name="duration"
                value={values.duration}
                label={"Duration"}
                onChange={handleChange}
              >
                {[1, 2, 3, 6, 12, 24, 36].map((duration, index) => (
                  <MenuItem key={index} value={duration}>
                    {duration} month
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              id="outlined-multiline-static"
              label="Remark for loan"
              onChange={handleChange}
              multiline
              rows={2}
              defaultValue=""
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControlLabel
              control={
                <Checkbox checked value="allowExtraEmails" color="primary" required />
              }
              label="I agree to loan terms and policy"
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <LoadingButton
              type="submit"
              loading={loading}
              fullWidth
              variant="contained"
              size="large"
              disableElevation
            >
              {`Submit`}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Loan;
