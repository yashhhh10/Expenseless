import React, { useEffect, useState } from "react";
import UserContext from "./Context";



const State = (props) => {
  const [accounts, setaccounts] = useState([]);
  const [specificacc, setspecificacc] = useState([]);
  const [specificuser, setspecificuser] = useState([]);
  const [expenses, setexpenses] = useState([]);
  const [specificexpense, setspecificexpense] = useState([]);
  const [incomes, setincomes] = useState([]);
  const [specificincome, setspecificincome] = useState([]);
  const [totalincome, settotalincome] = useState(0);
  const [totalexpense, settotalexpense] = useState(0);
  const [Type, setType] = useState("");


  useEffect(() => {
    settotalincome(0);
    getuser()
    getaccounts()
    getexpenses()
    getincome()
  }, [])
  ////////////                                 USER
  //function to get user
  const getuser = async () => {
    const response = await fetch(`https://expenseless-backend.onrender.com/api/auth/getuser`, {
      method: "GET",
      headers: {
        "auth-token": sessionStorage.getItem("authtoken"),
      },
    });
    const json = await response.json();
    setspecificuser(json);
  };
  const updateuser = async (email, language, currency, subscription) => {
    // eslint-disable-next-line
    const response = await fetch(`https://expenseless-backend.onrender.com/api/auth/updateuser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("authtoken"),
      },
      body: JSON.stringify({
        email: email,
        language: language,
        currency: currency,
        subscription: subscription,
      }),
    });
    let newuser = {};
    if (email) newuser.email = email;
    if (language) newuser.language = language;
    if (currency) newuser.currency = currency;
    if (subscription) newuser.subscription = subscription;

    setspecificuser(newuser);
  };
  const deleteuser = async (email, password) => {
    // eslint-disable-next-line
    const response = await fetch(`https://expenseless-backend.onrender.com/api/auth/deleteuser`, {
      method: "DElETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("authtoken"),
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const json = await response.json();
    if (json.status === "400") {
      sessionStorage.removeItem("authtoken");
    }
  };

  //////                                      USER


  //////                                      Accounts
  //function to get all accounts
  const getaccounts = async () => {
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/accounts/fetchallaccounts`,
      {
        method: "GET",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const json = await response.json();
    setaccounts(json);
  };

  // function to add account
  const addaccount = async (name, balance, cardnum, color) => {
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/accounts/addaccount`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ name, balance, cardnum, color }),
      }
    );
    const json = await response.json();
    const newaccount = {
      name: name,
      balance: balance,
      cardnum: cardnum,
      color: color,
      key: json._id,
    };
    setaccounts(accounts.concat(newaccount));
  };

  // function to get specific account
  const getspecificaccount = async (id) => {
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/accounts/getaccount/${id}`,
      {
        method: "GET",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const json = await response.json();
    setspecificacc(json);
  };


  const updateaccount = async (id, name, balance, cardnum, color) => {
    // eslint-disable-next-line
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/accounts/updateaccount/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("authtoken"),
        },
        body: JSON.stringify({
          name: name,
          balance: balance,
          cardnum: cardnum,
          color: color,
        }),
      }
    );
    let newaccount = JSON.parse(JSON.stringify(accounts));

    for (let index = 0; index < accounts.length; index++) {
      const element = accounts[index];
      if (element._id === id) {
        newaccount[index].name = name;
        newaccount[index].balance = balance;
        newaccount[index].cardnum = cardnum;
        newaccount[index].color = color;
      }
    }
    setaccounts(newaccount);
  };
  //function to delete account
  const deleteaccount = async (id) => {
    // eslint-disable-next-line
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/accounts/deleteaccount/${id}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const newaccounts = accounts.filter((accounts) => {
      return accounts._id !== id;
    });
    setaccounts(newaccounts);
  };
  //////                                           Accounts







  //////////                                         EXPENSES
  //function to get all expenses
  const getexpenses = async () => {
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/expenses/fetchallexpenses`,
      {
        method: "GET",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const json = await response.json();
    setexpenses(json);
    let totalExpense = 0;
    json.forEach(expense => {
      totalExpense += expense.amount
    })
    settotalexpense(totalExpense)
  };

  const addexpenses = async (name, amount, category, bank_account, note) => {
    const currentTotal = typeof totalexpense === 'string' ? parseInt(totalexpense) : totalexpense;
    let newtotal = currentTotal + parseInt(amount)
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/expenses/addexpenses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ name, amount, category, bank_account, note }),
      }
    );
    const json = await response.json();
    const newexpense = {
      name: name,
      amount: amount,
      category: category,
      bank_account: bank_account,
      note: note,
      key: json._id,
    };
    setexpenses(expenses.concat(newexpense));
    settotalexpense(newtotal);
  };

  const getspecificexpense = async (id) => {
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/expenses/getexpense/${id}`,
      {
        method: "GET",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const json = await response.json();
    setspecificexpense(json);
  };
  const updateexpense = async (id, name, amount, category, bank_account, note, prevamount) => {
    // eslint-disable-next-line
    const currentTotal = typeof totalexpense === 'string' ? parseInt(totalexpense) : totalexpense;
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/expenses/updateexpense/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("authtoken"),
        },
        body: JSON.stringify({
          name: name,
          amount: amount,
          category: category,
          bank_account: bank_account,
          note: note,
        }),
      }
    );
    const json = await response.json();
    let newexpense = JSON.parse(JSON.stringify(expenses));

    for (let index = 0; index < expenses.length; index++) {
      const element = expenses[index];

      if (element._id === id) {
        if (amount) {
          let newtotal = currentTotal + parseInt(amount) - parseInt(prevamount)
          settotalexpense(newtotal)
        }
        newexpense[index].name = name;
        newexpense[index].amount = amount;
        newexpense[index].category = category;
        newexpense[index].bank_account = bank_account;
        newexpense[index].note = note;

        setspecificexpense(newexpense[index]);
      }
    }
    setexpenses(newexpense);

  };

  const deleteexpense = async (id) => {
    // eslint-disable-next-line
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/expenses/deleteexpense/${id}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const newexpenses = expenses.filter((expenses) => {
      if (expenses._id == id) {
        settotalexpense(totalexpense - expenses.amount)
      }
      return expenses._id !== id;
    });
    setexpenses(newexpenses);

  };
  //////                                 EXPENSES





  ///////                               INCOMES
  //function to get all incomes
  const getincome = async () => {
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/incomes/fetchallIncomes`,
      {
        method: "GET",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const json = await response.json();
    setincomes(json);
    let totalIncome = 0;
    json.forEach(income => {
      totalIncome += income.amount
    })
    settotalincome(totalIncome)
  };

  const addStateIncome = async (name, amount, category, bank_account, note) => {
    const currentTotal = typeof totalincome === 'string' ? parseInt(totalincome) : totalincome;
    let newtotal = currentTotal + parseInt(amount)
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/incomes/addincome`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ name, amount, category, bank_account, note }),
      }
    );
    const json = await response.json();
    const newincome = {
      name: name,
      amount: amount,
      category: category,
      bank_account: bank_account,
      note: note,
      key: json._id,
    };
    setincomes(incomes.concat(newincome));
    settotalincome(newtotal)
  };

  const getspecificincome = async (id) => {
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/incomes/getincome/${id}`,
      {
        method: "GET",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const json = await response.json();
    setspecificincome(json);
  };
  const updateincome = async (id, name, amount, category, bank_account, note, previncome) => {
    // eslint-disable-next-line
    const currentTotal = typeof totalincome === 'string' ? parseInt(totalincome) : totalincome;

    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/incomes/updateincome/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("authtoken"),
        },
        body: JSON.stringify({
          name: name,
          amount: amount,
          category: category,
          bank_account: bank_account,
          note: note,
        }),
      }
    );
    const json = await response.json();
    let newincome = JSON.parse(JSON.stringify(incomes));

    for (let index = 0; index < incomes.length; index++) {
      const element = incomes[index];
      if (element._id === id) {
        if (amount) {
          let newtotal = currentTotal + parseInt(amount) - parseInt(previncome)
          settotalincome(newtotal)
        }
        newincome[index].name = name;
        newincome[index].amount = amount;
        newincome[index].category = category;
        newincome[index].bank_account = bank_account;
        newincome[index].note = note;
        setspecificincome(newincome[index]);
      }
    }
    setincomes(newincome);
  };

  const deleteincome = async (id) => {
    // eslint-disable-next-line
    const response = await fetch(
      `https://expenseless-backend.onrender.com/api/incomes/deleteincome/${id}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": sessionStorage.getItem("authtoken"),
        },
      }
    );
    const newincome = incomes.filter((incomes) => {
      if (incomes._id == id) {
        settotalincome(totalincome - incomes.amount)
      }
      return incomes._id !== id;
    });
    setincomes(newincome);
  };
  ///////                                   INCOMES

  return (
    <UserContext.Provider
      value={{
        Type, setType,
        specificuser, setspecificuser, getuser, updateuser, deleteuser,
        accounts, specificacc, getspecificaccount, getaccounts, addaccount, deleteaccount, updateaccount,
        expenses, specificexpense, setexpenses, getexpenses, addexpenses, updateexpense, deleteexpense, getspecificexpense, setspecificexpense,
        incomes, specificincome, setincomes, setspecificincome, getincome, addStateIncome, updateincome, deleteincome, getspecificincome,
        totalincome, settotalincome, totalexpense, settotalexpense
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default State;
