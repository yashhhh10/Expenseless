import React,{useContext}from 'react'
import "./mainDashboard.css"
import ProgressBar from "./charts/progressbar/ProgressBar";
import { Link } from "react-router-dom";
import { monthExpenses, monthIncome } from '../../helpers/TransactionsByMonth';
import ExpensesContext from "../../Context/Context";


const BudgetStatus = () => {
  const context = useContext(ExpensesContext);
  const{totalincome,totalexpense}=context;
    const currentMonth = new Date().getMonth() + 1;
    return (
        <div className="budget-status card">
            <div className="card-content">
                Budget status
                <div>
                    <span className="bar-title">Income </span>
                    <span className="amount">{totalincome}&#x20B9;</span>
                    <ProgressBar done={totalincome / 1000} />
                </div>
                <div>
                    <span className="bar-title">Expenses</span>
                    <span className="amount">{totalexpense}&#x20B9;</span>
                    <ProgressBar done={totalexpense / 1000} />
                </div>

                <Link to="expenses">See all transactions &#62; </Link>
            </div>
        </div>
    )
}

export default BudgetStatus