import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { navigate } from "@reach/router";
import * as React from "react";
import { useSelector } from "react-redux";
import { CurrencyFormat } from "../currencyformatter";
import { useStyles } from "../styles";
import CardSlder from "./cardslider";
import Profile, { ProfileHeader } from "./profile";

function AccountIndex() {
  const savingsinfo = useSelector((state) => state.savingsInfos);
  const checkingsinfo = useSelector((state) => state.checkingsInfos);

  const classes = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <ProfileHeader />
            </Grid>
            <Grid item xs={12} md={12}>
              <CardSlder />
            </Grid>
            <Grid
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
              item
              xs={12}
              md={12}
            >
              <Profile />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {[
              {
                title: "Savings account",
                account_number: savingsinfo.accountnumber,
                balance: savingsinfo.balance,
                page: "savings",
              },
              {
                title: "Checkings account",
                account_number: checkingsinfo.accountnumber,
                balance: checkingsinfo.balance,
                page: "checkings",
              },
            ].map((accnt, index) => (
              <Grid item xs={12} md={12} key={index}>
                <Card>
                  <CardHeader
                    title={accnt.title}
                    subheader={`Account number: ${accnt.account_number}`}
                  />
                  <CardContent>
                    <Typography variant="h5">
                      <CurrencyFormat amount={accnt.balance} />
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Stack direction="row" spacing={2}>
                      {[
                        {
                          title: "copy",
                          variant: "contained",
                          icon: <CreditCardOutlinedIcon />,
                          action: () => {
                            navigate(`/dashboard/cards/${accnt.page}`);
                          },
                        },
                        {
                          title: "History",
                          variant: "outlined",
                          icon: <HistoryOutlinedIcon />,
                          action: () => {
                            navigate(`/dashboard/transactions/${accnt.page}`);
                          },
                        },
                        {
                          title: "transfer",
                          variant: "contained",
                          icon: <SendOutlinedIcon />,
                          action: () => {
                            navigate(`/dashboard/transfer/${accnt.page}`);
                          },
                        },
                      ].map((action, index) => (
                        <IconButton
                          size="medium"
                          aria-label={action.title}
                          color="inherit"
                          className={classes.stackicon}
                          key={index}
                          onClick={action.action}
                        >
                          {action.icon}
                        </IconButton>
                      ))}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Grid
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                },
              }}
              item
              xs={12}
              md={12}
            >
              <Profile />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AccountIndex;
