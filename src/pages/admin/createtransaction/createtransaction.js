import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import DesktopDateTimePicker from "@mui/lab/DesktopDateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Avatar,
  Button,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
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
    date: "",
    transaction_type: "Credit",
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

  const submitDebit = (e) => {
    e.preventDefault();
    if (values.amount >= currentbalance) {
      alert("Sorry balance too low to debit");
    } else {
      //first add the transaction for user
      addTransfer(id, { ...values, transaction_type: "Debit" }).then(() => {
        //second update balance
        const balance = currentbalance - parseInt(values.amount);
        updateUserBalance(id, type, balance).then(() => {
          alert("Success account debited 👍");
        });
      });
    }
  };

  const submitCredit = (e) => {
    e.preventDefault();
    //first add the transaction for user
    addTransfer(id, { ...values, transaction_type: "Credit" }).then(() => {
      //second update balance
      const balance = currentbalance + parseInt(values.amount);
      updateUserBalance(id, type, balance).then(() => {
        alert("Success account credited  👍");
      });
    });
  };

  return (
    <form
      onSubmit={
        values.transaction_type === "Credit" ? submitCredit : submitDebit
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <CardHeader
            title={`${user.firstName} ${user.lastName}`}
            subheader={user.email}
            avatar={
              <Avatar
                sx={{ bgcolor: "#073407", width: 56, height: 56 }}
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
          <TextField
            fullWidth
            id="outlined-reciever-acct"
            label="Accoint number"
            variant="outlined"
            name="accountnumber"
            value={values.accountnumber}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              fullWidth
              id="datetime-local"
              label="Date"
              type="datetime-local"
              defaultValue={values.date}
              onChange={changeDate}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Action</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={values.transaction_type}
              name="transaction_type"
              label="Action"
              onChange={handleChange}
            >
              <MenuItem value={"Credit"}>Credit</MenuItem>
              <MenuItem value={"Debit"}>Debit</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            disableElevation
            type="submit"
          >
            Submit
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          {currentbalance}
        </Grid>
      </Grid>
    </form>
  );
}
