import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import DesktopDateTimePicker from "@mui/lab/DesktopDateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Avatar, Button, CardHeader, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import * as React from "react";
import NumberFormat from "react-number-format";
import {
  addTransfer,
  getuserDataAdmin,
  getuserDataBalanceAdmin,
  updateUserBalance,
} from "../../../config/services";

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

export default function CreateTransaction({ type, id }) {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const time = today.getHours() + ":" + today.getMinutes();

  const [values, setValues] = React.useState({
    type: type,
    amount: "0",
    fullname: "",
    accountnumber: "",
    date: new Date(),
  });

  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "http//image.com",
  });

  const [currentbalance, setCurrentbalance] = React.useState(0);
  const [errormessage, setErrorMeesage] = React.useState(0);

  React.useEffect(() => {
    getuserDataAdmin(id).subscribe((userData) => {
      setUser(userData);
      console.log(userData);
    });

    getuserDataBalanceAdmin(id, type).subscribe((data) => {
      setCurrentbalance(data.balance);
      console.log(data);
    });
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const changeDate = (e) => {
    var splittext = e.target.value.split("T");
    console.log(`${splittext[0]} ${splittext[1]}`);
    setValues({
      ...values,
      date: `${splittext[0]} ${splittext[1]}`,
    });
  };

  const submitDebit = () => {
    if (values.amount >= currentbalance) {
      alert("Sorry balance too low to debit");
    } else {
      //first add the transaction for user
      addTransfer(id, { ...values, transaction_type: "Debit" }).then(() => {
        //second update balance
        const balance = currentbalance - parseInt(values.amount);
        updateUserBalance(id, type, balance).then(() => {
          alert("Success account debited created 👍");
        });
      });
    }
  };

  const submitCredit = () => {
    //first add the transaction for user
    addTransfer(id, { ...values, transaction_type: "Credit" }).then(() => {
      //second update balance
      const balance = currentbalance + parseInt(values.amount);
      updateUserBalance(id, type, balance).then(() => {
        alert("Success account credited created 👍");
      });
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <CardHeader
          title={`${user.firstName} ${user.lastName}`}
          subheader={user.email}
          avatar={
            <Avatar
              sx={{ bgcolor: "#d20000", width: 56, height: 56 }}
              alt="Remy Sharp"
              src={user.image}
            />
          }
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          id="outlined-savings"
          label="Amount"
          variant="outlined"
          name="amount"
          value={values.amount}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
          focused
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          id="outlined-reciever"
          label="Recievers name"
          variant="outlined"
          name="recievername"
          value={values.recievername}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TextField
            id="datetime-local"
            label="Next appointment"
            type="datetime-local"
            defaultValue=""
            onChange={changeDate}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          disableElevation
          onClick={submitDebit}
        >
          Debit
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          disableElevation
          onClick={submitCredit}
        >
          Credit
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        {currentbalance}
      </Grid>
    </Grid>
  );
}
