import React, { useEffect, useState } from 'react'
import './Auth.css'
// import Login from '../Login/Login';
// import SignUp from '../SignUp/SignUp';

const Auth = (setShowAuth, showAuth) => {
  const [authState, setAuthState] = useState('Login');
  useEffect(()=>{
    setAuthState('Login')
  },[]);
  return (
    <div className='auth_main_container' onClick={()=>{setShowAuth(true)}}>
        {
          authState==='Login'?"Login":"Sign Up"
        }
    </div>
  )
}

export default Auth
