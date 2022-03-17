import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { navigate } from "@reach/router";
import PropTypes from "prop-types";
import React from "react";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { countrylist } from "../../config/countrylist";
import {
  auth,
  createUserWithEmailAndPassword,
} from "../../config/firebaseinit";
import { addUsers, generateAccounts } from "../../config/services";
import { loading$ } from "../../redux/action";
import Logo from "../logo";
import { useStyles } from "../styles";

//const loggedIn$ = authState(auth).pipe(filter((user) => !!user));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      format={`+##########`}
      allowEmptyFormatting
      mask="_"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);

  const [values, setValues] = React.useState({
    numberformat: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    showPassword: false,
    country: "United States", // set up with reactlocalstorage
    countrycode: "US",
    mobilecode: "+1",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.value);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const chageCountryCode = (countrycode, dialcode) => {
    setValues({
      ...values,
      countrycode: countrycode,
      mobilecode: dialcode,
    });
  };

  const submitForm = (event) => {
    event.preventDefault();
    dispatch(loading$());
    const datas = {
      numberformat: values.numberformat,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      wallet_balance: 0,
      country: values.country,
      mobilecode: values.mobilecode,
      referrer: false,
      //  registered: firebase.firestore.FieldValue.serverTimestamp(),
      countrycode: values.countrycode,
      paymentallowed: 2,
      image: "https://image.com",
      // currencycode: "",
    };

    createUserWithEmailAndPassword(auth, datas.email, datas.password)
      .then((user) => {
        console.log("user created");
        const userid = user.user.uid;
        addUsers(userid, datas)
          .then(() => {
            generateAccounts(userid);
          })
          .then(() => {
            dispatch(loading$());
            navigate("dashboard/account");
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        dispatch(loading$());
      });
  };

  return (
    <div className={classes.paper}>
      <Logo />
      <Typography component="h1" variant="h5" gutterBottom>
        Sign up
      </Typography>
      <Typography>
        Already have an account? &nbsp;
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/")}
          color="primary"
        >
          {`Sign in`}
        </Link>
      </Typography>

      <form className={classes.form} onSubmit={submitForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First name"
              autoFocus
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last name"
              name="lastName"
              autoComplete="lname"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {values.showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              required
              variant="outlined"
              label="Country"
              name="country"
              value={values.country}
              id="standard-select-currency"
              onChange={handleChange}
            >
              {countrylist.map((ct, index) => (
                <MenuItem
                  key={index}
                  value={ct.name}
                  onClick={() => chageCountryCode(ct.code, ct.dial_code)}
                >
                  {ct.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Mobile"
              value={values.numberformat}
              onChange={handleChange}
              name="numberformat"
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox value="allowExtraEmails" color="primary" required />
              }
              label="I agree to terms, privacy and policy"
            />
          </Grid>
        </Grid>
        <LoadingButton
          type="submit"
          fullWidth
          loading={loading.loading}
          variant="contained"
          color="primary"
          disableElevation
        >
          {"Sign up"}
        </LoadingButton>
      </form>
    </div>
  );
}
