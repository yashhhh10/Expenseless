import React from "react";
import ExpensesContext from "../../Context/Context";
import { useContext } from "react";

const ExpensesTable = (props) => {

  const context = useContext(ExpensesContext);
  const { setspecificexpense, expenses,setType } = context;
  return (
    <React.Fragment>
      {expenses.length === 0 ? (
        <p className="no-records-found">No records found</p>
      ) : (
        <section className="tables">
          <table className="greyGridTable">
            <thead>
              <tr>
                <th scope="col">Expense name</th>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
                <th scope="col">Account</th>
                <th scope="col">More</th>
              </tr>
            </thead>
            <tbody>
              {props.currentExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td data-label="Expense name">
                    <span>
                      {/* <img src={expense.cover} alt="" /> */}
                      {expense.name}
                    </span>
                  </td>
                  <td data-label="Category">{expense.category}</td>
                  {/* <td data-label="Created">{expense.created}</td> */}
                  <td data-label="Amount" className="expense-amount">
                    -{expense.amount}
                    &#x20B9;
                  </td>
                  <td data-label="Account">{expense.bank_account}</td>
                  <td
                    data-label="More"
                    onClick={() => {
                      props.toggleExistingRecords();
                      props.getRecordInfo(expense);
                      setType("expense");
                      setspecificexpense(expense);
                    }}
                  >
                    ...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </React.Fragment>
  );
};

export default ExpensesTable;
