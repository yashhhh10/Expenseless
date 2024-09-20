import React, { useContext, useEffect, useState } from "react";
import CloseRecordModal from "./CloseRecordModal";
import categories from "../../data/Categories.js";
import ExpensesContext from "../../Context/Context";

const ExistingExpenseincome = (props) => {
  const context = useContext(ExpensesContext);
  const { specificexpense, specificincome, Type } = context;
  const [current, setcurrent] = useState("");
  useEffect(() => {
    if (Type === "income") {
      setcurrent(specificincome);
    }
    else {
      setcurrent(specificexpense);
    }
  }, [Type])


  return (
    <article className="add-existing-modal">
      {props.successMessage ? (
        <section className="add-existing-popup">
          <p>{props.successMessage}</p>
        </section>
      ) : props.editMode ? (
        <section className="add-existing-popup">
          <CloseRecordModal closeModal={props.closeModal} />
          <form onSubmit={props.updateAddedExpense}>
            <section className="recording-data">
              <input
                name="name"
                onChange={props.handleEditValidation}
                type="text"
                placeholder={current.name}
                value={props.editFormValue.name}
              />
              <label htmlFor="category">
                Category:
                <select
                  onChange={props.handleEditValidation}
                  value={current.category}
                  name="category"
                >
                  <option defaultChecked>Select category</option>
                  {categories.map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="amount">
                Amount:
                <input
                  onChange={props.handleEditValidation}
                  name="amount"
                  type="text"
                  placeholder={`${current.amount} \u20B9`}
                />
              </label>
              {props.editFormError.amount ? (
                <span className="modal-input-err">
                  {props.editFormError.amount}
                </span>
              ) : null}
              {/* <label htmlFor="created">
                                Date:
                                <input onChange={props.handleEditValidation} name="created" type="date" />
                            </label> */}
              <label htmlFor="note">
                Note:
                <textarea
                  onChange={props.handleEditValidation}
                  name="note"
                  type="text"
                  placeholder={current.note}
                />
              </label>
            </section>
            <section className="existing-record-buttons">
              <button type="submit">Save changes</button>
              <button onClick={props.cancelEditExpenseRecord}>Cancel</button>
            </section>
          </form>
        </section>
      ) : (
        <section className="add-existing-popup">
          <CloseRecordModal closeModal={props.closeModal} />
          <h2>{current.name}</h2>
          <section className="recording-data">
            <p>
              Category: <span>{current.category}</span>
            </p>
            <p>
              Amount:{" "}
              <span>
                {current.amount} &#x20B9;
              </span>
            </p>
            {/* <p>Date: <span>{props.recordInfo.created}</span></p> */}
            <p>
              Note: <span>{current.note}</span>
            </p>
          </section>
          <section className="existing-record-buttons">
            <button
              onClick={() => {
                props.editExpenseRecord();
                props.identifyRecord(
                  current._id,
                  props.recordInfo.type
                );
              }}
            >
              Edit
            </button>
            <button onClick={() => { props.deleteExistingRecord(Type) }}>Delete</button>
          </section>
        </section>
      )}
    </article>
  );
};

export default ExistingExpenseincome;
