import React, { useContext, useEffect } from 'react'
import { Context } from '../../Context'
import axios from 'axios';

const Reset = ({setAuthState}) => {
    const {user_email,setUserEmail,setAuthActive} = useContext(Context);
    useEffect(()=>{setUserEmail("")},[]);
    const resetPasswordHandler = async()=>{
        try{
            const response = await axios.post('http://localhost:5000/u/reset/password',{email : user_email},{withCredentials : true});
            const data =  response.data.message;
            window.alert(data);
            if(response.data.success){
                setAuthActive(false);
                window.alert(data);
            }else{
                window.alert(data)
            }
        }catch(e){
            window.alert("Connection Failed");
        }
    }
  return (
    <div className='reset_password_container'>
        <h1 className='auth_heading'>Reset Password</h1>
      <div className={`input_container ${user_email?'active':''}`}>
        <p>Enter Your Email</p>
        <input type="email" name="email" id="email" value={user_email} onChange={(event)=>{setUserEmail(event.target.value)}} />
      </div>
      <div className="submit_button">
        <p className='submit' onClick={resetPasswordHandler}>Submit</p>
      </div>
      <p className="alternative">Already have an account ? <strong className="link" onClick={()=>{setAuthState("Login")}}>Login</strong></p>
      <p className="alternative">Do not have an account ? <strong className='link' onClick={()=>{setAuthState("Sign Up")}}>Sign Up</strong></p>
    </div>
  )
}

export default Reset
