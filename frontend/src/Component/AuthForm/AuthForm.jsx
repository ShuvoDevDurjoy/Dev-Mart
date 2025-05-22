import React, { useContext } from "react";
import { Context } from "../../Context";
import "./AuthForm.css";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Reset from "../Reset/Reset";
import { close_icon } from "../../assets/images.js";

const AuthForm = () => {
  const { authState, setAuthState, authactive, setAuthActive } =
    useContext(Context);
  return (
    <div className={`auth_form_main_container ${authactive ? "active" : ""}`}>
      <div className="close_auth"></div>

      <div className="auth_form_inner_container">
        <div className="auth_close">
          <img
            src={close_icon}
            alt="close_icon"
            onClick={() => {
              setAuthActive(false);
            }}
          />
        </div>
        {authState === "Login" ? (
          <Login setAuthState={setAuthState} />
        ) : authState === "Sign Up" ? (
          <SignUp setAuthState={setAuthState} />
        ) : (
          <Reset setAuthState={setAuthState} />
        )}
      </div>
    </div>
  );
};

export default AuthForm;
