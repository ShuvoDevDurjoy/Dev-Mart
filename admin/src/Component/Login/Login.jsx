import React, { useContext, useState } from "react";
import "./Login.css";
import TextInput from "../../Elements/TextInput";
import EmailInput from "../../Elements/EmailInput";
import PasswordInput from "../../Elements/PasswordInput";
import SubmitButton from "../../Elements/SubmitButton";
import axios from "axios";
import { Context } from "../../Context";
const Login = ({ authState, setAuthState, showAuth, setShowAuth }) => {
  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { setUserName } = useContext(Context);
  const onCredentialChange = async (e) => {
    const { name, value } = e.target;

    setUserCredentials({
      ...userCredentials,
      [name]: value,
    });
  };

  const onUserCredentialSubmit = async (event) => {
    try {
      event.preventDefault();
      var authPostUrl;
      if (authState === "Login") {
        authPostUrl = "http://localhost:5000/s/login";
      } else if (authState == "Sign Up") {
        authPostUrl = "http://localhost:5000/s/sign_up";
      } else if (authState == "Reset Password") {
        authPostUrl = "http://localhost:5000/s/reset/password";
        setAuthState("Login")
      }
      console.log("Requesting")
      const response = await axios.post(authPostUrl, userCredentials, {
        withCredentials: true
      });
      console.log('data is : ',response.data);
      if (response.data.success) {
        alert(response.data.message);
        if (authState === "Login") setUserName(response.data.seller_name);
        setShowAuth(false);
      } else {
        alert(response.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return showAuth === true ? (
    <div className="login_main_container">
      <div className="login_inner_container pos_rel">
        <div className="auth_title_container">
          <h2>{authState}</h2>
        </div>
        <div className="login_credential_container">
          {authState === "Sign Up" && (
            <TextInput
              elementName={"name"}
              elementLabel={"Enter Your Name"}
              elementValue={userCredentials.name}
              onChangeHandler={onCredentialChange}
              changeValue={userCredentials.name}
              element_id={"user_name_input_field"}
            ></TextInput>
          )}
          <EmailInput
            elementName={"email"}
            elementLabel={"Enter Your Email"}
            elementValue={userCredentials.email}
            onChangeHandler={onCredentialChange}
            changeValue={userCredentials.email}
            element_id={"user_email_input_field"}
          ></EmailInput>

          {authState != "Reset Password" && (
            <PasswordInput
              elementName={"password"}
              elementLabel={"Enter Your Password"}
              elementValue={userCredentials.password}
              onChangeHandler={onCredentialChange}
              changeValue={userCredentials.password}
              element_id={"user_password_input_field"}
            ></PasswordInput>
          )}
          <SubmitButton
            button_text={authState}
            onSubmitHandler={onUserCredentialSubmit}
          ></SubmitButton>
        </div>
        <div>
          {authState === "Login" && (
            <div className="mar_10">
              <p className="mar_10">
                Forgot Password?
                <span
                  className="auth_high_con"
                  onClick={() => {
                    setAuthState("Reset Password");
                  }}
                >
                  Reset Password
                </span>
              </p>
              <p>
                Do not have an Account?{" "}
                <span
                  className="auth_high_con"
                  onClick={() => {
                    setAuthState("Sign Up");
                  }}
                >
                  Sign Up
                </span>{" "}
              </p>
            </div>
          )}
          {authState === "Sign Up" && (
            <div className="mar_10">
              <p>
                Already have an Account?{" "}
                <span
                  className="auth_high_con"
                  onClick={() => {
                    setAuthState("Login");
                  }}
                >
                  Login
                </span>{" "}
              </p>
            </div>
          )}
          {authState === "Reset Password" && (
            <div className="mar_10">
              <p>
                Do not have an Account?
                <span
                  className="auth_high_con"
                  onClick={() => {
                    setAuthState("Sign Up");
                  }}
                >
                  Sign Up
                </span>
              </p>
              <p>
                Back To Login?
                <span
                  className="auth_high_con"
                  onClick={() => {
                    setAuthState("Login");
                  }}
                >
                  Login
                </span>
              </p>
            </div>
          )}
        </div>
        <span
          className="pos_abs"
          style={{ top: "10px", right: "20px" }}
          onClick={() => {
            setShowAuth(false);
          }}
        >
          X
        </span>
      </div>
    </div>
  ) : null;
};

export default Login;
