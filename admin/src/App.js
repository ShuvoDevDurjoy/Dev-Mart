import React, { useContext, useState } from "react";
import Navbar from "./Container/Navbar/Navbar";
import Home from "./Container/Home/Home";
import "./App.css";
import Login from "./Component/Login/Login";
import { Context } from "./Context";

const App = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { authState, setAuthState } = useContext(Context);
  return (
    <div className="app_main_container">
      <Navbar showAuth={showAuth} setShowAuth={setShowAuth} />
      {(showAuth && (authState=== "Sign Up" || authState === "Login" || authState==="Reset Password")) && (
        <Login
          authState={authState}
          setAuthState={setAuthState}
          showAuth={showAuth}
          setShowAuth={setShowAuth}
        ></Login>
      )}
      <Home />
    </div>
  );
};

export default App;
