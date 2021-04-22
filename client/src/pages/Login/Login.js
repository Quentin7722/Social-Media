import React, { useState } from "react";
import "./Login.css";
import background from '../../assets/icon.png';
import Axios from "axios";
import { useHistory } from "react-router-dom";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let history = useHistory();

  const login = () => {

    checkTextInput();
    if (checkTextInput() === true) {
      Axios.post("http://localhost:3001/user/login", {
        username: username,
        password: password,
      }).then((response) => {
        localStorage.setItem("username", response.data.userName);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("loggedIn", true);
        history.push("/");
      }).catch(function (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      });
    }
  };

  const checkTextInput = () => {
    if (!username.trim() && !password.trim()) {
      setErrorMessage("Les champs sont vides");
      return false;
    } else if (!username.trim()) {
      setErrorMessage("Le champ nom d'utilisateur est vide")
      return false;
    } else if (!password.trim()) {
      setErrorMessage("Le champ mot de passe est vide");
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="Login">
      <img className="navbar-img" src={background} alt="Logo" />
      <h1>Connexion</h1>
      <div className="LoginForm">
        <input
          type="text"
          placeholder="Nom d'utilisateur..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe..."
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={login}>Se connecter</button>
      </div>
      <p className="msg-err">{errorMessage} </p>
    </div>
  );
}

export default Login;
