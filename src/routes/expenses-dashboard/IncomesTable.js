// import incomes from "../../data/Incomes";
import ExpensesContext from "../../Context/Context";
import React, { useContext } from "react";

const IncomesTable = (props) => {
    const context = useContext(ExpensesContext);
    const { incomes, setspecificincome,setType } = context;
    return (
        <React.Fragment>
            {incomes.length === 0 ? <p className="no-records-found">No records found</p> :
                <section className="tables">
                    <table className="greyGridTable">
                        <thead>
                            <tr>
                                <th scope="col">Income name</th>
                                <th scope="col">Category</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Account</th>
                                <th scope="col">More</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.currentIncomes.map((income) =>
                                <tr key={income._id}>
                                    <td data-label="Expense name"><span>{income.name}</span></td>
                                    <td data-label="Category">{income.category}</td>
                                    <td data-label="Amount" className="income-amount">{income.amount}&#x20B9;</td>
                                    <td data-label="Account">{income.bank_account}</td>
                                    <td data-label="More" onClick={() => {
                                        props.toggleExistingRecords();
                                        props.getRecordInfo(income);
                                        setType("income")
                                        setspecificincome(income)
                                    }}>...</td>
                                </tr>)}
                        </tbody>
                    </table>
                </section>}
        </React.Fragment>
    )
}


export default IncomesTable;