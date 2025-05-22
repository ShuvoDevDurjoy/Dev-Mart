import React, { useContext, useEffect, useState } from "react";
import { user_auth_logo } from "../../assets/images";
import "./Auth.css";
import { Context } from "../../Context";
import axios from "axios";

const Auth = () => {  
  const {authState,setAuthState} = useContext(Context);
  const {isLoggedIn,setLoggedIn} = useContext(Context);
  const {authactive,setAuthActive} = useContext(Context);
  const {user_id} = useContext(Context);
  const signOutHandler = async()=>{
    try{
      const response = await axios.post('http://localhost:5000/u/sign_out',{id : user_id},{withCredentials : true});
      window.alert(response.data.message);
      if(response.data.success){
        setLoggedIn(false);
      }
    }catch(e){
      window.alert("Connection Failed");
    }
  }
  return (
    <div className="auth_main_container">
      <div className="auth_hint par_w_h_inh">
        <img src={user_auth_logo} alt="user_auth_logo" />
      </div>
      <div className="auth_absolute_container">
          {
            !isLoggedIn?
            <div className="auth_option_container">
              <div className="auth_option sign_up" onClick={()=>{setAuthState("Sign Up");setAuthActive(true)}}>Sign Up</div>
              <div className="auth_option Login" onClick={()=>{setAuthState("Login"); setAuthActive(true)}}>Login</div>
            </div>:
            <div className="auth_option_container">
              <div className="auth_option sign_out" onClick={signOutHandler}>Sign Out</div>
            </div>
          }
      </div>
    </div>
  );
};

export default Auth;
