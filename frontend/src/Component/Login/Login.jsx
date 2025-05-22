import React, { useContext, useEffect } from 'react'
import './Login.css'
import { Context } from '../../Context'
import axios from 'axios';
import { toast } from 'react-toastify';
const Login = ({setAuthState}) => {
  const {user_email, setUserEmail, user_password, setUserPassword, setAuthActive, setLoggedIn,user_id,setUserId} = useContext(Context);
  useEffect(()=>{
    setUserEmail("");
    setUserPassword("");
  },[]);

  const loginSubmissionHandler = async()=>{
    try{
      const response = await axios.post('http://localhost:5000/u/login',{email : user_email, password : user_password},{withCredentials : true});
      const data = response.data.message;
      if(response.data.success){
        setAuthActive(false);
        setLoggedIn(true);
        setUserEmail("");
        setUserPassword("");
        setUserId(response.data.id);
        toast(data)
      }
      else{
        toast(data)
      }
    }catch(e){
      toast("Login failed")
    }
  }
  return (
    <div className='login_main_container'>
      <h1 className='auth_heading'>Login</h1>
      <div className={`input_container ${user_email?'active':''}`}>
        <p>Enter Your Email</p>
        <input type="email" name="email" id="email" value={user_email} onChange={(event)=>{setUserEmail(event.target.value)}} />
      </div>
      <div className={`input_container ${user_password?'active':''}`}>
        <p>Enter Your Password</p>
        <input type="password" name="password" id="password"  value={user_password} onChange={(event)=>{setUserPassword(event.target.value)}} />
      </div>
      <div className='submit' onClick={loginSubmissionHandler}><p>Submit</p></div>
      <p className='alternative'>Do not have an account ? <strong className='link' onClick={()=>{setAuthState("Sign Up")}}>Sign Up</strong></p>
      <p className='alternative'>Forgot Password ? <strong className='link' onClick={()=>{setAuthState("Reset Password")}}>Reset Password</strong></p>
    </div>
  )
}

export default Login
