import axios from "axios";
import React, { useEffect, useState } from "react";
import './ResetPassword.css'
import { useParams } from "react-router-dom";

const SellerResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");  // Add token state

  const handleSubmission = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/s/reset_password/m/verified", 
        { 
          token,   // Include token in the request body
          email,
          password 
        }
      );
      console.log(response.data);
        window.alert(response.data.success,response.data.message||"NO message");
    } catch (e) {
      window.alert("Connection Problem",e.message)
      console.log(e.message);
      setEmail("");
      setPassword("");
    }
  };

  useEffect(() => {
    // Correct way to extract token from URL query string
    const queryParams = new URLSearchParams(window.location.search);  // Use window.location.search
    const tokenFromURL = queryParams.get('token');
    if (tokenFromURL) {
      setToken(tokenFromURL);
      console.log("Token from URL:", tokenFromURL);
    }
  }, []);  // Empty dependency array to run only once on component mount

  return (
    <div className="resetPassword_main_container">
      <h1>Welcome To E_Commerce</h1>
      <p>Follow the steps to reset your password</p>
      <input
        type="email"
        name="email"
        id="email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
        placeholder="Enter Email Address"
      />
      <input
        type="password"
        name="password"
        id="password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        placeholder="Enter New Password"
      />

      <div className="submit_button_container" onClick={handleSubmission}>
        Submit
      </div>
    </div>
  );
};

export default SellerResetPassword;
