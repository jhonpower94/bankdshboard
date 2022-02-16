import { MenuItem, Select, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

import SwipeableViews from "react-swipeable-views";
import TransactioMain from "./main";

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
      accountype: "savings",
      data: [
        {
          type: "Credit",
          amount: 93800,
          date: "01/18/22 8:44 am",
          reciever: "Emma Macarthy",
          reference: "554747475476647343",
        },
        {
          type: "Debit",
          amount: 39000,
          date: "02/10/21 8:44 am",
          reciever: "Emma Macarthy",
          reference: "554747475476647343",
        },
        {
          type: "Debit",
          amount: 5054,
          date: "09/08/21 8:44 am",
          reciever: "Lyon Hector",
          reference: "546754674657456464",
        },
        {
          type: "Debit",
          amount: 14860,
          date: "11/07/21 8:44 am",
          reciever: "Anthony Erics",
          reference: "362344365564757457",
        },
      ],
    },
    {
      accountype: "checkings",
      data: [
        {
          type: "Debit",
          amount: 7000,
          date: "01/16/22 8:44 am",
          reciever: "Anthony Erics",
          reference: "43434343434343433",
        },
        {
          type: "Credit",
          amount: 43600,
          date: "01/18/21 8:44 am",
          reciever: "Emma Macarthy",
          reference: "554747475476647343",
        },
        {
          type: "Debit",
          amount: 19650,
          date: "19/06/21 8:44 am",
          reciever: "Lyon Hector",
          reference: "32724782762438434",
        },
        {
          type: "Credit",
          amount: 93500,
          date: "08/02/21 8:44 am",
          reciever: "Lyon Hector",
          reference: "98767t65767688698",
        },
      ],
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
          <Tab label={account.accountype} key={index} />
        ))}
      </Tabs>
      <SwipeableViews
        index={index}
        onChangeIndex={(index) => handleChangeIndex(index)}
      >
        {accountarrays.map((account, index) => (
          <div style={Object.assign({}, styles.slide)} key={index}>
            <TransactioMain data={account.data} />
          </div>
        ))}
      </SwipeableViews>
    </div>
  );
};

export default TransferIndex;
