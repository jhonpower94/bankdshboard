import * as React from "react";
import PropTypes from "prop-types";
import { Avatar, Button, CardHeader, Grid, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import NumberFormat from "react-number-format";
import {
  getuserDataAdmin,
  getuserDataBalanceAdmin,
  updateuserDataBalanceAdmin,
} from "../../../config/services";
import { DropzoneArea, DropzoneDialog } from "material-ui-dropzone";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../config/firebaseinit";

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
  const [state, setState] = React.useState({
    open: false,
    files: [],
  });

  const [values, setValues] = React.useState({
    numberformat: "0",
  });

  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "http//image.com"
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

  const handleOpen = () => {
    setState({
      open: true,
    });
  };

  const handleClose = () => {
    setState({
      open: false,
    });
  };

  const handleSave = (files) => {
    console.log(files);
    const storageRef = ref(storage, `images/${files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          const userRef = doc(db, "users", id);

          setDoc(userRef, { image: downloadURL }, { merge: true }).then(() => {
            //Saving files to state for further use and closing Modal.
            setState({
              files: files,
              //  open: false,
              name: files[0].name,
            });
          });
        });
      }
    );
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
      <Grid item xs={12} md={12}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          disableElevation
          onClick={handleOpen}
        >
          Add Image
        </Button>
        <DropzoneDialog
          open={state.open}
          onSave={handleSave}
          acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={handleClose}
        />
      </Grid>
      <Grid item xs={12} md={12}>
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
