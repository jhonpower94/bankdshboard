import {
  CardActions,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { navigate } from "@reach/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import SwipeableViews from "react-swipeable-views";
import CreditCard from "../creditcard";
import { CustomButton } from "../styles";

const styles = {
  tabs: {
    background: "#fff",
  },
  slide: {
    padding: 15,
    minHeight: 100,
  },
  slide1: {
    backgroundColor: "#FEA900",
  },
  slide2: {
    backgroundColor: "#B3DC4A",
  },
  slide3: {
    backgroundColor: "#6AC0FF",
  },
};

const TransferIndex = ({ account }) => {
  const isSavings = account === "savings";

  const savingsinfo = useSelector((state) => state.savingsInfos);
  const checkingsinfo = useSelector((state) => state.checkingsInfos);

  const [state, setState] = useState({ index: isSavings ? 0 : 1 });

  const handleChange = (event, value) => {
    console.log(value);
    setState({
      index: value,
    });
  };

  const handleChangeIndex = (index) => {
    setState({
      index: index,
    });
  };

  const { index } = state;

  const accountarrays = [
    {
      title: "Savings account",
      balance: "$50,000",
      type: "savings",
      data: savingsinfo,
    },
    {
      title: "Overdraft",
      balance: "$50,000",
      type: "overdraft",
      data: checkingsinfo,
    },
  ];

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <CreditCard type={"savings"} data={savingsinfo} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="column" spacing={2}>
            {[
              { title: "Order card", disabled: false },
              { title: "Change Card", disabled: true },
            ].map((val, index) => (
              <CustomButton
                disabled={val.disabled}
                key={index}
                onClick={() => {
                  navigate(`../order`);
                }}
              >
                {val.title}
              </CustomButton>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default TransferIndex;
