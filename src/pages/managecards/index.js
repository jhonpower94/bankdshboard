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
      title: "Checkings account",
      balance: "$50,000",
      type: "checkings",
      data: checkingsinfo,
    },
  ];

  return (
    <div>
      <Tabs
        variant="fullWidth"
        value={state.index}
        fullWidth
        onChange={handleChange}
        style={styles.tabs}
      >
        {accountarrays.map((account, index) => (
          <Tab label={account.type} key={index} />
        ))}
      </Tabs>
      <SwipeableViews
        index={index}
        onChangeIndex={(index) => handleChangeIndex(index)}
      >
        {accountarrays.map((account, index) => (
          <div style={Object.assign({}, styles.slide)} key={index}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} md={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 3,
                  }}
                >
                  <CreditCard type={account.type} data={account.data} />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="column" spacing={2}>
                  {["Enable card", "Change Card", "Order card"].map(
                    (val, index) => (
                      <CustomButton
                        key={index}
                        onClick={() => {
                           navigate(`../access`);
                        }}
                      >
                        {val}
                      </CustomButton>
                    )
                  )}
                </Stack>
              </Grid>
            </Grid>
          </div>
        ))}
      </SwipeableViews>
    </div>
  );
};

export default TransferIndex;
