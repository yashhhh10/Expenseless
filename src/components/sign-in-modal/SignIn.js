import React from "react";
import "./signIn.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import users from "../../data/Users";

const SignIn = (props) => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [validations, setValidations] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const validateAll = () => {
    const { email, password } = values;
    const validations = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      validations.email = "Email is required";
      isValid = false;
    }
    if (!password) {
      validations.password = "Password is required";
      isValid = false;
    }
    if (!isValid) {
      setValidations(validations);
    }
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const HandleSignIn = async (e) => {
    e.preventDefault();
    const isValid = validateAll();
    const validations = { email: "", password: "" };
    const { email, password } = values;
    if (!isValid) {
      return false;
    }
    const response = await fetch(`https://expenseless-backend.onrender.com/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const json = await response.json();
    const username = json.username;
    if (response.ok) {
      props.closeLogin();
      sessionStorage.setItem("user", JSON.stringify(username));
      sessionStorage.setItem("authtoken", json.authtoken);
      props.onLogin(json.username);
      navigate("/dashboard");
    } else {
      validations.email = json;
      setValidations(validations);
      return false;
    }
  };

  const { email, password } = values;
  const { email: emailVal, password: passwordVal } = validations;

  return (
    <div className="modal">
      <div className="modal__overlay" />
      <div className="modal__box">
        <div className="modal__close">
          <button onClick={props.closeLogin}>
            <span>&#10005;</span>
          </button>
        </div>
        <div className="modal__title">Log In</div>
        <div className="modal__sub_title">Log in to get started</div>
        <div className="modal__content">
          <form onSubmit={HandleSignIn}>
            <ul>
              <li>
                <label htmlFor="email">
                  Email:<span className="required">*</span>
                </label>
                <input name="email" value={email} onChange={handleChange} />
                <div className="error-msg">{emailVal}</div>
              </li>
              <li>
                <label htmlFor="password">
                  Password:<span className="required">*</span>
                </label>
                <input
                  value={password}
                  name="password"
                  type="password"
                  onChange={handleChange}
                />
                <div className="error-msg">{passwordVal}</div>
              </li>
              <li>
                <button className="submit-btn" type="submit">
                  Log in
                </button>
              </li>
            </ul>
          </form>
          <section className="signin-forgotpass">
            <button
              onClick={() => {
                props.closeLogin();
                props.openForgotPassword();
              }}
              className="forgot-pass-link"
            >
              Forgot your password?
            </button>
            <button
              className="signup-btn basic-button"
              onClick={() => {
                props.closeLogin();
                props.openSignup();
              }}
            >
              Don't have an account?
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
