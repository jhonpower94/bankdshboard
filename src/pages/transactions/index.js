import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  const transactions = useSelector((state) => state.totalTransactionsType);
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
      accountransaction_type: "savings",
      data: [
        ...transactions.savings,
        {
          transaction_type: "Credit",
          amount: 93800,
          date: "01/18/2022 8:44 ",
          accountnumber: "Emma Macarthy",
          uid: "554747475476647343",
        },
        {
          transaction_type: "Debit",
          amount: 39000,
          date: "02/10/2021 20:52 ",
          accountnumber: "Emma Macarthy",
          uid: "554747475476647343",
        },
        {
          transaction_type: "Debit",
          amount: 5054,
          date: "09/08/2021 8:19 ",
          accountnumber: "Lyon Hector",
          uid: "546754674657456464",
        },
        {
          transaction_type: "Debit",
          amount: 14860,
          date: "11/07/2021 8:26 ",
          accountnumber: "Anthony Erics",
          uid: "362344365564757457",
        },
      ],
    },
    {
      accountransaction_type: "checkings",
      data: [
        ...transactions.checkings,
        {
          transaction_type: "Debit",
          amount: 7000,
          date: "01/16/2022 3:19 ",
          accountnumber: "Anthony Erics",
          uid: "43434343434343433",
        },
        {
          transaction_type: "Credit",
          amount: 43600,
          date: "01/18/2021 7:41 ",
          accountnumber: "Emma Macarthy",
          uid: "554747475476647343",
        },
        {
          transaction_type: "Debit",
          amount: 19650,
          date: "19/06/2021 8:15 ",
          accountnumber: "Lyon Hector",
          uid: "32724782762438434",
        },
        {
          transaction_type: "Credit",
          amount: 93500,
          date: "08/02/2021 11:12 ",
          accountnumber: "Lyon Hector",
          uid: "98767t65767688698",
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
            <TransactioMain data={account.data} type={account.accountype} />
          </div>
        ))}
      </SwipeableViews>
    </div>
  );
};

export default TransferIndex;
