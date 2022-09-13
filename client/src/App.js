import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Upload from "./pages/Upload/Upload";
import Profile from "./pages/Profile/Profile";
import Moderateur from "./pages/Moderateur/Moderateur";
import React, { useState, useEffect } from "react";

function App() {

  const loggedIn = JSON.parse(localStorage.getItem("loggedIn"))
  const [isLoggedIn, setisloggedIn] = useState(loggedIn);
  const role = localStorage.getItem("role");
  const [userRole, setuserRole] = useState(role);
  
  
  useEffect(() => {
        setInterval(() => {
          const loggedIn = JSON.parse(localStorage.getItem("loggedIn"))
          const role = localStorage.getItem("role");
            setisloggedIn(loggedIn);
            setuserRole(role)
            }, 0)
    }, []);

  return (
    <>
      <Router>
          <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />
          <Route path="/" exact render={() => <Home isLoggedIn={isLoggedIn}/>} />
          <Route path="/register" exact render={() => <Register />} />
          <Route path="/login" exact render={() => <Login />} />
          <Route path="/upload" exact render={() => <Upload />} />
          <Route path="/profile" exact render={() => <Profile />} />
          <Route path="/moderateur" exact render={() => <Moderateur />} />
      </Router>
    </>
  );
}

export default App;
