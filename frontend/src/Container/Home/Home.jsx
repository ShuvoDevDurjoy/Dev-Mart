import React, { useContext } from 'react'
import { Context } from '../../Context'
import { Link } from 'react-router-dom'
import './Home.css'
import AuthForm from '../../Component/AuthForm/AuthForm'
import Collections from '../Collections/Collections'

const Home = () => {
  const type = useContext(Context)
  return (
    <div className="home_main_container">
      <Collections />
    </div>
  )
}

export default Home
