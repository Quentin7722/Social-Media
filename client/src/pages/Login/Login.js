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
    <main className="Login">
      <img className="navbar-img" src={background} alt="Logo de Groupomania" />
      <h1>Connexion</h1>
      <div className="LoginForm">
        <label className="label-img" htmlFor="input-username-login">Remplir le champ du nom d'utilisateur</label>
        <input
          id="input-username-login"
          type="text"
          autoComplete="on"
          placeholder="Nom d'utilisateur..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label className="label-img" htmlFor="input-password-login">Remplir le champ du nom d'utilisateur</label>
        <input
          id="input-password-login"
          type="password"
          placeholder="Mot de passe..."
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button value="Connexion" onClick={login}>Se connecter</button>
      </div>
      <p className="msg-err">{errorMessage} </p>
    </main>
  );
}

export default Login;
