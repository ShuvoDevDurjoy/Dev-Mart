import React, { useContext } from 'react'
import './Navbar.css'
import Auth from '../../Component/Auth/Auth'
import { Context } from '../../Context'
const Navbar = ({showAuth, setShowAuth}) => {
  const {authState, userName, setUserName} = useContext(Context);
  return (
    <div className='navbar_main_container'>
      <div className="navbar_inner_container fl al_c ju_sp_bet">
        <div className="navbar_logo">
            <p className='logo'>This is logo</p>
        </div>
        
        <div className="navbar_auth fl al_c">
            {
              ( userName === null && (authState==="Login" || authState==='Sign Up' || authState==="Reset Password") )?
              <p onClick={()=>{setShowAuth(true)}}>{authState}</p>:
              <div>
                <p className='user_name_field'>{userName[0]}</p>
              </div>
            }
        </div>
      </div>
    </div>
  )
}

export default Navbar
