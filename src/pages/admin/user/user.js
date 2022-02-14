import * as React from "react";
import PropTypes from "prop-types";
import { Button, CardHeader, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import {
  getuserDataAdmin,
  getuserDataBalanceAdmin,
  updateuserDataBalanceAdmin,
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

export default function EditUser({ type, id }) {
  const [values, setValues] = React.useState({
    numberformat: "0",
  });

  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  React.useEffect(() => {
    console.log(id, type);
    getuserDataAdmin(id).subscribe((userData) => {
      setUser(userData);
      console.log(userData);
    });

    getuserDataBalanceAdmin(id, type).subscribe((userData) => {
      setValues({ numberformat: userData.balance });
      console.log(userData);
    });
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const submit = () => {
    //  console.log({ balance: values.numberformat });
    updateuserDataBalanceAdmin(id, type, values.numberformat);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <CardHeader
          title={`${user.firstName} ${user.lastName}`}
          subheader={user.email}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          id="outlined-savings"
          label="Savings balane"
          variant="outlined"
          name="numberformat"
          value={values.numberformat}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          disableElevation
          onClick={submit}
        >
          Save changes
        </Button>
      </Grid>
    </Grid>
  );
}
