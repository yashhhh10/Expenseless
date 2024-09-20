import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Routes
import LandingNavigation from "./components/landing-navigation/LandingNavigation";
import Landing from "./routes/landing/Landing";
import About from "./routes/about/About";
import Contact from "./routes/contact/Contact";
import LandingFooter from "./components/landing-footer/LandingFooter";
import SignIn from "./components/sign-in-modal/SignIn";
import Register from "./components/register-modal/Register";
import Dashboard from "./routes/dashboard/Dashboard";
import { useState, useEffect } from "react";
import ForgotPassword from "./components/forgot-password/ForgotPasswor";
import AccountState from "./Context/State";

const App = () => {
  const [isLoginModalOpen, setLoginModal] = useState(false);
  const [isSignupModalOpen, setSignupModal] = useState(false);
  const [isForgotPasswordOpen, setForgotPassword] = useState(false);
  const [user, setUser] = useState(null);

  //Keep user logged in when refreshing the page
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const login = (user) => setUser(user);

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };
  const openLogin = () => setLoginModal(true);
  const openSignup = () => setSignupModal(true);
  const openForgotPassword = () => setForgotPassword(true);

  const closeModal = () => {
    setLoginModal(false);
    setSignupModal(false);
    setForgotPassword(false);
  };

  return (
    <Router>
      <AccountState>
      {isLoginModalOpen && (
        <SignIn
          onLogin={login}
          openSignup={openSignup}
          closeLogin={closeModal}
          openForgotPassword={openForgotPassword}
        />
      )}
      {isSignupModalOpen && (
        <Register
          onRegister={login}
          openLogin={openLogin}
          closeSignup={closeModal}
        />
      )}
      {isForgotPasswordOpen && (
        <ForgotPassword closeForgotPassword={closeModal} />
      )}

      <LandingNavigation
        user={user}
        onLogout={logout}
        openLogin={openLogin}
        openSignup={openSignup}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              openSignup={openSignup}
              isSignupModalOpen={isSignupModalOpen}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/faq" element={<Faq />} />  */}
        <Route
          path="/dashboard/*"
          element={<Dashboard user={user} onLogout={logout} />}
        />
      </Routes>
      <LandingFooter openSignup={openSignup} />
      </AccountState>
    </Router>
  );
};

export default App;
