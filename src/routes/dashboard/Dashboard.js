import { Routes, Route } from "react-router-dom";
import DashboardNavigation from "../../components/dashboard-navigation/DashboardNavigation";
import ProfileDashboard from "../profile-dashboard/ProfileDashboard";
import ExpensesDashboard from "../expenses-dashboard/ExpensesDashboard";
import BudgetDashboard from "../budget-dashboard/BudgetDashboard";
import AccountsDashboard from "../accounts-dashboard/AccountsDashboard";
import MainDashboard from "../main-dashboard/MainDashboard";
import "./dashboard.css";
import incomes from "../../data/Incomes";
import expenses from "../../data/Expenses";
import categories from "../../data/Categories";
import bankAccounts from "../../data/Accounts";
import { useState, useEffect, useContext } from "react";
import ExpensesContext from "../../Context/Context";

const Dashboard = (props) => {
  const context = useContext(ExpensesContext);
  const { Type, specificexpense, addexpenses, updateexpense, getspecificexpense, setspecificexpense, deleteexpense, getincome, addStateIncome,specificincome,setspecificincome,updateincome,deleteincome} = context;
  const [formValue, setFormValue] = useState({ id: "", type: "", name: "", amount: "", currency: "$", category: "", bankAccount: "", created: "", note: "" });
  const [editFormValue, setEditFormValue] = useState({ id: "", type: "", name: "", amount: "", currency: "$", category: "", bankAccount: "", created: "", note: "" });
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState({});
  const [editFormError, setEditFormError] = useState({});
  // const [targetRecord, setTargetRecord] = useState(0);
  // const [targetRecordIndex, setTargetRecordIndex] = useState(0);
  const [targetRecordType, setTargetRecordType] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [expenseTable, setExpenseTable] = useState(true);
  const [toggleAddExpense, setToggleAddToExpense] = useState(false);
  const [toggleAddIncome, setToggleAddToIncome] = useState(false);
  const [toggleExistingExpenseIncome, setExistingExpenseIncome] =
    useState(false);
  const [recordInfo, setRecordInfo] = useState([
    {
      id: "", type: "", name: "", category: "", amount: "", currency: "", date: "", note: "",
    },
  ]);
  const covers = categories.reduce(
    (c, { ["name"]: x, ["cover"]: cover }) => ((c[x] = cover), c),
    {}
  );
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    identifyRecord();
    getincome();
  }, []);

  const identifyRecord = (id, type) => {
    if (type === "expense") {
      expenses.map((expense) => {
        if (expense.id === id) {
          setTargetRecordType("expense");
        }
        return expense;
      });
      getspecificexpense(id);
    }
    if (type === "income") {
      incomes.map((income) => {
        if (income.id === id) {
          setTargetRecordType(income.type);
        }
        return income;
      });
    }
  };

  const closeModal = () => {
    setToggleAddToExpense(false);
    setToggleAddToIncome(false);
    setExistingExpenseIncome(false);
    setEditMode(false);
  };

  const setExpenseTab = () => {
    setExpenseTable(true);
  };
  const setIncomeTab = () => {
    setExpenseTable(false);
  };
  const toggleExpenseModal = () => {
    setToggleAddToExpense(true);
  };
  const toggleIncomeModal = () => {
    setToggleAddToIncome(true);
  };
  const toggleExistingRecords = () => {
    setExistingExpenseIncome(true);
  };
  const getRecordInfo = ({ id, type, name, category, bankAccount, amount, currency, created, note }) => {
    identifyRecord(id, type);
    setRecordInfo({ id: id, type: type, name: name, category: category, bankAccount: bankAccount, amount: amount, currency: currency, created: created, note: note, });
  };

  // * FORMS

  const handleValidation = (e) => {
    const { name, value } = e.target;
    if (targetRecordType === "expense") {
      setFormValue({ ...formValue, id: expenses.length + 1, type: "expense", currency: "$", cover: covers[formValue.category], [name]: value, });
    }
    if (targetRecordType === "income") {
      setFormValue({ ...formValue, id: incomes.length + 1, type: "income", currency: "$", cover: covers[formValue.category], [name]: value, });
    }
  };
  const addIncome = (e) => {
    e.preventDefault();
    if (!validateForm(formValue)) return false;
    const { name, amount, category, bankAccount, note } = formValue;
    incomes.push(formValue);
    addStateIncome(name, amount, category, bankAccount, note);
    updateBankBalance(formValue, "add");
    setSubmit(true);
    setFormValue({ id: "", type: "", name: "", amount: "", currency: "$", category: "", bankAccount: "", created: "", note: "", });
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!validateForm(formValue)) return false;
    const { name, amount, category, bankAccount, note } = formValue;
    expenses.push(formValue);
    addexpenses(name, amount, category, bankAccount, note);
    updateBankBalance(formValue, "substract");
    setSubmit(true);
    setFormValue({ id: "", type: "", name: "", amount: "", currency: "$", category: "", bankAccount: "", created: "", note: "", });
  };

  const resetForm = () => {
    setSubmit(false);
    setFormValue({ id: "", type: "", name: "", amount: "", currency: "$", category: "", bankAccount: "", created: "", note: "", });
    setEditFormValue({ id: "", type: "", name: "", amount: "", currency: "$", category: "", bankAccount: "", created: "", note: "" });
    setFormError({});
  };
  const validateForm = (value) => {
    let errors = {};
    let isValid = true;
    if (!value.name) {
      errors.name = "Please enter name";
      isValid = false;
    }
    if (!value.amount) {
      errors.amount = "Please enter amount";
      isValid = false;
    } else if (isNaN(value.amount)) {
      errors.amount = "Please enter a valid amount in numbers";
      isValid = false;
    }
    if (!value.category) {
      errors.category = "Please enter category";
      isValid = false;
    }
    if (!isValid) setFormError(errors);

    return isValid;
  };

  ////////////// * Edit Exisitng Expense
  const editExpenseRecord = () => {
    setEditMode(true);
  };
  const cancelEditExpenseRecord = () => {
    setEditMode(false);
  };
  const deleteExistingRecord = (type) => {
    if(type==="expense"){
    deleteexpense(specificexpense._id);
    updateBankBalance(recordInfo, "add");
    }
    if (type === "income") {
      deleteincome(specificincome._id);
      updateBankBalance(recordInfo, "substract");
    }
    resetForm();
    setSuccessMessage(`Deleted ${type} successfuly! 👀`);
    setTimeout(() => {
      setSuccessMessage("");
      closeModal();
    }, 1500);
  };
  const handleEditValidation = (e) => {
    const { name, value } = e.target;
    setEditFormValue({ ...editFormValue, [name]: value });
  };

  const updateAddedExpense = (e) => {
    let newexpense = specificexpense;
    let newincome=specificincome;
    let prevamount=specificexpense.amount;
    let previncome=specificincome.amount;
    e.preventDefault();
    setEditFormError(validateEditForm(editFormValue));
    if (Type === "expense") {
      if (editFormValue.name.length > 0) {
        newexpense.name = editFormValue.name;
      }
      if (editFormValue.amount.length > 0 && !isNaN(editFormValue.amount)) {
        updateBankBalance(newexpense, "edit");
        newexpense.amount = editFormValue.amount;
      }
      if (
        editFormValue.category.length > 0 &&
        newexpense.category !== editFormValue.category
      ) {
        newexpense.category = editFormValue.category;
      }
      if (
        editFormValue.created.length > 0 &&
        newexpense.created !== editFormValue.created
      ) {
        newexpense.created = editFormValue.created;
      }
      if (
        editFormValue.bankAccount.length > 0 &&
        newexpense.bank_account !== editFormValue.bankAccount
      ) {
        newexpense.bank_account = editFormValue.bankAccount;
      }
      setspecificexpense(newexpense);
      updateexpense(
        newexpense._id,
        newexpense.name,
        newexpense.amount,
        newexpense.category,
        newexpense.bank_account,
        newexpense.note,
        prevamount
      );
    }
    if (Type === "income") {

      if (editFormValue.name.length > 0) {
        newincome.name = editFormValue.name;
      }
      if (editFormValue.amount.length > 0 && !isNaN(editFormValue.amount)) {
        updateBankBalance(newexpense, "edit");
        newincome.amount = editFormValue.amount;
      }
      if (
        editFormValue.category.length > 0 &&
        newincome.category !== editFormValue.category
      ) {
        newincome.category = editFormValue.category;
      }
      if (
        editFormValue.created.length > 0 &&
        newincome.created !== editFormValue.created
      ) {
        newincome.created = editFormValue.created;
      }
      if (
        editFormValue.bankAccount.length > 0 &&
        newincome.bank_account !== editFormValue.bankAccount
      ) {
        newincome.bank_account = editFormValue.bankAccount;
      }
      setspecificincome(newincome);
      updateincome(newincome._id,
        newincome.name,
        newincome.amount,
        newincome.category,
        newincome.bank_account,
        newincome.note,
        previncome
      )
      
    }
    setSuccessMessage(`Edited ${targetRecordType} successfuly! 🎉`);
    setTimeout(() => {
      setSuccessMessage("");
      closeModal();
    }, 1500);
  };

  //Update Bank Account Balance when add new transaction, edit them or delete them.
  const updateBankBalance = (transaction, action) => {
    const card = bankAccounts.find((b) => b.name === transaction.bankAccount);
    if (card) {
      if (action === "add") {
        card.currentBalance =
          Number(card.currentBalance) + Number(transaction.amount);
      }
      if (action === "substract") {
        card.currentBalance =
          Number(card.currentBalance) - Number(transaction.amount);
      }
      if (action === "edit") {
        if (transaction.type === "expense") {
          Number(transaction.amount < editFormValue.amount)
            ? (card.currentBalance =
              Number(card.currentBalance) -
              Number(editFormValue.amount - transaction.amount))
            : (card.currentBalance =
              Number(card.currentBalance) +
              Number(transaction.amount - editFormValue.amount));
        }
        if (transaction.type === "income") {
          Number(transaction.amount < editFormValue.amount)
            ? (card.currentBalance =
              Number(card.currentBalance) +
              Number(editFormValue.amount - transaction.amount))
            : (card.currentBalance =
              Number(card.currentBalance) -
              Number(transaction.amount - editFormValue.amount));
        }
      }
    }
  };

  const validateEditForm = (value) => {
    let errors = {};
    if (isNaN(value.amount)) {
      errors.amount = "Please enter a valid amount in numbers";
    }
    return errors;
  };

  return (
    <div className="dashboard">
      {props.user ? (
        <div>
          <DashboardNavigation logout={props.onLogout} resetForm={resetForm} />
          <div className="content">
            <Routes>
              <Route
                path="/"
                element={
                  <MainDashboard
                    identifyRecord={identifyRecord}
                    formError={formError}
                    resetForm={resetForm}
                    user={props.user}
                    addIncome={addIncome}
                    addExpense={addExpense}
                    handleValidation={handleValidation}
                    formValue={formValue}
                    submit={submit}
                  />
                }
              />
              <Route
                path="expenses"
                element={
                  <ExpensesDashboard
                    successMessage={successMessage}
                    identifyRecord={identifyRecord}
                    editFormError={editFormError}
                    recordInfo={recordInfo}
                    closeModal={closeModal}
                    toggleExistingExpenseIncome={toggleExistingExpenseIncome}
                    toggleAddExpense={toggleAddExpense}
                    toggleAddIncome={toggleAddIncome}
                    setIncomeTab={setIncomeTab}
                    getRecordInfo={getRecordInfo}
                    toggleExistingRecords={toggleExistingRecords}
                    expenseTable={expenseTable}
                    setExpenseTab={setExpenseTab}
                    toggleExpenseModal={toggleExpenseModal}
                    toggleIncomeModal={toggleIncomeModal}
                    deleteExistingRecord={deleteExistingRecord}
                    cancelEditExpenseRecord={cancelEditExpenseRecord}
                    handleEditValidation={handleEditValidation}
                    editFormValue={editFormValue}
                    validateEditForm={validateEditForm}
                    updateAddedExpense={updateAddedExpense}
                    editMode={editMode}
                    editExpenseRecord={editExpenseRecord}
                    formError={formError}
                    resetForm={resetForm}
                    addIncome={addIncome}
                    addExpense={addExpense}
                    handleValidation={handleValidation}
                    formValue={formValue}
                    submit={submit}
                  />
                }
              />
              <Route path="accounts" element={<AccountsDashboard />} />
              <Route path="budget" element={<BudgetDashboard />} />
              <Route
                path="profile"
                element={
                  <ProfileDashboard user={props.user} logout={props.onLogout} />
                }
              />
            </Routes>
          </div>
        </div>
      ) : (
        <div>You need to Login or Register</div>
      )}
    </div>
  );
};

export default Dashboard;
