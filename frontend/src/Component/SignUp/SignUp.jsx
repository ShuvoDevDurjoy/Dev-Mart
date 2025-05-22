import React, { useContext, useEffect } from 'react'
import './SignUp.css'
import { Context } from '../../Context'
import axios from 'axios';
const SignUp = ({setAuthState}) => {
  const {user_name,setUserName,user_email,setUserEmail,user_password,setUserPassword,setAuthActive} = useContext(Context);
  useEffect(()=>{
    setUserEmail("");
    setUserName("");
    setUserPassword("");
  },[])
  const submissionHandler = async()=>{
    try{
      const response = await axios.post('http://localhost:5000/u/sign_up',{name : user_name,email : user_email,password : user_password},{withCredentials : true});
      const data = response.data.message;
      if(response.data.success){
        setAuthActive(false);
        setUserEmail("");
        setUserName("");
        setUserPassword("");
        window.alert(data);
      }
      else{
        window.alert(data);
      }
    }catch(e){
      window.alert("Connection failed");
    }
  }
  return (
    <div className='signup_main_container'>
      <h1 className='auth_heading'>Sign Up</h1>
      <div className={`input_container ${user_name?'active':''}`}>
        <p>Enter Your Name</p>
        <input  type="text" name="name" id="name" onChange={(event)=>{setUserName(event.target.value)}} />
      </div>
      <div className={`input_container ${user_email?'active':''}`}>
        <p>Enter Your Email</p>
        <input type="email" name="email" id="email" onChange={(event)=>{setUserEmail(event.target.value)}} />
      </div>
      <div className={`input_container ${user_password?'active':''}`}>
        <p>Enter Your Password</p>
        <input type="password" name="password" id="password" onChange={(event)=>{setUserPassword(event.target.value)}} />
      </div>
      <div className="submit" onClick={submissionHandler}>Submit</div>
      <p>Already have an account? <strong className='link' onClick={()=>{setAuthState("Login")}}>Login</strong></p>
    </div>
  )
}

export default SignUp
