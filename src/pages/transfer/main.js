import { LoadingButton } from "@mui/lab";
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { navigate } from "@reach/router";
import { serverTimestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import * as React from "react";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import { sendMessage } from "../../config/services";

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

const allBanks = require("../../config/bank.json");
const countries = require("../../config/country.json");

function TransferMain({ type }) {
  const userinfo = useSelector((state) => state.useInfos);
  const [loading, setLoading] = React.useState(false);

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const time = today.getHours() + ":" + today.getMinutes();

  const [values, setValues] = React.useState({
    type: type,
    transaction_type: "Debit",
    amount: "",
    mode: "local",
    accountnumber: "",
    bankname: "",
    fullname: "",
    swift: "",
    iban: "",
    country: "",
    date: `${mm}/${dd}/${yyyy} ${time}`,
    timestamp: serverTimestamp(),
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = (event) => {
    event.preventDefault();
    setLoading(true);
    const otp = Math.floor(1000 + Math.random() * 9000);
    sendMessage(
      `You have made a transaction, please use this otp code below to confirm transaction
    <br/>
    ${otp} `,
      "Verify-otp",
      userinfo.email,
      `${userinfo.firstName} ${userinfo.lastName}`
    )
      .then((result) => {
        console.log(result);
        setLoading(false);
        navigate("../security", { state: { ...values, code: `${otp}` } });
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        alert("Something went wrong please try again.");
      });
  };
  return (
    <Container>
      <form onSubmit={submitForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Transaction type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="mode"
                value={values.mode}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="local"
                  name="mode"
                  control={<Radio />}
                  label="Local transfer"
                />
                <FormControlLabel
                  value="international"
                  name="mode"
                  control={<Radio />}
                  label="International transfer"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={5}>
            <TextField
              required
              id="outlined-basic"
              label="Account number"
              name="accountnumber"
              constiant="outlined"
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {values.mode === "local" ? (
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select bank
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="bankname"
                  value={values.bankname}
                  label={values.bankname}
                  onChange={handleChange}
                >
                  {allBanks.map((bank, index) => (
                    <MenuItem key={index} value={bank.bankName}>
                      {bank.bankName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : (
            <React.Fragment>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="outlined-basic"
                  label="Recievers full name"
                  name="fullname"
                  constiant="outlined"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  id="outlined-basic"
                  label="Swift / ABA routing number"
                  name="swift"
                  constiant="outlined"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  required
                  id="outlined-basic"
                  label="IBAN"
                  name="iban"
                  constiant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  required
                  id="outlined-basic"
                  label="Recievers bank name"
                  name="bankname"
                  constiant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Recievers country
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label-country"
                    id="demo-simple-select-country"
                    name="country"
                    value={values.country}
                    label={values.country}
                    onChange={handleChange}
                  >
                    {countries.map((cntry, index) => (
                      <MenuItem key={index} value={cntry.name}>
                        {cntry.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </React.Fragment>
          )}
          <Grid item xs={12} md={12}>
            <TextField
              id="outlined-multiline-static"
              label="Transfer description"
              multiline
              rows={2}
              defaultValue=""
              fullWidth
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
              {`Continue`}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default TransferMain;
