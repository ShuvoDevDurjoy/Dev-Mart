import React from 'react'
import './Navbar.css'
import Auth from '../../Component/Auth/Auth'
const Navbar = () => {
  return (
    <div className='navbar_main_container'>
      <div className="navbar_inner_container fl al_c ju_sp_bet">
        <div className="navbar_logo">
            <p className='logo'>This is logo</p>
        </div>
        
        <div className="navbar_auth fl al_c">
            <Auth />
        </div>
      </div>
    </div>
  )
}

export default Navbar
