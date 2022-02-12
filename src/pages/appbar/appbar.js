import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { CardActions, CardHeader, Chip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { CurrencyFormat } from "../currencyformatter";
import { MenuIconCustom } from "../custom";
import logo from "../../images/logo.svg";
import { useStyles } from "../styles";
import Menus from "./menus";
import { useSelector } from "react-redux";

export default function AppbarMain({ handleDrawer }) {
  const classes = useStyles();
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${300}px)` },
        ml: { sm: `${300}px` },
        backgroundColor: "#fff",
      }}
      elevation={0}
      color="transparent"
      style={{
        borderBottom: "1px solid #E7EBF0",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawer}
          sx={{ mr: 2, display: { sm: "none" } }}
          className={classes.stackicon}
        >
          <MenuIconCustom />
        </IconButton>
        <img src={logo} height={40} alt="Enrichement FCU" />
        <Box sx={{ flexGrow: 1 }} />
        <Menus />
      </Toolbar>
    </AppBar>
  );
}

export const Drawertop = () => {
  const savingsBalance = useSelector((state) => state.savingsInfos.balance);
  const checkngsBalance = useSelector((state) => state.checkingsInfos.balance);

  const totalBalance = savingsBalance + checkngsBalance;

  return (
    <>
      <CardHeader
        title={<CurrencyFormat amount={totalBalance} />}
        subheader="Total account balance"
      />
      <CardActions>
        <Stack direction="row" spacing={2}>
          <Chip label="Savings" />
          <Chip label="Checkings" />
        </Stack>
      </CardActions>
    </>
  );
};
