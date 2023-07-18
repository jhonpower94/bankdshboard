import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { serverTimestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import * as React from "react";
import NumberFormat from "react-number-format";
import International from "./international";
import Local from "./local";
import Internal from "./internal";
import { useSelector } from "react-redux";
import { navigate } from "@reach/router";
import { sendMessage } from "../../config/services";
import UsdtTransfer from "./usdt";

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

function TransferMain({ type }) {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const time = today.getHours() + ":" + today.getMinutes();

  const [loading, setLoading] = React.useState(false);
  const userinfo = useSelector((state) => state.useInfos);

  const [values, setValues] = React.useState({
    type: type,
    transaction_type: "Debit",
    amount: "",
    mode: "domestic",
    accountnumber: "",
    bankname: "",
    fullname: "",
    swift: "",
    iban: "",
    country: "",
    wallet: "",
    network: "ERC20",
    date: `${mm}/${dd}/${yyyy} ${time}`,
    timestamp: serverTimestamp(),
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.value);
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
      <Box mt={2} mb={2}>
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
              value="Internal"
              name="mode"
              control={<Radio />}
              label="Internal"
            />
            <FormControlLabel
              value="domestic"
              name="mode"
              control={<Radio />}
              label="Domestic"
            />
            <FormControlLabel
              value="international"
              name="mode"
              control={<Radio />}
              label="International transfer"
            />
            <FormControlLabel
              value="crypto"
              name="mode"
              control={<Radio />}
              label="USDT transfer"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {values.mode === "Internal" ? (
        <Internal
          values={values}
          handleChange={handleChange}
          submitForm={submitForm}
          loading={loading}
        />
      ) : null}
      {values.mode === "domestic" ? (
        <Local
          values={values}
          handleChange={handleChange}
          submitForm={submitForm}
          loading={loading}
        />
      ) : null}
      {values.mode === "international" ? (
        <International
          values={values}
          handleChange={handleChange}
          submitForm={submitForm}
          loading={loading}
        />
      ) : null}
      {values.mode === "crypto" ? (
        <UsdtTransfer
          values={values}
          handleChange={handleChange}
          submitForm={submitForm}
          loading={loading}
        />
      ) : null}
    </Container>
  );
}

export default TransferMain;
