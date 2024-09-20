import "./profileDashboard.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountContext from "../../Context/Context";

const ProfileDashboard = (props) => {
  const context = useContext(AccountContext);
  const { getuser, specificuser, setspecificuser, updateuser, deleteuser } =
    context;
  useEffect(() => {
    if (sessionStorage.getItem("authtoken")) {
      getuser();
    }
    // eslint-disable-next-line
  }, []);

  const [editModeEnabled, setEditModeEnabled] = useState(false);
  const [userValue, setUserValue] = useState(specificuser);
  const [formError, setFormError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserValue({ ...userValue, [name]: value });
  };
  
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    if (!userValue.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    if (userValue.email && !/\S+@\S+\.\S+/.test(userValue.email)) {
      errors.email = "Email format must be as example@mail.com";
      isValid = false;
    }
    if (!userValue.password) {
      errors.password = "Password is required";
      isValid = false;
    }
    if (userValue.password && userValue.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }
    if (!isValid) {
      setFormError(errors);
    }
    return isValid;
  };

  //Update profile
  const updateProfile = async () => {
    if (!validateForm()) return false;

    setspecificuser(Object.assign({}, userValue));
    updateuser(
      userValue.email,
      userValue.language,
      userValue.currency,
      userValue.subscription
    );
    setSuccessMessage("Updated Profile Information Successfuly!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
    setEditModeEnabled(false);
  };

  //Cancel Update
  const cancelUpdate = () => {
    setEditModeEnabled(false);
    setUserValue(specificuser);
    setFormError({});
  };

  // Deactivate account
  const deactivate = async() => {
    const password = window.prompt("Please enter your password:");
    if (password !== null) {
      await deleteuser(specificuser.email, password);
      if (sessionStorage.getItem("authtoken")) {
        window.alert("Incorrect password. Deactivation canceled.");
      } else {
        props.logout();
        navigate("/");
      }
    }
  };

  return (
    <main className="profile-dashboard">
      <div className="header">
        <h1>Profile</h1>
      </div>
      <article className="profile">
        {successMessage ? (
          <div className="success-msg">{successMessage}</div>
        ) : null}
        <form onSubmit={(e) => e.preventDefault()}>
          <ul>
            <li>
              <h3>Email</h3>
              {editModeEnabled ? (
                <input
                  name="email"
                  onChange={handleInputChange}
                  value={userValue.email}
                  disabled={!editModeEnabled}
                />
              ) : (
                specificuser.email
              )}
              {formError.email ? (
                <span className="input-err">{formError.email}</span>
              ) : null}
            </li>
            <li>
              <h3>Language</h3>
              {editModeEnabled ? (
                <select
                  onChange={handleInputChange}
                  name="language"
                  defaultValue={userValue.language}
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              ) : (
                specificuser.language
              )}
            </li>
            <li>
              <h3>Currency</h3>
              {editModeEnabled ? (
                <select
                  onChange={handleInputChange}
                  name="currency"
                  defaultValue={userValue.currency}
                >
                  <option value="INR">Indian Rupee</option>
                  <option value="EUR">EUR</option>
                  <option value="USD ">USD</option>
                </select>
              ) : (
                specificuser.currency
              )}
            </li>
            <li>
              <h3>Subscription</h3>
              {editModeEnabled ? (
                <select
                  onChange={handleInputChange}
                  name="subscription"
                  defaultValue={userValue.subscription}
                >
                  <option value="Basic">Basic</option>
                  <option value="Business ">Business</option>
                </select>
              ) : (
                specificuser.subscription
              )}
            </li>
          </ul>
          {editModeEnabled ? (
            <section className="profile-buttons">
              <button className="dash-button" onClick={updateProfile}>
                Save
              </button>
              <button className="dash-button" onClick={cancelUpdate}>
                Cancel
              </button>
            </section>
          ) : (
            <section className="profile-buttons">
              <button
                className="dash-button"
                onClick={() => {
                  setEditModeEnabled(true);
                  setUserValue(specificuser);
                }}
              >
                Edit
              </button>
              {/* <button className="deactivate-btn dash-button">
                Deactivate account
              </button> */}
              <button
                className="deactivate-btn dash-button"
                onClick={deactivate}
              >
                Deactivate account
              </button>
            </section>
          )}
        </form>
      </article>
    </main>
  );
};

export default ProfileDashboard;
