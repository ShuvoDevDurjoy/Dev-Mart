import React, { useState } from 'react'
import { Context } from './Context'
import axios from 'axios'
import { useEffect } from 'react'
const MyContextProvider = ({children}) => {

  const [type,setType] = useState(null);

  const [user_type,setUserType] = useState('user');

  const [authState, setAuthState] = useState("");

  const [isLoggedIn, setLoggedIn] = useState(false);

  const [user_name,setUserName] = useState();
  const [user_password,setUserPassword] = useState();
  const [user_email,setUserEmail] = useState()

  const [authactive, setAuthActive] = useState();

  const [user_id , setUserId] = useState();

  useEffect(()=>{
    (async()=>{
      const response = await axios.get('http://localhost:5000/');
      setType(response.data.name);
    })();
  },[])

  const value = {
    type, 
    setType,
    user_type,
    setUserType,
    isLoggedIn,
    setLoggedIn,
    authState,
    setAuthState,
    user_name,
    user_password,
    user_email,
    setUserName,
    setUserPassword,
    setUserEmail,
    authactive,
    setAuthActive,
    user_id,
    setUserId
  }


  return (
    <Context.Provider value={value}>
        {children}
    </Context.Provider>
  )
}

export default MyContextProvider
