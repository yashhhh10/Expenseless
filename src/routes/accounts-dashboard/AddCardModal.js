import accounts from "../../data/Accounts";
import { useState, useContext, useEffect } from "react";
import AccountContext from "../../Context/Context";

const AddCardModal = (props) => {
  const context = useContext(AccountContext);
  const {
    addaccount,
    getspecificaccount,
    deleteaccount,
    updateaccount,
  } = context;
  const cardColors = [
    { blue: "#01aab8" },
    { purple: "#b796d9" },
    { lightpink: "#e36cbb" },
    { pink: "#dc5d8b" },
    { red: "#fa4242" },
    { orange: "#fe9256" },
    { yellow: "#fae98f" },
    { green: "#75e762" },
  ];

  useEffect(() => {
    if (props.cardInfo) {
      getspecificaccount(props.cardInfo._id);
    }
    // eslint-disable-next-line
  }, []);

  let newaccount = {
    id: "",
    name: "",
    balance: "",
    color: "",
    cardnum: "",
  };
  if (props.cardInfo) {
    newaccount = props.cardInfo;
  }

  const [formValue, setFormValue] = useState(newaccount);
  const [formError, setFormError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // const handleValidation = (e) => {
  //   const { name, value } = e.target;
  //   setFormValue({ ...formValue, [name]: value });
  // };
  const handleValidation = (e) => {
    const { name, value } = e.target;
    // If it's the color field, extract the color value from the event
    const newValue = name === "color" ? e.target.value : value;
    setFormValue({ ...formValue, [name]: newValue });
  };

  const addCard = (e) => {
    e.preventDefault();
    if (!validateForm(formValue)) return false;
    const { name, balance, cardnum, color } = formValue;
    accounts.push(formValue);
    addaccount(name, balance, cardnum, color);
    setFormValue({
      id: "",
      name: "",
      balance: "",
      color: "",
      cardnum: "",
    });
    setSuccessMessage("Added Card Successfuly!");
    setTimeout(() => {
      setSuccessMessage("");
      props.closeModal();
    }, 1000);
  };

  //Edit Card
  const updateCard = (e) => {
    e.preventDefault();

    if (!validateForm(formValue)) return false;

    updateaccount(
      formValue._id,
      formValue.name,
      formValue.balance,
      formValue.cardnum,
      formValue.color
    );

    setSuccessMessage("Updated Card Successfuly!");
    setTimeout(() => {
      setSuccessMessage("");
      props.closeModal();
    }, 1000);
  };

  //Delete Card
  const deleteCard = (e) => {
    e.preventDefault();
    deleteaccount(props.cardInfo._id);
    setSuccessMessage("Card is deleted successfuly!");
    setTimeout(() => {
      setSuccessMessage("");
      props.closeModal();
    }, 1000);
  };

  const validateForm = (value) => {
    let errors = {};
    let isValid = true;
    if (!value.name) {
      errors.name = "Please enter name";
      isValid = false;
    }
    if (!value.balance) {
      errors.balance = "Please enter current balance";
      isValid = false;
    } else if (isNaN(value.balance)) {
      errors.balance = "Please enter a valid amount in numbers";
      isValid = false;
    }
    if (!isValid) {
      setFormError(errors);
    }
    return isValid;
  };

  const getColorCode = (colorName) => {
    const colorObject = cardColors.find((c) => Object.keys(c)[0] === colorName);
    return colorObject ? Object.values(colorObject)[0] : ""; // Returns color code or empty string if not found
  };

  return (
    <article className="add-card-modal">
      <section className="add-card-popup">
        <button onClick={props.closeModal} className="close-modal">
          &#10005;
        </button>
        <h2>New account</h2>
        {successMessage ? (
          <div>{successMessage}</div>
        ) : (
          <form onSubmit={props.cardInfo ? updateCard : addCard}>
            <section className="form-inner">
              <input
                type="text"
                name="name"
                placeholder="Enter account name"
                value={formValue.name?formValue.name:""}
                onChange={handleValidation}
              />
              {formError.name ? (
                <span className="modal-input-err">{formError.name} </span>
              ) : null}
              <input
                type="text"
                name="cardnum"
                placeholder="Account number (optional)"
                value={formValue.cardnum?formValue.cardnum:""}
                onChange={handleValidation}
              />

              <section className="card-cover">
                <input
                  className="add-card-amount"
                  name="balance"
                  type="text"
                  placeholder="0"
                  value={formValue.balance?formValue.balance:""}
                  onChange={handleValidation}
                />
                {formError.balance ? (
                  <span className="modal-input-err">{formError.balance}</span>
                ) : null}
              </section>
              <section className="add-card-colors">
                <h4>Color:</h4>
                {cardColors.map((c, index) => {
                  return (
                    <section className="add-card-color" key={index}>
                      <input
                        type="radio"
                        className="sb-checkbox__input"
                        id={index}
                        name="color"
                        value={Object.values(c)}
                        onChange={handleValidation}
                      />
                      <label
                        className={`sb-checkbox__label sb-checkbox__label--${Object.keys(
                          c
                        )}`}
                        htmlFor={index}
                      ></label>
                    </section>
                  );
                })}
              </section>
            </section>
            {props.cardInfo ? (
              <section className="view-category-buttons">
                <button className="dash-button" type="submit">
                  Update
                </button>
                <button className="dash-button" onClick={deleteCard}>
                  Delete
                </button>
              </section>
            ) : (
              <button className="dash-button" type="submit">
                Create
              </button>
            )}
          </form>
        )}
      </section>
    </article>
  );
};

export default AddCardModal;
