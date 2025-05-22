import React from "react";
import Navbar from "./Container/Navbar/Navbar.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Container/Home/Home";
import AuthForm from "./Component/AuthForm/AuthForm.jsx";
import {Bounce, toast,ToastContainer} from 'react-toastify'
import "./App.css";
const App = () => {
  return (
    <div className="app_main_container">
      <BrowserRouter>
        <Navbar />
        <div className="app_inner_container">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            {/* <Route path='/about' element={<About />} /> */}
            {/* <Route path='/contact' element={<Contact />} /> */}
            {/* <Route path='footer' element={<Footer />} /> */}
          </Routes>
          <AuthForm />
          <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          theme="light"
          transition={Bounce}
          ></ToastContainer>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
